from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator


class Cuenta(models.Model):
    ADMIN = "admin"
    EDITOR = "editor"
    CONSULTA = "consulta"
    ROLES = [
        (ADMIN, "Administrador"),
        (EDITOR, "Editor"),
        (CONSULTA, "Consulta"),
    ]

    nombre = models.CharField(
        "Nombre",
        max_length=150,
        validators=[MinLengthValidator(3)],
        help_text="Entre 3 y 150 caracteres.",
    )
    email = models.EmailField("Email", unique=True, help_text="Correo institucional del usuario.")
    rol = models.CharField("Rol", max_length=20, choices=ROLES, default=CONSULTA)
    activo = models.BooleanField("Activo", default=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-creado"]
        verbose_name = "cuenta"
        verbose_name_plural = "cuentas"

    def __str__(self) -> str:
        return f"{self.nombre} <{self.email}>"
