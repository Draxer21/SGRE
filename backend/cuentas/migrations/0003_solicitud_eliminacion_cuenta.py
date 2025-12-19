from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("cuentas", "0002_alter_cuenta_options_alter_cuenta_activo_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="SolicitudEliminacionCuenta",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("nombre", models.CharField(max_length=150)),
                ("email", models.EmailField(max_length=254)),
                ("motivo", models.TextField(blank=True)),
                ("estado", models.CharField(choices=[("pendiente", "Pendiente"), ("atendido", "Atendido")], default="pendiente", max_length=20)),
                ("creado", models.DateTimeField(auto_now_add=True)),
                ("cuenta", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="solicitudes_eliminacion", to="cuentas.cuenta")),
            ],
            options={
                "verbose_name": "solicitud de eliminacion",
                "verbose_name_plural": "solicitudes de eliminacion",
                "ordering": ["-creado"],
            },
        ),
    ]
