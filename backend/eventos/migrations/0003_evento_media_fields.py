from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("eventos", "0002_alter_evento_options_alter_evento_descripcion_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="evento",
            name="imagen_portada",
            field=models.ImageField(
                blank=True,
                help_text="Opcional. JPG/PNG/WebP, max 5 MB.",
                null=True,
                upload_to="eventos/portada/",
                verbose_name="Imagen del lugar",
            ),
        ),
        migrations.AddField(
            model_name="evento",
            name="street_view_url",
            field=models.URLField(
                blank=True,
                help_text="Opcional. URL de embed de Google Street View.",
                verbose_name="URL de Street View",
            ),
        ),
    ]
