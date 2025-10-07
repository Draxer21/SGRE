from django.urls import path

from . import views

app_name = "reportes"

urlpatterns = [
    path("", views.panel, name="panel"),
    path("generar/", views.generar, name="generar"),
    path("exportar/", views.exportar, name="exportar"),
]
