from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from municipal_backend.api_views import (
    DashboardOverviewAPIView,
    FrontendManifestAPIView,
    SessionLoginAPIView,
    SessionLogoutAPIView,
    SessionStatusAPIView,
)

urlpatterns = [
    path("", RedirectView.as_view(pattern_name="cuentas:panel", permanent=False)),
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path(
        "api/dashboard/overview/",
        DashboardOverviewAPIView.as_view(),
        name="dashboard-overview",
    ),
    path(
        "api/frontend/manifest/",
        FrontendManifestAPIView.as_view(),
        name="frontend-manifest",
    ),
    path("api/session/login/", SessionLoginAPIView.as_view(), name="session-login"),
    path("api/session/status/", SessionStatusAPIView.as_view(), name="session-status"),
    path("api/session/logout/", SessionLogoutAPIView.as_view(), name="session-logout"),
    path("api/", include("municipal_backend.api_router")),

    path("cuentas/", include("cuentas.urls")),
    path("eventos/", include("eventos.urls")),
    path("reservas/", include("reservas.urls")),
    path("reportes/", include("reportes.urls")),
    path("notificaciones/", include("notificaciones.urls")),
]
