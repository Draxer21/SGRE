from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Reporte


class ReporteForm(forms.ModelForm):
    class Meta:
        model = Reporte
        fields = ["titulo", "descripcion", "fecha", "publicado"]
        labels = {
            "titulo": "Título",
            "descripcion": "Descripción",
            "fecha": "Fecha",
            "publicado": "Publicado",
        }
        help_texts = {
            "titulo": "Entre 5 y 200 caracteres.",
            "fecha": "Formato AAAA-MM-DD.",
        }
        widgets = {
            "titulo": forms.TextInput(attrs={"minlength": 5, "maxlength": 200, "required": True}),
            "descripcion": forms.Textarea(attrs={"rows": 4, "maxlength": 2000}),
            "fecha": forms.DateInput(attrs={"type": "date", "required": True}),
            "publicado": forms.CheckboxInput(),
        }
        error_messages = {
            "titulo": {
                "required": "El título es obligatorio.",
                "min_length": "Mínimo 5 caracteres.",
                "max_length": "Máximo 200 caracteres.",
            },
            "fecha": {"required": "La fecha es obligatoria.", "invalid": "Fecha inválida."},
        }
