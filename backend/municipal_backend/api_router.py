from rest_framework import routers

from eventos.api import EventoViewSet
from reservas.api import ReservaViewSet
from reportes.api import ReporteViewSet

router = routers.DefaultRouter()
router.register("eventos", EventoViewSet, basename="evento")
router.register("reservas", ReservaViewSet, basename="reserva")
router.register("reportes", ReporteViewSet, basename="reporte")

urlpatterns = router.urls
