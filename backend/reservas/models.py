import uuid

from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, RegexValidator

from eventos.models import Evento, ZonaEvento


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
        help_text="Se genera automáticamente.",
        editable=False,
        blank=True,
    )
    espacio = models.CharField(
        "Espacio",
        max_length=150,
        validators=[MinLengthValidator(3)],
        help_text="Nombre del espacio o sala.",
    )
    fecha = models.DateField("Fecha", blank=True, null=True, editable=False)
    hora = models.TimeField("Hora", blank=True, null=True, editable=False)
    solicitante = models.CharField(
        "Solicitante",
        max_length=150,
        validators=[MinLengthValidator(3)],
        help_text="Nombre del área o responsable.",
    )
    evento = models.ForeignKey(
        Evento,
        on_delete=models.CASCADE,
        related_name="reservas",
        verbose_name="Evento",
        null=False,
        blank=False,
        help_text="Evento asociado a la reserva.",
    )
    zona = models.ForeignKey(
        ZonaEvento,
        on_delete=models.CASCADE,
        related_name="reservas",
        verbose_name="Zona",
        null=True,
        blank=True,
        help_text="Zona del evento si aplica (modo zonas).",
    )
    cupos_solicitados = models.PositiveIntegerField(
        "Cupos solicitados",
        default=1,
        help_text="Cantidad de cupos que ocupa la reserva.",
    )
    estado = models.CharField("Estado", max_length=20, choices=ESTADOS, default=PENDIENTE)
    notas = models.TextField("Notas", blank=True, validators=[MaxLengthValidator(2000)])
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-hora"]
        verbose_name = "reserva"
        verbose_name_plural = "reservas"

    @staticmethod
    def _generate_code() -> str:
        return uuid.uuid4().hex[:12]

    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = self._generate_code()
        if self.evento:
            self.fecha = self.evento.fecha
            self.hora = self.evento.hora
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.codigo} - {self.espacio}"
