from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator


class Evento(models.Model):
    BORRADOR = "borrador"
    CONVOCATORIA = "convocatoria"
    CONFIRMADO = "confirmado"
    ESTADOS = [
        (BORRADOR, "Borrador"),
        (CONVOCATORIA, "En convocatoria"),
        (CONFIRMADO, "Confirmado"),
    ]

    titulo = models.CharField(
        "Título",
        max_length=200,
        validators=[MinLengthValidator(5)],
        help_text="Entre 5 y 200 caracteres. Evita abreviaturas ambiguas.",
    )
    fecha = models.DateField("Fecha", help_text="Formato AAAA-MM-DD. Debe ser hoy o futura.")
    hora = models.TimeField("Hora", help_text="Formato 24h HH:MM.")
    lugar = models.CharField(
        "Lugar",
        max_length=200,
        validators=[MinLengthValidator(3)],
        help_text="Nombre del espacio o dirección completa.",
    )
    estado = models.CharField("Estado", max_length=20, choices=ESTADOS, default=BORRADOR)
    descripcion = models.TextField("Descripción", blank=True, validators=[MaxLengthValidator(2000)])
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-hora"]
        verbose_name = "evento"
        verbose_name_plural = "eventos"

    def __str__(self) -> str:
        return self.titulo
