from django.db import models
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.contrib.postgres.fields import ArrayField


class Reporte(models.Model):
    CATEGORIA_EVENTOS = "eventos"
    CATEGORIA_RESERVAS = "reservas"
    CATEGORIA_NOTIFICACIONES = "notificaciones"
    CATEGORIA_INDICADORES = "indicadores"
    CATEGORIA_FINANCIERO = "financiero"
    CATEGORIA_OTROS = "otros"

    CATEGORIAS = [
        (CATEGORIA_EVENTOS, "Eventos"),
        (CATEGORIA_RESERVAS, "Reservas"),
        (CATEGORIA_NOTIFICACIONES, "Notificaciones"),
        (CATEGORIA_INDICADORES, "Indicadores"),
        (CATEGORIA_FINANCIERO, "Financiero"),
        (CATEGORIA_OTROS, "Otros"),
    ]
    titulo = models.CharField(
        "Título",
        max_length=200,
        validators=[MinLengthValidator(5)],
        help_text="Entre 5 y 200 caracteres.",
    )
    descripcion = models.TextField("Descripción", blank=True, validators=[MaxLengthValidator(2000)])
    fecha = models.DateField("Fecha")
    publicado = models.BooleanField("Publicado", default=False)
    categorias = ArrayField(
        models.CharField(max_length=30, choices=CATEGORIAS),
        default=list,
        help_text="Selecciona una o más categorías para clasificar el reporte.",
        blank=True,
    )
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-creado"]
        verbose_name = "reporte"
        verbose_name_plural = "reportes"

    def __str__(self) -> str:
        return self.titulo
