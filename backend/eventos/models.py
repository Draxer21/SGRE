from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator, FileExtensionValidator
from django.core.exceptions import ValidationError


def validate_imagen_portada(file):
    max_size_bytes = 5 * 1024 * 1024
    if file.size > max_size_bytes:
        raise ValidationError("La imagen supera 5 MB.")
    content_type = getattr(file, "content_type", "")
    if content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise ValidationError("Usa JPG, PNG o WebP.")


class Evento(models.Model):
    BORRADOR = "borrador"
    CONVOCATORIA = "convocatoria"
    CONFIRMADO = "confirmado"
    ESTADOS = [
        (BORRADOR, "Borrador"),
        (CONVOCATORIA, "En convocatoria"),
        (CONFIRMADO, "Confirmado"),
    ]

    MODO_GENERAL = "general"
    MODO_ZONAS = "zonas"
    MODOS_AFORO = [
        (MODO_GENERAL, "General"),
        (MODO_ZONAS, "Zonas"),
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
    direccion = models.CharField(
        "Dirección",
        max_length=200,
        validators=[MinLengthValidator(5)],
        help_text="Calle y número (dato atómico, sin embeds).",
        blank=True,
        default="",
    )
    estado = models.CharField("Estado", max_length=20, choices=ESTADOS, default=BORRADOR)
    descripcion = models.TextField("Descripción", blank=True, validators=[MaxLengthValidator(2000)])
    imagen_portada = models.ImageField(
        "Imagen del lugar",
        upload_to="eventos/portada/",
        blank=True,
        null=True,
        help_text="Opcional. JPG/PNG/WebP, max 5 MB.",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp"]),
            validate_imagen_portada,
        ],
    )
    modo_aforo = models.CharField(
        "Modo de aforo",
        max_length=20,
        choices=MODOS_AFORO,
        default=MODO_GENERAL,
        help_text="General (un solo cupo total) o por zonas.",
    )
    cupo_total = models.PositiveIntegerField(
        "Cupo total",
        default=0,
        help_text="Aforo total si el modo es general.",
    )
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha", "-hora"]
        verbose_name = "evento"
        verbose_name_plural = "eventos"

    def __str__(self) -> str:
        return self.titulo


class ZonaEvento(models.Model):
    evento = models.ForeignKey(
        Evento,
        on_delete=models.CASCADE,
        related_name="zonas",
        verbose_name="Evento",
    )
    nombre = models.CharField("Nombre", max_length=100, validators=[MinLengthValidator(2)])
    cupo_total = models.PositiveIntegerField("Cupo total", default=0)

    class Meta:
        verbose_name = "zona de evento"
        verbose_name_plural = "zonas de evento"
        unique_together = ("evento", "nombre")
        ordering = ["nombre"]

    def __str__(self) -> str:
        return f"{self.evento.titulo} - {self.nombre}"
