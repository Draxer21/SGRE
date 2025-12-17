"""
Sistema de permisos basado en roles para SGRE.
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permite acceso solo a usuarios con rol de administrador."""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Permitir a superusuarios de Django
        if request.user.is_superuser:
            return True
        
        # Verificar si el usuario tiene una cuenta con rol admin
        from .models import Cuenta
        try:
            cuenta = Cuenta.objects.get(email=request.user.username)
            return cuenta.activo and cuenta.rol == Cuenta.ADMIN
        except Cuenta.DoesNotExist:
            return False


class IsAdminOrEditor(permissions.BasePermission):
    """Permite acceso a administradores y editores."""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        from .models import Cuenta
        try:
            cuenta = Cuenta.objects.get(email=request.user.username)
            return cuenta.activo and cuenta.rol in [Cuenta.ADMIN, Cuenta.EDITOR]
        except Cuenta.DoesNotExist:
            return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite lectura a todos los usuarios autenticados,
    pero solo administradores pueden modificar.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Permitir lectura a todos los autenticados
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permitir escritura solo a admins
        if request.user.is_superuser:
            return True
        
        from .models import Cuenta
        try:
            cuenta = Cuenta.objects.get(email=request.user.username)
            return cuenta.activo and cuenta.rol == Cuenta.ADMIN
        except Cuenta.DoesNotExist:
            return False


class IsEditorOrReadOnly(permissions.BasePermission):
    """
    Permite lectura a todos, pero solo editores/admins pueden modificar.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_superuser:
            return True
        
        from .models import Cuenta
        try:
            cuenta = Cuenta.objects.get(email=request.user.username)
            return cuenta.activo and cuenta.rol in [Cuenta.ADMIN, Cuenta.EDITOR]
        except Cuenta.DoesNotExist:
            return False


def get_user_role(user):
    """
    Obtiene el rol del usuario desde la cuenta.
    Retorna: 'admin', 'editor', 'consulta' o None
    """
    if not user or not user.is_authenticated:
        return None
    
    if user.is_superuser:
        return 'admin'
    
    from .models import Cuenta
    try:
        cuenta = Cuenta.objects.get(email=user.username)
        if cuenta.activo:
            return cuenta.rol
        return None
    except Cuenta.DoesNotExist:
        return None
