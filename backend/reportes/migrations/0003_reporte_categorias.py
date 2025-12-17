from django.db import migrations, models
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
        ("reportes", "0002_alter_reporte_options_alter_reporte_descripcion_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="reporte",
            name="categorias",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(
                    choices=[
                        ("eventos", "Eventos"),
                        ("reservas", "Reservas"),
                        ("notificaciones", "Notificaciones"),
                        ("indicadores", "Indicadores"),
                        ("financiero", "Financiero"),
                        ("otros", "Otros"),
                    ],
                    max_length=30,
                ),
                blank=True,
                default=list,
                help_text="Selecciona una o más categorías para clasificar el reporte.",
                size=None,
            ),
        ),
    ]
