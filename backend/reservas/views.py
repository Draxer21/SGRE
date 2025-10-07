from datetime import date

from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from .forms import ReservaForm
from .models import Reserva


def panel(request):
    # Panel de ejemplo conservado
    reservas_activas = []
    espacios = []
    espera = []
    return render(request, "reservas/index.html", {"reservas_activas": reservas_activas, "espacios": espacios, "espera": espera})


# -------- CRUD Reservas --------
class ReservaList(ListView):
    model = Reserva
    template_name = "reservas/reserva_list.html"
    context_object_name = "reservas"


class ReservaDetail(DetailView):
    model = Reserva
    template_name = "reservas/reserva_detail.html"


class ReservaCreate(CreateView):
    model = Reserva
    form_class = ReservaForm
    template_name = "reservas/reserva_form.html"
    success_url = reverse_lazy("reservas:reserva_list")


class ReservaUpdate(UpdateView):
    model = Reserva
    form_class = ReservaForm
    template_name = "reservas/reserva_form.html"
    success_url = reverse_lazy("reservas:reserva_list")


class ReservaDelete(DeleteView):
    model = Reserva
    template_name = "reservas/reserva_confirm_delete.html"
    success_url = reverse_lazy("reservas:reserva_list")


# -------- Fin CRUD --------
