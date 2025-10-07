from django import forms

from .models import Cuenta


class CuentaForm(forms.ModelForm):
    class Meta:
        model = Cuenta
        fields = ["nombre", "email", "rol", "activo"]
