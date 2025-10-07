import hashlib
from django import forms

from .models import Cuenta


class LoginForm(forms.Form):
    username = forms.CharField(label="Usuario", max_length=150)
    password_plain = forms.CharField(label="Contraseña", widget=forms.PasswordInput, required=False)
    password = forms.CharField(label="Hash", required=False)
    remember = forms.BooleanField(label="Recordar sesión", required=False)

    def clean(self):
        cleaned = super().clean()
        password_plain = cleaned.get("password_plain")
        password_hash = cleaned.get("password")

        if not password_plain and not password_hash:
            raise forms.ValidationError("Debes ingresar tu contraseña.")

        if password_plain and not password_hash:
            cleaned["password_hash"] = hashlib.sha256(password_plain.encode("utf-8")).hexdigest()
        elif password_hash and not password_plain:
            cleaned["password_hash"] = password_hash
        else:
            cleaned["password_hash"] = password_hash or hashlib.sha256(password_plain.encode("utf-8")).hexdigest()

        return cleaned


class CuentaForm(forms.ModelForm):
    class Meta:
        model = Cuenta
        fields = ["nombre", "email", "rol", "activo"]
        labels = {
            "nombre": "Nombre",
            "email": "Email",
            "rol": "Rol",
            "activo": "Activo",
        }
        help_texts = {
            "nombre": "Entre 3 y 150 caracteres.",
            "email": "Correo institucional válido.",
        }
        widgets = {
            "nombre": forms.TextInput(attrs={
                "autocomplete": "name",
                "minlength": 3,
                "maxlength": 150,
                "required": True,
            }),
            "email": forms.EmailInput(attrs={
                "autocomplete": "email",
                "inputmode": "email",
                "required": True,
            }),
            "rol": forms.Select(attrs={"required": True}),
            "activo": forms.CheckboxInput(),
        }
        error_messages = {
            "nombre": {
                "required": "El nombre es obligatorio.",
                "min_length": "Mínimo 3 caracteres.",
                "max_length": "Máximo 150 caracteres.",
            },
            "email": {
                "required": "El email es obligatorio.",
                "invalid": "Formato de email inválido.",
                "unique": "Ya existe una cuenta con este email.",
            },
        }
