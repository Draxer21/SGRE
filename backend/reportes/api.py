from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets

from .models import Reporte


class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = [
            "id",
            "titulo",
            "descripcion",
            "fecha",
            "publicado",
            "creado",
            "actualizado",
        ]


class ReporteViewSet(viewsets.ModelViewSet):
    """API CRUD para reportes generados por el sistema."""

    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    filterset_fields = ["publicado", "fecha"]
    search_fields = ["titulo", "descripcion"]
    ordering_fields = ["fecha", "creado"]
    ordering = ["-fecha", "-creado"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
