from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("reservas", "0003_reserva_aforo_and_autocode"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="reserva",
            index=models.Index(fields=["fecha"], name="reserva_fecha_idx"),
        ),
        migrations.AddIndex(
            model_name="reserva",
            index=models.Index(fields=["estado"], name="reserva_estado_idx"),
        ),
        migrations.AddIndex(
            model_name="reserva",
            index=models.Index(fields=["evento"], name="reserva_evento_idx"),
        ),
        migrations.AddIndex(
            model_name="reserva",
            index=models.Index(fields=["zona"], name="reserva_zona_idx"),
        ),
    ]
