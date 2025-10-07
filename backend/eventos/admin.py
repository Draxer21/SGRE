from django.contrib import admin

from .models import Evento


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ("titulo", "fecha", "hora", "lugar", "estado")
    list_filter = ("estado", "fecha")
    search_fields = ("titulo", "lugar")
