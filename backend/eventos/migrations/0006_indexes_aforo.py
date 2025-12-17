from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("eventos", "0005_evento_aforo_zonaevento"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="evento",
            index=models.Index(fields=["fecha"], name="evento_fecha_idx"),
        ),
        migrations.AddIndex(
            model_name="evento",
            index=models.Index(fields=["estado"], name="evento_estado_idx"),
        ),
        migrations.AddIndex(
            model_name="zonaevento",
            index=models.Index(fields=["evento"], name="zona_evento_idx"),
        ),
    ]
