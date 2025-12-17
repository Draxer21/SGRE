from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from cuentas.export_utils import export_to_csv
from cuentas.permissions import IsEditorOrReadOnly
from eventos.models import Evento, ZonaEvento
from .models import Reserva


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
        evento = attrs.get("evento") or getattr(self.instance, "evento", None)
        zona = attrs.get("zona") if "zona" in attrs else getattr(self.instance, "zona", None)
        cupos = attrs.get("cupos_solicitados") or getattr(self.instance, "cupos_solicitados", 0)

        if not evento:
            raise serializers.ValidationError({"evento": "Debes elegir un evento."})

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
    permission_classes = [IsAuthenticated, IsEditorOrReadOnly]
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

    @action(detail=False, methods=['get'])
    def export(self, request):
        """Exporta las reservas filtradas a CSV."""
        queryset = self.filter_queryset(self.get_queryset())
        fields = ['codigo', 'espacio', 'fecha', 'hora', 'solicitante', 'estado', 'evento', 'zona', 'cupos_solicitados', 'creado']
        return export_to_csv(queryset, fields, filename='reservas.csv')
