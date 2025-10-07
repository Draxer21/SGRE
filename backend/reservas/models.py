from django.db import models


class Reserva(models.Model):
    PENDIENTE = "pendiente"
    CONFIRMADA = "confirmada"
    CANCELADA = "cancelada"
    ESTADOS = [
        (PENDIENTE, "Pendiente"),
        (CONFIRMADA, "Confirmada"),
        (CANCELADA, "Cancelada"),
    ]

    codigo = models.SlugField(max_length=32, unique=True)
    espacio = models.CharField(max_length=150)
    fecha = models.DateField()
    hora = models.TimeField()
    solicitante = models.CharField(max_length=150)
    estado = models.CharField(max_length=20, choices=ESTADOS, default=PENDIENTE)
    notas = models.TextField(blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-hora"]

    def __str__(self) -> str:
        return f"{self.codigo} - {self.espacio}"
