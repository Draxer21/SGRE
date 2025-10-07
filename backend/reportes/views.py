from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from .forms import ReporteForm
from .models import Reporte


def panel(request):
    indicadores = []
    reportes = []
    series = []
    return render(request, "reportes/index.html", {"indicadores": indicadores, "reportes": reportes, "series": series})


# -------- CRUD Reportes --------
class ReporteList(ListView):
    model = Reporte
    template_name = "reportes/reporte_list.html"
    context_object_name = "reportes"


class ReporteDetail(DetailView):
    model = Reporte
    template_name = "reportes/reporte_detail.html"


class ReporteCreate(CreateView):
    model = Reporte
    form_class = ReporteForm
    template_name = "reportes/reporte_form.html"
    success_url = reverse_lazy("reportes:reporte_list")


class ReporteUpdate(UpdateView):
    model = Reporte
    form_class = ReporteForm
    template_name = "reportes/reporte_form.html"
    success_url = reverse_lazy("reportes:reporte_list")


class ReporteDelete(DeleteView):
    model = Reporte
    template_name = "reportes/reporte_confirm_delete.html"
    success_url = reverse_lazy("reportes:reporte_list")


# -------- Fin CRUD --------
