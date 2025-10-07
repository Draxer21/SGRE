from django.urls import path

from . import views

app_name = "cuentas"

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("", views.panel, name="panel"),

    # CRUD Cuentas
    path("gestionar/", views.CuentaList.as_view(), name="cuenta_list"),
    path("gestionar/nuevo/", views.CuentaCreate.as_view(), name="cuenta_create"),
    path("gestionar/<int:pk>/", views.CuentaDetail.as_view(), name="cuenta_detail"),
    path("gestionar/<int:pk>/editar/", views.CuentaUpdate.as_view(), name="cuenta_update"),
    path("gestionar/<int:pk>/eliminar/", views.CuentaDelete.as_view(), name="cuenta_delete"),
]
