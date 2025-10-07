import hashlib

from django import forms


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
