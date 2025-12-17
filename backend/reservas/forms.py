from django import forms
from django.core.exceptions import ValidationError

from .models import Reserva


class ReservaForm(forms.ModelForm):
    class Meta:
        model = Reserva
        fields = ["espacio", "solicitante", "evento", "zona", "cupos_solicitados", "estado", "notas"]
        labels = {
            "espacio": "Espacio",
            "solicitante": "Solicitante",
            "evento": "Evento",
            "zona": "Zona",
            "cupos_solicitados": "Cupos solicitados",
            "estado": "Estado",
            "notas": "Notas",
        }
        help_texts = {
            "espacio": "Nombre del espacio o sala.",
            "solicitante": "Área o responsable de la reserva.",
            "evento": "Evento asociado.",
            "zona": "Zona si el evento usa aforo por zonas.",
            "cupos_solicitados": "Cantidad de cupos a consumir.",
        }
        widgets = {
            "espacio": forms.TextInput(attrs={
                "minlength": 3,
                "maxlength": 150,
                "required": True,
                "autocomplete": "organization-title",
            }),
            "solicitante": forms.TextInput(attrs={
                "minlength": 3,
                "maxlength": 150,
                "required": True,
                "autocomplete": "organization",
            }),
            "evento": forms.Select(attrs={"required": True}),
            "zona": forms.Select(attrs={"required": False}),
            "cupos_solicitados": forms.NumberInput(attrs={"min": 1, "required": True}),
            "estado": forms.Select(attrs={"required": True}),
            "notas": forms.Textarea(attrs={"rows": 4, "maxlength": 2000}),
        }
        error_messages = {
            "espacio": {
                "required": "El espacio es obligatorio.",
                "min_length": "Mínimo 3 caracteres.",
            },
            "solicitante": {"required": "El solicitante es obligatorio.", "min_length": "Mínimo 3 caracteres."},
            "cupos_solicitados": {"required": "Indica los cupos.", "min_value": "Debe ser mayor a 0."},
        }

    def clean_cupos_solicitados(self):
        cupos = self.cleaned_data.get("cupos_solicitados") or 0
        if cupos <= 0:
            raise ValidationError("Debe ser mayor a 0.")
        return cupos
