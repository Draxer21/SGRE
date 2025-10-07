from django.contrib import admin

from .models import Reporte


@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    list_display = ("titulo", "fecha", "publicado")
    list_filter = ("publicado", "fecha")
    search_fields = ("titulo",)
