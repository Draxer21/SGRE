from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ("eventos", "0004_remove_evento_street_view_url_add_evento_direccion"),
    ]

    operations = [
        migrations.AddField(
            model_name="evento",
            name="cupo_total",
            field=models.PositiveIntegerField(
                default=0,
                help_text="Aforo total si el modo es general.",
                verbose_name="Cupo total",
            ),
        ),
        migrations.AddField(
            model_name="evento",
            name="modo_aforo",
            field=models.CharField(
                choices=[("general", "General"), ("zonas", "Zonas")],
                default="general",
                help_text="General (un solo cupo total) o por zonas.",
                max_length=20,
                verbose_name="Modo de aforo",
            ),
        ),
        migrations.CreateModel(
            name="ZonaEvento",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("nombre", models.CharField(max_length=100, validators=[django.core.validators.MinLengthValidator(2)], verbose_name="Nombre")),
                ("cupo_total", models.PositiveIntegerField(default=0, verbose_name="Cupo total")),
                ("evento", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="zonas", to="eventos.evento", verbose_name="Evento")),
            ],
            options={
                "verbose_name": "zona de evento",
                "verbose_name_plural": "zonas de evento",
                "ordering": ["nombre"],
                "unique_together": {("evento", "nombre")},
            },
        ),
    ]
