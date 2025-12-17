from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("eventos", "0003_evento_media_fields"),
        ("reservas", "0002_alter_reserva_options_alter_reserva_codigo_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="reserva",
            name="evento",
            field=models.ForeignKey(
                blank=True,
                help_text="Evento asociado a la reserva (opcional).",
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="reservas",
                to="eventos.evento",
                verbose_name="Evento",
            ),
        ),
    ]
