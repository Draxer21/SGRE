from datetime import date, datetime, time

from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from .forms import EventoForm
from .models import Evento


def panel(request):
    agenda = [
        {
            "titulo": "Feria de Innovación Ciudadana",
            "fecha": date(2025, 6, 18),
            "hora": time(10, 0),
            "lugar": "Centro Cultural Municipal",
            "estado": "Confirmado",
        },
        {
            "titulo": "Capacitación en Transparencia Activa",
            "fecha": date(2025, 6, 24),
            "hora": time(9, 30),
            "lugar": "Sala de Consejo",
            "estado": "En convocatoria",
        },
    ]

    hitos = [
        {
            "titulo": "Lanzamiento programa cultura invierno",
            "descripcion": "Se publicaron las bases y cronograma de actividades.",
            "fecha": datetime(2025, 6, 4, 11, 0),
            "responsable": "ccastro",
        },
        {
            "titulo": "Confirmación artistas feria innovación",
            "descripcion": "Se confirmó la participación de 12 emprendedores locales.",
            "fecha": datetime(2025, 6, 2, 17, 15),
            "responsable": "mrios",
        },
    ]

    recursos = [
        {"id": 1, "nombre": "Proyector HD", "estado": "Reservado", "evento": "Capacitación Transparencia"},
        {"id": 2, "nombre": "Sonido portátil", "estado": "Disponible", "evento": None},
        {"id": 3, "nombre": "Stand modular", "estado": "En traslado", "evento": "Feria Innovación"},
    ]

    context = {
        "agenda": agenda,
        "hitos": hitos,
        "recursos": recursos,
    }
    return render(request, "eventos/index.html", context)


# -------- CRUD Eventos --------
class EventoList(ListView):
    model = Evento
    template_name = "eventos/evento_list.html"
    context_object_name = "eventos"


class EventoDetail(DetailView):
    model = Evento
    template_name = "eventos/evento_detail.html"


class EventoCreate(CreateView):
    model = Evento
    form_class = EventoForm
    template_name = "eventos/evento_form.html"
    success_url = reverse_lazy("eventos:evento_list")


class EventoUpdate(UpdateView):
    model = Evento
    form_class = EventoForm
    template_name = "eventos/evento_form.html"
    success_url = reverse_lazy("eventos:evento_list")


class EventoDelete(DeleteView):
    model = Evento
    template_name = "eventos/evento_confirm_delete.html"
    success_url = reverse_lazy("eventos:evento_list")


# -------- Fin CRUD --------
