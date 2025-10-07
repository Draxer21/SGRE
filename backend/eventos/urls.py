from django.urls import path

from . import views

app_name = "eventos"

urlpatterns = [
    path("", views.panel, name="panel"),

    # CRUD
    path("gestionar/", views.EventoList.as_view(), name="evento_list"),
    path("gestionar/nuevo/", views.EventoCreate.as_view(), name="evento_create"),
    path("gestionar/<int:pk>/", views.EventoDetail.as_view(), name="evento_detail"),
    path("gestionar/<int:pk>/editar/", views.EventoUpdate.as_view(), name="evento_update"),
    path("gestionar/<int:pk>/eliminar/", views.EventoDelete.as_view(), name="evento_delete"),
]
