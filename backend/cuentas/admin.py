from django.contrib import admin

from .models import Cuenta


@admin.register(Cuenta)
class CuentaAdmin(admin.ModelAdmin):
    list_display = ("nombre", "email", "rol", "activo", "creado")
    list_filter = ("rol", "activo")
    search_fields = ("nombre", "email")
