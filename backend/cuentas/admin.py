from django.contrib import admin

from .models import Cuenta, SolicitudEliminacionCuenta


@admin.register(Cuenta)
class CuentaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "usuario", "email", "rol", "activo", "creado")
    list_filter = ("rol", "activo")
    search_fields = ("nombre", "usuario", "email")


@admin.register(SolicitudEliminacionCuenta)
class SolicitudEliminacionCuentaAdmin(admin.ModelAdmin):
    list_display = ("email", "nombre", "estado", "creado")
    list_filter = ("estado",)
    search_fields = ("nombre", "email")
