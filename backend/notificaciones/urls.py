from django.urls import path

from . import views

app_name = "notificaciones"

urlpatterns = [
    path("", views.panel, name="panel"),
    path("nueva/", views.nueva, name="nueva"),
    path("historial/", views.historial, name="historial"),
    path("prueba-correo/", views.prueba_correo, name="prueba_correo"),
]
