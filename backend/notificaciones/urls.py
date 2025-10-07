from django.urls import path

from . import views

app_name = "notificaciones"

urlpatterns = [
    path("", views.panel, name="panel"),
    path("nueva/", views.nueva, name="nueva"),
    path("historial/", views.historial, name="historial"),
]
