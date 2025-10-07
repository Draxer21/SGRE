from django.db import models


class Cuenta(models.Model):
    ADMIN = "admin"
    EDITOR = "editor"
    CONSULTA = "consulta"
    ROLES = [
        (ADMIN, "Administrador"),
        (EDITOR, "Editor"),
        (CONSULTA, "Consulta"),
    ]

    nombre = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=20, choices=ROLES, default=CONSULTA)
    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-creado"]

    def __str__(self) -> str:
        return f"{self.nombre} <{self.email}>"
