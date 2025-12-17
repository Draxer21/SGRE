from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from cuentas.export_utils import export_to_csv
from cuentas.permissions import IsEditorOrReadOnly
from .models import Evento, ZonaEvento


class ZonaEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZonaEvento
        fields = ["id", "nombre", "cupo_total"]


class EventoSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)
    zonas = ZonaEventoSerializer(many=True, read_only=True)

    class Meta:
        model = Evento
        fields = [
            "id",
            "titulo",
            "fecha",
            "hora",
            "lugar",
            "direccion",
            "estado",
            "estado_display",
            "descripcion",
            "imagen_portada",
            "modo_aforo",
            "cupo_total",
            "zonas",
            "creado",
            "actualizado",
        ]


class EventoViewSet(viewsets.ModelViewSet):
    """API CRUD para eventos institucionales."""

    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated, IsEditorOrReadOnly]
    filterset_fields = ["estado", "fecha", "hora"]
    search_fields = ["titulo", "lugar", "direccion", "descripcion"]
    ordering_fields = ["fecha", "hora", "creado"]
    ordering = ["-fecha", "-hora"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    @action(detail=False, methods=['get'])
    def export(self, request):
        """Exporta los eventos filtrados a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        fields = ['titulo', 'fecha', 'hora', 'lugar', 'direccion', 'modo_aforo', 'cupo_total', 'estado', 'creado']
        return export_to_csv(queryset, fields, filename='eventos.csv')
