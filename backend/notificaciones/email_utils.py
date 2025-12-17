from typing import Iterable, Optional

from django.conf import settings
from django.core.mail import send_mail


def send_test_email(to_emails: Iterable[str], subject: str = "Prueba de notificación", message: str = "Hola, este es un correo de prueba desde SGRE.") -> int:
    """Envía un correo de prueba usando la configuración actual."""
    if not to_emails:
        return 0
    return send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        list(to_emails),
        fail_silently=False,
    )
