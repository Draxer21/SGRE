from datetime import date

from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from eventos.models import Evento
from reservas.models import Reserva
from reportes.models import Reporte


class DashboardOverviewAPIView(APIView):
    """Resumen general para el panel principal del frontend React."""

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        today = date.today()

        upcoming_eventos = (
            Evento.objects.filter(fecha__gte=today).order_by("fecha", "hora")[:5]
        )
        upcoming_reservas = (
            Reserva.objects.filter(fecha__gte=today).order_by("fecha", "hora")[:5]
        )

        data = {
            "agenda": [
                {
                    "id": evento.id,
                    "titulo": evento.titulo,
                    "fecha": evento.fecha,
                    "hora": evento.hora,
                    "lugar": evento.lugar,
                    "estado": evento.get_estado_display(),
                }
                for evento in upcoming_eventos
            ],
            "reservas": [
                {
                    "id": reserva.id,
                    "codigo": reserva.codigo,
                    "espacio": reserva.espacio,
                    "fecha": reserva.fecha,
                    "hora": reserva.hora,
                    "solicitante": reserva.solicitante,
                    "estado": reserva.get_estado_display(),
                }
                for reserva in upcoming_reservas
            ],
            "indicadores": {
                "eventos_totales": Evento.objects.count(),
                "reservas_totales": Reserva.objects.count(),
                "reportes_publicados": Reporte.objects.filter(publicado=True).count(),
            },
        }

        return Response(data)


class SessionStatusAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.session.get("usuario_actual")
        return Response(
            {
                "isAuthenticated": bool(username),
                "username": username,
            }
        )


class SessionLogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        request.session.flush()
        return Response({"detail": "Sesión finalizada"})
