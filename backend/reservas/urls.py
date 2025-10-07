from django.urls import path

from . import views

app_name = "reservas"

urlpatterns = [
    path("", views.panel, name="panel"),

    # CRUD
    path("gestionar/", views.ReservaList.as_view(), name="reserva_list"),
    path("gestionar/nueva/", views.ReservaCreate.as_view(), name="reserva_create"),
    path("gestionar/<slug:pk>/", views.ReservaDetail.as_view(), name="reserva_detail"),
    path("gestionar/<slug:pk>/editar/", views.ReservaUpdate.as_view(), name="reserva_update"),
    path("gestionar/<slug:pk>/eliminar/", views.ReservaDelete.as_view(), name="reserva_delete"),
]
