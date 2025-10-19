from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets

from .models import Evento


class EventoSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    class Meta:
        model = Evento
        fields = [
            "id",
            "titulo",
            "fecha",
            "hora",
            "lugar",
            "estado",
            "estado_display",
            "descripcion",
            "creado",
            "actualizado",
        ]


class EventoViewSet(viewsets.ModelViewSet):
    """API CRUD para eventos institucionales."""

    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    filterset_fields = ["estado", "fecha", "hora"]
    search_fields = ["titulo", "lugar", "descripcion"]
    ordering_fields = ["fecha", "hora", "creado"]
    ordering = ["-fecha", "-hora"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
