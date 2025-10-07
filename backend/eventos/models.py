from django.db import models


class Evento(models.Model):
    BORRADOR = "borrador"
    CONVOCATORIA = "convocatoria"
    CONFIRMADO = "confirmado"
    ESTADOS = [
        (BORRADOR, "Borrador"),
        (CONVOCATORIA, "En convocatoria"),
        (CONFIRMADO, "Confirmado"),
    ]

    titulo = models.CharField(max_length=200)
    fecha = models.DateField()
    hora = models.TimeField()
    lugar = models.CharField(max_length=200)
    estado = models.CharField(max_length=20, choices=ESTADOS, default=BORRADOR)
    descripcion = models.TextField(blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-hora"]

    def __str__(self) -> str:
        return self.titulo
