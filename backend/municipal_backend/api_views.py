from datetime import date

from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from cuentas.permissions import get_user_role
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
        username = None
        role = None
        
        if request.user.is_authenticated:
            username = request.user.get_username()
            role = get_user_role(request.user)
        else:
            username = request.session.get("usuario_actual")
            
        return Response(
            {
                "isAuthenticated": bool(username),
                "username": username,
                "role": role,
            }
        )


class SessionLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or request.data.get("password_plain") or ""
        remember = bool(request.data.get("remember"))

        if not username or not password:
            return Response(
                {"detail": "Debes indicar usuario y contraseña."},
                status=400,
            )

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=400,
            )

        login(request, user)
        request.session["usuario_actual"] = user.get_username()
        if not remember:
            request.session.set_expiry(0)

        role = get_user_role(user)

        return Response(
            {
                "detail": "Sesión iniciada.",
                "username": user.get_username(),
                "role": role,
            }
        )


class SessionLogoutAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        request.session.flush()
        return Response({"detail": "Sesión finalizada"})


class FrontendManifestAPIView(APIView):
    """Expone metadatos que el frontend (Vite) consume para mostrar la UI."""

    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            "brand": {
                "title": "SGRE",
                "subtitle": "Gestion Municipal",
                "header": {
                    "heading": "Municipalidad",
                    "intro": "Sistema de Gestion de Reservas y Eventos.",
                },
            },
            "navigation": [
                {"to": "/dashboard", "label": "Panel"},
                {"to": "/cuentas", "label": "Cuentas"},
                {"to": "/eventos", "label": "Eventos"},
                {"to": "/reservas", "label": "Reservas"},
                {"to": "/reportes", "label": "Reportes"},
                {"to": "/notificaciones", "label": "Notificaciones"},
            ],
            "styleBundles": ["cuentas"],
            "footer": {
                "links": {
                    "panorama": [
                        {"label": "Reportes", "href": "/reportes/"},
                        {"label": "Eventos", "href": "/eventos/"},
                        {"label": "Reservas", "href": "/reservas/"},
                        {"label": "Notificaciones", "href": "/notificaciones/"},
                    ],
                    "recursos": [
                        {"label": "Documentacion API", "href": "/api/docs/"},
                        {"label": "ReDoc", "href": "/api/redoc/"},
                        {"label": "Administracion", "href": "/admin/"},
                        {"label": "Politicas y terminos", "href": "#"},
                    ],
                    "comunidad": [
                        {"label": "Transparencia", "href": "#"},
                        {"label": "Blog", "href": "#"},
                        {"label": "Contacto", "href": "#"},
                        {"label": "Soporte", "href": "#"},
                    ],
                },
            },
        }
        return Response(data)
