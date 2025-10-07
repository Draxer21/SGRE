from django.urls import path

from . import views

app_name = "cuentas"

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("", views.panel, name="panel"),
    path("nuevo/", views.nuevo, name="nuevo"),
    path("<int:usuario_id>/", views.detalle, name="detalle"),
]
