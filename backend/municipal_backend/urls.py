from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    path("cuentas/", include("cuentas.urls")),
    path("eventos/", include("eventos.urls")),
    path("reservas/", include("reservas.urls")),
    path("reportes/", include("reportes.urls")),
    path("notificaciones/", include("notificaciones.urls")),
]
