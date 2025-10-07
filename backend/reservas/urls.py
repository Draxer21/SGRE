from django.urls import path

from . import views

app_name = "reservas"

urlpatterns = [
    path("", views.panel, name="panel"),
    path("nueva/", views.crear, name="nueva"),
    path("cancelar/<slug:codigo>/", views.cancelar, name="cancelar"),
]
