from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ("eventos", "0003_evento_media_fields"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="evento",
            name="street_view_url",
        ),
        migrations.AddField(
            model_name="evento",
            name="direccion",
            field=models.CharField(
                blank=True,
                default="",
                help_text="Calle y número (dato atómico, sin embeds).",
                max_length=200,
                validators=[django.core.validators.MinLengthValidator(5)],
                verbose_name="Dirección",
            ),
        ),
    ]
