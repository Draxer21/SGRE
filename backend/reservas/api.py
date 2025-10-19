from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets

from .models import Reserva


class ReservaSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    class Meta:
        model = Reserva
        fields = [
            "id",
            "codigo",
            "espacio",
            "fecha",
            "hora",
            "solicitante",
            "estado",
            "estado_display",
            "notas",
            "creado",
            "actualizado",
        ]


class ReservaViewSet(viewsets.ModelViewSet):
    """API CRUD para reservas de espacios municipales."""

    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    filterset_fields = ["estado", "fecha", "espacio"]
    search_fields = ["codigo", "espacio", "solicitante", "notas"]
    ordering_fields = ["fecha", "hora", "creado"]
    ordering = ["-fecha", "-hora"]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
