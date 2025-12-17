from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("reportes", "0003_reporte_categorias"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="reporte",
            index=models.Index(fields=["fecha"], name="reporte_fecha_idx"),
        ),
        migrations.AddIndex(
            model_name="reporte",
            index=models.Index(fields=["publicado"], name="reporte_publicado_idx"),
        ),
    ]
