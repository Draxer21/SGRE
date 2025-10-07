from django.contrib import admin

from .models import Reserva


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ("codigo", "espacio", "fecha", "hora", "solicitante", "estado")
    list_filter = ("estado", "fecha")
    search_fields = ("codigo", "espacio", "solicitante")
