from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters as drf_filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from cuentas.export_utils import export_to_csv
from cuentas.permissions import IsAdminOrEditor
from .models import Reporte


class ReporteFilter(filters.FilterSet):
    categoria = filters.CharFilter(method="filter_categoria")

    def filter_categoria(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(categorias__contains=[value])

    class Meta:
        model = Reporte
        fields = {
            "publicado": ["exact"],
            "fecha": ["exact", "gte", "lte"],
        }


class ReporteSerializer(serializers.ModelSerializer):
    categorias = serializers.ListField(
        child=serializers.ChoiceField(choices=Reporte.CATEGORIAS),
        allow_empty=True,
        required=False,
    )

    class Meta:
        model = Reporte
        fields = [
            "id",
            "titulo",
            "descripcion",
            "fecha",
            "publicado",
            "categorias",
            "creado",
            "actualizado",
        ]


class ReporteViewSet(viewsets.ModelViewSet):
    """API CRUD para reportes generados por el sistema."""

    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEditor]
    filterset_class = ReporteFilter
    search_fields = ["titulo", "descripcion", "categorias"]
    ordering_fields = ["fecha", "creado"]
    ordering = ["-fecha", "-creado"]
    filter_backends = [DjangoFilterBackend, drf_filters.SearchFilter, drf_filters.OrderingFilter]

    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrEditor])
    def export(self, request):
        """Exporta los reportes filtrados a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        fields = ['titulo', 'fecha', 'publicado', 'creado']
        return export_to_csv(queryset, fields, filename='reportes.csv')
