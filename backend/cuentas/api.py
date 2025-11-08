from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets

from .models import Cuenta


class CuentaSerializer(serializers.ModelSerializer):
    rol_display = serializers.CharField(source="get_rol_display", read_only=True)

    class Meta:
        model = Cuenta
        fields = [
            "id",
            "nombre",
            "email",
            "rol",
            "rol_display",
            "activo",
            "creado",
            "actualizado",
        ]


class CuentaViewSet(viewsets.ModelViewSet):
    """API CRUD para cuentas de usuarios municipales."""

    queryset = Cuenta.objects.all()
    serializer_class = CuentaSerializer
    filterset_fields = ["rol", "activo"]
    search_fields = ["nombre", "email"]
    ordering_fields = ["creado", "nombre"]
    ordering = ["-creado"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
