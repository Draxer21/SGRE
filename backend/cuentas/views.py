from datetime import datetime

from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView

from .forms import CuentaForm, LoginForm
from .models import Cuenta


def login_view(request):
    form = LoginForm(request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            username = form.cleaned_data["username"]
            password_hash = form.cleaned_data["password_hash"]

            request.session["usuario_actual"] = username
            request.session["ultimo_login_hash"] = password_hash

            messages.success(request, "Inicio de sesión registrado.")
            return redirect(reverse("cuentas:panel"))
        messages.error(request, "Revisa los datos ingresados.")

    return render(request, "cuentas/login.html", {"form": form})


def panel(request):
    usuarios = [
        {"id": 1, "iniciales": "MP", "nombre": "Marina Pérez", "rol": "Administradora", "ultimo_acceso": datetime(2025, 6, 5, 10, 15)},
        {"id": 2, "iniciales": "JF", "nombre": "Jorge Fernández", "rol": "Editor", "ultimo_acceso": datetime(2025, 6, 4, 16, 40)},
        {"id": 3, "iniciales": "LC", "nombre": "Lucía Castro", "rol": "Consulta", "ultimo_acceso": datetime(2025, 6, 3, 9, 5)},
    ]

    accesos = [
        {
            "usuario": "mperez",
            "descripcion": "Actualizó roles del área de eventos.",
            "fecha": datetime(2025, 6, 5, 10, 12),
        },
        {
            "usuario": "jfernandez",
            "descripcion": "Creó un usuario invitado para reservas.",
            "fecha": datetime(2025, 6, 4, 16, 33),
        },
        {
            "usuario": "lcastro",
            "descripcion": "Descargó reporte de notificaciones.",
            "fecha": datetime(2025, 6, 3, 9, 18),
        },
    ]

    context = {
        "usuarios": usuarios,
        "accesos": accesos,
        "usuario_actual": request.session.get("usuario_actual"),
    }
    return render(request, "cuentas/index.html", context)


# -------- CRUD Cuentas --------
class CuentaList(ListView):
    model = Cuenta
    template_name = "cuentas/cuenta_list.html"
    context_object_name = "cuentas"


class CuentaDetail(DetailView):
    model = Cuenta
    template_name = "cuentas/cuenta_detail.html"


class CuentaCreate(CreateView):
    model = Cuenta
    form_class = CuentaForm
    template_name = "cuentas/cuenta_form.html"
    success_url = reverse_lazy("cuentas:cuenta_list")


class CuentaUpdate(UpdateView):
    model = Cuenta
    form_class = CuentaForm
    template_name = "cuentas/cuenta_form.html"
    success_url = reverse_lazy("cuentas:cuenta_list")


class CuentaDelete(DeleteView):
    model = Cuenta
    template_name = "cuentas/cuenta_confirm_delete.html"
    success_url = reverse_lazy("cuentas:cuenta_list")


# -------- Fin CRUD Cuentas --------
