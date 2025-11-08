from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import render


def panel(request):
    alertas = [
        {
            "titulo": "Recordatorio evento cultura",
            "descripcion": "Correo de recordatorio enviado a 320 asistentes.",
            "fecha": datetime(2025, 6, 5, 9, 30),
            "estado": "Enviado",
        },
        {
            "titulo": "Alerta de cupos agotados",
            "descripcion": "Se notificó al equipo de reservas para abrir nuevo horario.",
            "fecha": datetime(2025, 6, 4, 18, 15),
            "estado": "Escalado",
        },
    ]

    canales = [
        {"nombre": "Correo electrónico", "estado": "Operativo"},
        {"nombre": "Notificación push", "estado": "Operativo"},
        {"nombre": "SMS", "estado": "En revisión"},
    ]

    timeline = [
        {
            "titulo": "Conf. canal push",
            "descripcion": "Se actualizó la plantilla de notificación para eventos deportivos.",
            "fecha": datetime(2025, 6, 5, 11, 10),
            "responsable": "srojas",
        },
        {
            "titulo": "Monitoreo SMS",
            "descripcion": "Proveedor reportó retrasos en envío. Se abre ticket de soporte.",
            "fecha": datetime(2025, 6, 4, 19, 45),
            "responsable": "ifigueroa",
        },
    ]

    context = {
        "alertas": alertas,
        "canales": canales,
        "timeline": timeline,
    }
    return render(request, "notificaciones/index.html", context)


def nueva(request):
    return HttpResponse("Configuración de notificación en construcción.")


def historial(request):
    registros = [
        {
            "titulo": "Aviso de mantencion",
            "canal": "Correo",
            "fecha": datetime(2025, 5, 28, 10, 5),
            "estado": "Enviado",
        },
        {
            "titulo": "Recordatorio de reunion",
            "canal": "Push",
            "fecha": datetime(2025, 5, 27, 16, 40),
            "estado": "Programado",
        },
        {
            "titulo": "Alerta de clima",
            "canal": "SMS",
            "fecha": datetime(2025, 5, 26, 8, 0),
            "estado": "Enviado",
        },
    ]
    return render(
        request,
        "notificaciones/historial.html",
        {"registros": registros},
    )
