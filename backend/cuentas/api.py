from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .export_utils import export_to_csv
from .models import Cuenta
from .permissions import IsAdminOrReadOnly


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
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filterset_fields = ["rol", "activo"]
    search_fields = ["nombre", "email"]
    ordering_fields = ["creado", "nombre"]
    ordering = ["-creado"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    @action(detail=False, methods=['get'])
    def export(self, request):
        """Exporta las cuentas filtradas a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        fields = ['nombre', 'email', 'rol', 'activo', 'creado']
        return export_to_csv(queryset, fields, filename='cuentas.csv')
