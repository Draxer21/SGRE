from django.urls import path

from . import views

app_name = "reportes"

urlpatterns = [
    path("", views.panel, name="panel"),

    # CRUD
    path("gestionar/", views.ReporteList.as_view(), name="reporte_list"),
    path("gestionar/nuevo/", views.ReporteCreate.as_view(), name="reporte_create"),
    path("gestionar/<int:pk>/", views.ReporteDetail.as_view(), name="reporte_detail"),
    path("gestionar/<int:pk>/editar/", views.ReporteUpdate.as_view(), name="reporte_update"),
    path("gestionar/<int:pk>/eliminar/", views.ReporteDelete.as_view(), name="reporte_delete"),
]
