from datetime import date

from django.http import HttpResponse
from django.shortcuts import render


def panel(request):
    indicadores = [
        {"nombre": "Asistencia promedio", "valor": "82%", "tendencia": "+5% respecto al mes anterior"},
        {"nombre": "Eventos realizados", "valor": "18", "tendencia": "+2"},
        {"nombre": "Reservas confirmadas", "valor": "146", "tendencia": "+9%"},
        {"nombre": "Avisos enviados", "valor": "320", "tendencia": "-3%"},
    ]

    reportes = [
        {"titulo": "Reporte mensual de eventos", "descripcion": "Detalle de asistencia, costos y feedback.", "fecha": date(2025, 6, 1)},
        {"titulo": "Ocupación de espacios", "descripcion": "Uso de salas y anfiteatros por semana.", "fecha": date(2025, 6, 3)},
        {"titulo": "Alertas críticas", "descripcion": "Incidencias y tiempos de respuesta.", "fecha": date(2025, 6, 5)},
    ]

    series = [
        {"nombre": "Reservas confirmadas", "valor": "146", "variacion": "+12"},
        {"nombre": "Cancelaciones", "valor": "18", "variacion": "-3"},
        {"nombre": "Recordatorios enviados", "valor": "280", "variacion": "+20"},
    ]

    context = {
        "indicadores": indicadores,
        "reportes": reportes,
        "series": series,
    }
    return render(request, "reportes/index.html", context)


def generar(request):
    return HttpResponse("Generación de reportes personalizados en construcción.")


def exportar(request):
    return HttpResponse("Exportación a formatos externos disponible próximamente.")
