from django.core.validators import MinLengthValidator
from django.db import migrations, models


def set_usuario_from_email(apps, schema_editor):
    Cuenta = apps.get_model("cuentas", "Cuenta")
    for cuenta in Cuenta.objects.all():
        if not cuenta.usuario:
            cuenta.usuario = cuenta.email or f"usuario_{cuenta.id}"
            cuenta.save(update_fields=["usuario"])


class Migration(migrations.Migration):
    dependencies = [
        ("cuentas", "0003_solicitud_eliminacion_cuenta"),
    ]

    operations = [
        migrations.AddField(
            model_name="cuenta",
            name="usuario",
            field=models.CharField(
                blank=True,
                help_text="Nombre de usuario para iniciar sesion.",
                max_length=150,
                null=True,
                unique=True,
                verbose_name="Usuario",
            ),
        ),
        migrations.AlterField(
            model_name="cuenta",
            name="email",
            field=models.EmailField(
                blank=True,
                help_text="Correo institucional del usuario (opcional).",
                max_length=254,
                null=True,
                unique=True,
                verbose_name="Email",
            ),
        ),
        migrations.RunPython(set_usuario_from_email, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="cuenta",
            name="usuario",
            field=models.CharField(
                help_text="Nombre de usuario para iniciar sesion.",
                max_length=150,
                unique=True,
                validators=[MinLengthValidator(3)],
                verbose_name="Usuario",
            ),
        ),
    ]
