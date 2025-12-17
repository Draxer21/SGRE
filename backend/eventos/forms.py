from django import forms
from django.utils import timezone
from django.core.exceptions import ValidationError

from .models import Evento


class EventoForm(forms.ModelForm):
    class Meta:
        model = Evento
        fields = ["titulo", "fecha", "hora", "lugar", "direccion", "estado", "descripcion"]
        labels = {
            "titulo": "Título",
            "fecha": "Fecha",
            "hora": "Hora",
            "lugar": "Lugar",
            "estado": "Estado",
            "descripcion": "Descripción",
        }
        help_texts = {
            "titulo": "Entre 5 y 200 caracteres. Evita abreviaturas ambiguas.",
            "fecha": "Formato AAAA-MM-DD. Debe ser hoy o futuro.",
            "hora": "Formato 24h HH:MM (ej.: 14:30).",
            "lugar": "Nombre del espacio o dirección completa.",
            "direccion": "Calle y número (dato atómico).",
            "estado": "Etapa actual del evento.",
            "descripcion": "Información adicional para participantes y equipo.",
        }
        widgets = {
            "titulo": forms.TextInput(attrs={
                "autocomplete": "off",
                "minlength": 5,
                "maxlength": 200,
                "required": True,
            }),
            "fecha": forms.DateInput(attrs={
                "type": "date",
                "required": True,
                "inputmode": "numeric",
            }),
            "hora": forms.TimeInput(attrs={
                "type": "time",
                "required": True,
                "inputmode": "numeric",
                "step": 60,
            }),
            "lugar": forms.TextInput(attrs={
                "autocomplete": "street-address",
                "minlength": 3,
                "maxlength": 200,
                "required": True,
            }),
            "direccion": forms.TextInput(attrs={
                "autocomplete": "street-address",
                "minlength": 5,
                "maxlength": 200,
                "required": False,
            }),
            "estado": forms.Select(attrs={"required": True}),
            "descripcion": forms.Textarea(attrs={
                "rows": 5,
                "maxlength": 2000,
            }),
        }
        error_messages = {
            "titulo": {
                "required": "El título es obligatorio.",
                "max_length": "Máximo 200 caracteres.",
            },
            "fecha": {
                "invalid": "Ingrese una fecha válida (AAAA-MM-DD).",
                "required": "La fecha es obligatoria.",
            },
            "hora": {
                "invalid": "Ingrese una hora válida (HH:MM).",
                "required": "La hora es obligatoria.",
            },
            "lugar": {
                "required": "El lugar es obligatorio.",
                "max_length": "Máximo 200 caracteres.",
            },
            "direccion": {
                "max_length": "Máximo 200 caracteres.",
            },
        }

    field_order = ["titulo", "fecha", "hora", "lugar", "direccion", "estado", "descripcion"]

    def clean_titulo(self):
        titulo = (self.cleaned_data.get("titulo") or "").strip()
        if len(titulo) < 5:
            raise ValidationError("Usa al menos 5 caracteres.")
        return titulo

    def clean_fecha(self):
        fecha = self.cleaned_data.get("fecha")
        if fecha and fecha < timezone.now().date():
            raise ValidationError("La fecha debe ser hoy o futura.")
        return fecha
