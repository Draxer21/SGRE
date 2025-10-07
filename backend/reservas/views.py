from datetime import date, time

from django.http import HttpResponse
from django.shortcuts import render


def panel(request):
    reservas_activas = [
        {
            "codigo": "RES-2045",
            "espacio": "Auditorio Municipal",
            "fecha": date(2025, 6, 12),
            "hora": time(18, 0),
            "solicitante": "Dirección de Cultura",
            "ocupacion": 78,
        },
        {
            "codigo": "RES-2046",
            "espacio": "Sala de Reuniones Norte",
            "fecha": date(2025, 6, 15),
            "hora": time(9, 30),
            "solicitante": "Departamento de Obras",
            "ocupacion": 45,
        },
    ]

    espacios_raw = [
        {"nombre": "Auditorio Municipal", "capacidad": 250, "ocupados": 195},
        {"nombre": "Sala de Prensa", "capacidad": 80, "ocupados": 22},
        {"nombre": "Anfiteatro Parque Central", "capacidad": 420, "ocupados": 320},
    ]

    espacios = []
    for item in espacios_raw:
        capacidad = item["capacidad"] or 1
        ocupados = item["ocupados"]
        ocupacion = round((ocupados / capacidad) * 100)
        espacios.append({
            **item,
            "disponibles": capacidad - ocupados,
            "ocupacion": ocupacion,
        })

    espera = [
        {
            "solicitante": "Programa Jóvenes",
            "espacio": "Auditorio Municipal",
            "estado": "Pendiente de confirmación",
        },
        {
            "solicitante": "Turismo",
            "espacio": "Parque Central",
            "estado": "Requiere aprobación",
        },
    ]

    context = {
        "reservas_activas": reservas_activas,
        "espacios": espacios,
        "espera": espera,
    }
    return render(request, "reservas/index.html", context)


def crear(request):
    return HttpResponse("Registro de reserva en construcción.")


def cancelar(request, codigo):
    return HttpResponse(f"Cancelación de la reserva {codigo} en construcción.")
