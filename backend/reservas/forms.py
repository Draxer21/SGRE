from django import forms
from django.utils import timezone
from django.core.exceptions import ValidationError

from .models import Reserva


class ReservaForm(forms.ModelForm):
    class Meta:
        model = Reserva
        fields = ["codigo", "espacio", "fecha", "hora", "solicitante", "estado", "notas"]
        labels = {
            "codigo": "Código",
            "espacio": "Espacio",
            "fecha": "Fecha",
            "hora": "Hora",
            "solicitante": "Solicitante",
            "estado": "Estado",
            "notas": "Notas",
        }
        help_texts = {
            "codigo": "Solo minúsculas, números y guiones (ej.: res-2025-001).",
            "espacio": "Nombre del espacio o sala.",
            "fecha": "Formato AAAA-MM-DD. Hoy o futuro.",
            "hora": "Formato 24h HH:MM.",
            "solicitante": "Área o responsable de la reserva.",
        }
        widgets = {
            "codigo": forms.TextInput(attrs={
                "pattern": "[a-z0-9\-]+",
                "minlength": 4,
                "maxlength": 32,
                "required": True,
                "autocomplete": "off",
            }),
            "espacio": forms.TextInput(attrs={
                "minlength": 3,
                "maxlength": 150,
                "required": True,
                "autocomplete": "organization-title",
            }),
            "fecha": forms.DateInput(attrs={"type": "date", "required": True, "inputmode": "numeric"}),
            "hora": forms.TimeInput(attrs={"type": "time", "required": True, "step": 60}),
            "solicitante": forms.TextInput(attrs={
                "minlength": 3,
                "maxlength": 150,
                "required": True,
                "autocomplete": "organization",
            }),
            "estado": forms.Select(attrs={"required": True}),
            "notas": forms.Textarea(attrs={"rows": 4, "maxlength": 2000}),
        }
        error_messages = {
            "codigo": {
                "required": "El código es obligatorio.",
                "invalid": "Use solo minúsculas, números y guiones.",
                "unique": "Ya existe una reserva con este código.",
                "min_length": "Mínimo 4 caracteres.",
                "max_length": "Máximo 32 caracteres.",
            },
            "espacio": {
                "required": "El espacio es obligatorio.",
                "min_length": "Mínimo 3 caracteres.",
            },
            "fecha": {"required": "La fecha es obligatoria.", "invalid": "Fecha inválida."},
            "hora": {"required": "La hora es obligatoria.", "invalid": "Hora inválida."},
            "solicitante": {"required": "El solicitante es obligatorio.", "min_length": "Mínimo 3 caracteres."},
        }

    def clean_fecha(self):
        fecha = self.cleaned_data.get("fecha")
        if fecha and fecha < timezone.now().date():
            raise ValidationError("La fecha debe ser hoy o futura.")
        return fecha
