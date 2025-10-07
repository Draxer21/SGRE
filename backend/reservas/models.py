from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, RegexValidator


class Reserva(models.Model):
    PENDIENTE = "pendiente"
    CONFIRMADA = "confirmada"
    CANCELADA = "cancelada"
    ESTADOS = [
        (PENDIENTE, "Pendiente"),
        (CONFIRMADA, "Confirmada"),
        (CANCELADA, "Cancelada"),
    ]

    codigo = models.SlugField(
        "Código",
        max_length=32,
        unique=True,
        validators=[
            MinLengthValidator(4),
            RegexValidator(r"^[a-z0-9\-]+$", "Use solo minúsculas, números y guiones."),
        ],
        help_text="Identificador URL-safe (min. 4).",
    )
    espacio = models.CharField(
        "Espacio",
        max_length=150,
        validators=[MinLengthValidator(3)],
        help_text="Nombre del espacio o sala.",
    )
    fecha = models.DateField("Fecha")
    hora = models.TimeField("Hora")
    solicitante = models.CharField(
        "Solicitante",
        max_length=150,
        validators=[MinLengthValidator(3)],
        help_text="Nombre del área o responsable.",
    )
    estado = models.CharField("Estado", max_length=20, choices=ESTADOS, default=PENDIENTE)
    notas = models.TextField("Notas", blank=True, validators=[MaxLengthValidator(2000)])
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-hora"]
        verbose_name = "reserva"
        verbose_name_plural = "reservas"

    def __str__(self) -> str:
        return f"{self.codigo} - {self.espacio}"
