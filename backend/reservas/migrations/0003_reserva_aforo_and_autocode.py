from django.db import migrations, models
import django.core.validators


def set_evento_for_null_reservas(apps, schema_editor):
    Reserva = apps.get_model("reservas", "Reserva")
    Evento = apps.get_model("eventos", "Evento")
    first_event = Evento.objects.order_by("id").first()
    if not first_event:
        return
    Reserva.objects.filter(evento__isnull=True).update(evento=first_event)


class Migration(migrations.Migration):

    dependencies = [
        ("eventos", "0005_evento_aforo_zonaevento"),
        ("reservas", "0002_alter_reserva_options_alter_reserva_codigo_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="reserva",
            name="cupos_solicitados",
            field=models.PositiveIntegerField(
                default=1,
                help_text="Cantidad de cupos que ocupa la reserva.",
                verbose_name="Cupos solicitados",
            ),
        ),
        migrations.AddField(
            model_name="reserva",
            name="zona",
            field=models.ForeignKey(
                blank=True,
                help_text="Zona del evento si aplica (modo zonas).",
                null=True,
                on_delete=models.deletion.CASCADE,
                related_name="reservas",
                to="eventos.zonaevento",
                verbose_name="Zona",
            ),
        ),
        migrations.AlterField(
            model_name="reserva",
            name="codigo",
            field=models.SlugField(
                blank=True,
                editable=False,
                help_text="Se genera automáticamente.",
                max_length=32,
                unique=True,
                validators=[
                    django.core.validators.MinLengthValidator(4),
                    django.core.validators.RegexValidator("^[a-z0-9\\-]+$", "Use solo minúsculas, números y guiones."),
                ],
                verbose_name="Código",
            ),
        ),
        migrations.AlterField(
            model_name="reserva",
            name="fecha",
            field=models.DateField(blank=True, editable=False, null=True, verbose_name="Fecha"),
        ),
        migrations.AlterField(
            model_name="reserva",
            name="hora",
            field=models.TimeField(blank=True, editable=False, null=True, verbose_name="Hora"),
        ),
        migrations.RunPython(set_evento_for_null_reservas, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="reserva",
            name="evento",
            field=models.ForeignKey(
                help_text="Evento asociado a la reserva.",
                on_delete=models.deletion.CASCADE,
                related_name="reservas",
                to="eventos.evento",
                verbose_name="Evento",
            ),
        ),
    ]
