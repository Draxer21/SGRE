from django.db import models
from django.core.validators import MaxLengthValidator, MinLengthValidator


class Reporte(models.Model):
    titulo = models.CharField(
        "Título",
        max_length=200,
        validators=[MinLengthValidator(5)],
        help_text="Entre 5 y 200 caracteres.",
    )
    descripcion = models.TextField("Descripción", blank=True, validators=[MaxLengthValidator(2000)])
    fecha = models.DateField("Fecha")
    publicado = models.BooleanField("Publicado", default=False)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-creado"]
        verbose_name = "reporte"
        verbose_name_plural = "reportes"

    def __str__(self) -> str:
        return self.titulo
