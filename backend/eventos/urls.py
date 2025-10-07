from django.urls import path

from . import views

app_name = "eventos"

urlpatterns = [
    path("", views.panel, name="panel"),
    path("crear/", views.crear, name="crear"),
    path("bases/", views.bases, name="bases"),
    path("<int:evento_id>/", views.detalle, name="detalle"),
]
