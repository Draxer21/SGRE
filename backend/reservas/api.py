from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, serializers, viewsets
from rest_framework.decorators import action

from cuentas.export_utils import export_to_csv
from cuentas.models import Cuenta
from cuentas.permissions import IsAdminOrEditor, get_user_role
from eventos.models import Evento, ZonaEvento
from .models import Reserva


class IsReservaRequester(permissions.BasePermission):
    """
    Permite crear reservas a cualquier usuario autenticado.
    Solo admins/editores pueden editar o eliminar.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        if request.method == "POST":
            return True

        role = get_user_role(request.user)
        return request.user.is_superuser or role in [Cuenta.ADMIN, Cuenta.EDITOR]

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            role = get_user_role(request.user)
            if request.user.is_superuser or role in [Cuenta.ADMIN, Cuenta.EDITOR]:
                return True
            return obj.solicitante == request.user.get_username()

        role = get_user_role(request.user)
        return request.user.is_superuser or role in [Cuenta.ADMIN, Cuenta.EDITOR]


class ReservaSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)
    evento_titulo = serializers.CharField(source="evento.titulo", read_only=True)
    zona_nombre = serializers.CharField(source="zona.nombre", read_only=True)
    evento = serializers.PrimaryKeyRelatedField(queryset=Evento.objects.all())
    zona = serializers.PrimaryKeyRelatedField(
        queryset=ZonaEvento.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Reserva
        fields = [
            "id",
            "codigo",
            "espacio",
            "fecha",
            "hora",
            "solicitante",
            "evento",
            "evento_titulo",
            "zona",
            "zona_nombre",
            "cupos_solicitados",
            "estado",
            "estado_display",
            "notas",
            "creado",
            "actualizado",
        ]
        read_only_fields = ["codigo", "fecha", "hora", "estado_display", "creado", "actualizado"]

    def validate(self, attrs):
        request = self.context.get("request")
        role = get_user_role(request.user) if request and request.user else None
        is_manager = request and request.user and (
            request.user.is_superuser or role in [Cuenta.ADMIN, Cuenta.EDITOR]
        )
        evento = attrs.get("evento") or getattr(self.instance, "evento", None)
        zona = attrs.get("zona") if "zona" in attrs else getattr(self.instance, "zona", None)
        cupos = attrs.get("cupos_solicitados") or getattr(self.instance, "cupos_solicitados", 0)

        if not evento:
            raise serializers.ValidationError({"evento": "Debes elegir un evento."})

        if not is_manager:
            if not attrs.get("espacio"):
                attrs["espacio"] = evento.lugar or evento.titulo or "Reserva evento"
            if not attrs.get("solicitante") and request and request.user:
                attrs["solicitante"] = request.user.get_username()

        if cupos <= 0:
            raise serializers.ValidationError({"cupos_solicitados": "Debe ser mayor a 0."})

        if evento.modo_aforo == Evento.MODO_GENERAL:
            if zona is not None:
                raise serializers.ValidationError({"zona": "Este evento no usa zonas."})
            reservados = (
                Reserva.objects.filter(evento=evento)
                .exclude(pk=self.instance.pk if self.instance else None)
                .aggregate(total=Sum("cupos_solicitados"))
                .get("total")
                or 0
            )
            disponible = max(evento.cupo_total - reservados, 0)
            if cupos > disponible and evento.cupo_total:
                raise serializers.ValidationError({
                    "cupos_solicitados": f"No hay cupos suficientes. Disponible: {disponible}.",
                })
        else:
            if not zona:
                raise serializers.ValidationError({"zona": "Selecciona una zona."})
            if zona.evento_id != evento.id:
                raise serializers.ValidationError({"zona": "La zona no pertenece a este evento."})
            reservados = (
                Reserva.objects.filter(evento=evento, zona=zona)
                .exclude(pk=self.instance.pk if self.instance else None)
                .aggregate(total=Sum("cupos_solicitados"))
                .get("total")
                or 0
            )
            disponible = max(zona.cupo_total - reservados, 0)
            if cupos > disponible and zona.cupo_total:
                raise serializers.ValidationError({
                    "cupos_solicitados": f"No hay cupos suficientes en la zona. Disponible: {disponible}.",
                })

        return attrs


class ReservaViewSet(viewsets.ModelViewSet):
    """API CRUD para reservas de espacios municipales."""

    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsReservaRequester]
    filterset_fields = ["estado", "fecha", "espacio", "evento", "zona"]
    search_fields = [
        "codigo",
        "espacio",
        "solicitante",
        "notas",
        "evento__titulo",
        "zona__nombre",
    ]
    ordering_fields = ["fecha", "hora", "creado", "cupos_solicitados"]
    ordering = ["-fecha", "-hora"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        if not request or not request.user or not request.user.is_authenticated:
            return queryset.none()

        role = get_user_role(request.user)
        if request.user.is_superuser or role in [Cuenta.ADMIN, Cuenta.EDITOR]:
            return queryset

        return queryset.filter(solicitante=request.user.get_username())

    def perform_create(self, serializer):
        role = get_user_role(self.request.user)
        if self.request.user.is_superuser or role in [Cuenta.ADMIN, Cuenta.EDITOR]:
            serializer.save()
        else:
            serializer.save(
                solicitante=self.request.user.get_username(),
                estado=Reserva.PENDIENTE,
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrEditor])
    def export(self, request):
        """Exporta las reservas filtradas a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        fields = ['codigo', 'espacio', 'fecha', 'hora', 'solicitante', 'estado', 'evento', 'zona', 'cupos_solicitados', 'creado']
        return export_to_csv(queryset, fields, filename='reservas.csv')
