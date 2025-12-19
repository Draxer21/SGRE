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
    usuario = models.CharField(
        "Usuario",
        max_length=150,
        unique=True,
        validators=[MinLengthValidator(3)],
        help_text="Nombre de usuario para iniciar sesion.",
    )
    email = models.EmailField(
        "Email",
        unique=True,
        blank=True,
        null=True,
        help_text="Correo institucional del usuario (opcional).",
    )
    rol = models.CharField("Rol", max_length=20, choices=ROLES, default=CONSULTA)
    activo = models.BooleanField("Activo", default=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-creado"]
        verbose_name = "cuenta"
        verbose_name_plural = "cuentas"

    def __str__(self) -> str:
        return f"{self.nombre} ({self.usuario})"


class SolicitudEliminacionCuenta(models.Model):
    ESTADO_PENDIENTE = "pendiente"
    ESTADO_ATENDIDO = "atendido"
    ESTADOS = [
        (ESTADO_PENDIENTE, "Pendiente"),
        (ESTADO_ATENDIDO, "Atendido"),
    ]

    cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE, related_name="solicitudes_eliminacion")
    nombre = models.CharField(max_length=150)
    email = models.EmailField()
    motivo = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default=ESTADO_PENDIENTE)
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-creado"]
        verbose_name = "solicitud de eliminacion"
        verbose_name_plural = "solicitudes de eliminacion"

    def __str__(self) -> str:
        return f"Solicitud {self.email} ({self.estado})"
