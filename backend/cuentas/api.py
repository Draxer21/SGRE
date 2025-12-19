from django.contrib.auth import get_user_model
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .export_utils import export_to_csv
from .models import Cuenta, SolicitudEliminacionCuenta
from .permissions import IsAdmin, IsAdminOrSelf, get_user_role


class CuentaSerializer(serializers.ModelSerializer):
    rol_display = serializers.CharField(source="get_rol_display", read_only=True)
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        min_length=8,
        style={"input_type": "password"},
    )

    class Meta:
        model = Cuenta
        fields = [
            "id",
            "nombre",
            "usuario",
            "email",
            "rol",
            "rol_display",
            "activo",
            "creado",
            "actualizado",
            "password",
        ]

    def validate_usuario(self, value):
        user_model = get_user_model()
        username_field = user_model.USERNAME_FIELD
        username_max_length = user_model._meta.get_field(username_field).max_length

        if value and len(value) > username_max_length:
            raise serializers.ValidationError(
                f"El usuario supera el maximo permitido ({username_max_length} caracteres)."
            )

        existing_user = user_model.objects.filter(**{username_field: value}).first()
        if existing_user and (not self.instance or value != self.instance.usuario):
            raise serializers.ValidationError("Ya existe un usuario con ese nombre.")

        return value

    def validate_email(self, value):
        if not value:
            return None
        return value

    def validate(self, attrs):
        password = attrs.get("password")
        if password == "":
            attrs["password"] = None
        if not self.instance and not attrs.get("password"):
            raise serializers.ValidationError(
                {"password": "Debes definir una contraseña inicial."}
            )
        return attrs

    def _sync_user(self, cuenta, password=None, previous_usuario=None):
        user_model = get_user_model()
        username_field = user_model.USERNAME_FIELD
        lookup_value = previous_usuario or cuenta.usuario
        user = user_model.objects.filter(**{username_field: lookup_value}).first()

        if user and previous_usuario and cuenta.usuario != previous_usuario:
            setattr(user, username_field, cuenta.usuario)

        if not user:
            user = user_model.objects.filter(**{username_field: cuenta.usuario}).first()

        if not user:
            user = user_model(
                **{
                    username_field: cuenta.usuario,
                    "email": cuenta.email or "",
                    "is_active": cuenta.activo,
                }
            )
            if password:
                user.set_password(password)
            else:
                user.set_unusable_password()
            user.save()
            return

        user.email = cuenta.email or ""
        user.is_active = cuenta.activo
        if password:
            user.set_password(password)
        user.save()

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        cuenta = super().create(validated_data)
        self._sync_user(cuenta, password=password)
        return cuenta

    @transaction.atomic
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        previous_usuario = instance.usuario
        cuenta = super().update(instance, validated_data)
        self._sync_user(cuenta, password=password, previous_usuario=previous_usuario)
        return cuenta


class CuentaSelfSerializer(CuentaSerializer):
    class Meta(CuentaSerializer.Meta):
        read_only_fields = [
            "rol",
            "activo",
            "creado",
            "actualizado",
            "rol_display",
            "id",
            "usuario",
        ]


class CuentaViewSet(viewsets.ModelViewSet):
    """API CRUD para cuentas de usuarios municipales."""

    queryset = Cuenta.objects.all()
    serializer_class = CuentaSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSelf]
    filterset_fields = ["rol", "activo"]
    search_fields = ["nombre", "usuario", "email"]
    ordering_fields = ["creado", "nombre"]
    ordering = ["-creado"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        if not request or not request.user or not request.user.is_authenticated:
            return queryset.none()

        if request.user.is_superuser or get_user_role(request.user) == Cuenta.ADMIN:
            return queryset

        return queryset.filter(usuario=request.user.get_username())

    def get_serializer_class(self):
        request = getattr(self, "request", None)
        if request and request.user and request.user.is_authenticated:
            if not request.user.is_superuser and get_user_role(request.user) != Cuenta.ADMIN:
                if self.action in {"list", "retrieve", "update", "partial_update", "me"}:
                    return CuentaSelfSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        if not (self.request.user.is_superuser or get_user_role(self.request.user) == Cuenta.ADMIN):
            raise serializers.ValidationError("Solo administradores pueden crear cuentas.")
        super().perform_create(serializer)

    def perform_destroy(self, instance):
        user_model = get_user_model()
        username_field = user_model.USERNAME_FIELD
        user_model.objects.filter(**{username_field: instance.usuario}).delete()
        super().perform_destroy(instance)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsAdmin])
    def export(self, request):
        """Exporta las cuentas filtradas a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        fields = ['nombre', 'email', 'rol', 'activo', 'creado']
        return export_to_csv(queryset, fields, filename='cuentas.csv')

    @action(detail=False, methods=["get", "put", "patch"], permission_classes=[IsAuthenticated])
    def me(self, request):
        cuenta = Cuenta.objects.filter(usuario=request.user.get_username()).first()
        if not cuenta:
            return Response({"detail": "Cuenta no encontrada."}, status=404)

        serializer_class = CuentaSelfSerializer
        if request.method == "GET":
            serializer = serializer_class(cuenta)
            return Response(serializer.data)

        serializer = serializer_class(
            cuenta,
            data=request.data,
            partial=request.method == "PATCH",
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated], url_path="solicitar-eliminacion")
    def solicitar_eliminacion(self, request):
        cuenta = Cuenta.objects.filter(email=request.user.get_username()).first()
        if not cuenta:
            return Response({"detail": "Cuenta no encontrada."}, status=404)

        motivo = (request.data.get("motivo") or "").strip()
        solicitud = SolicitudEliminacionCuenta.objects.create(
            cuenta=cuenta,
            nombre=cuenta.nombre,
            email=cuenta.email,
            motivo=motivo,
        )
        return Response(
            {
                "detail": "Solicitud registrada.",
                "id": solicitud.id,
                "estado": solicitud.estado,
            },
            status=201,
        )
