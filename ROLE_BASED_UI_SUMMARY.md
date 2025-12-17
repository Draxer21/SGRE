# Implementación de UI Basada en Roles

## Resumen
Se ha implementado un sistema completo de interfaz de usuario diferenciada por roles para el sistema SGRE. Los usuarios ahora ven diferentes interfaces según su rol (admin, editor, consulta).

## Roles y Permisos

### Administrador (admin)
- **Permisos completos**: Crear, leer, actualizar y eliminar todos los recursos
- **Funcionalidades exclusivas**:
  - Crear y eliminar cuentas de usuario
  - Acceso total a todas las secciones del sistema

### Editor (editor)
- **Permisos**: Crear, leer y actualizar eventos, reservas y reportes
- **Restricciones**: No puede gestionar cuentas de usuario (solo visualizar)

### Consulta (consulta)
- **Permisos**: Solo lectura en todos los recursos
- **Restricciones**: No puede crear, editar o eliminar ningún recurso
- **UI especial**: Dashboard simplificado sin botones de acción

## Cambios Implementados

### 1. Páginas Principales Modificadas

#### DashboardPage.jsx
- Muestra `UserDashboard` para usuarios con rol "consulta"
- Dashboard completo con estadísticas para admin/editor
- Título muestra el tipo de rol del usuario

#### EventsPage.jsx
- Botón "Nuevo evento" solo visible para admin/editor
- Texto adaptado según permisos ("Gestionar" vs "Ver lista")
- Mensajes informativos diferentes para cada rol

#### ReservationsPage.jsx
- Botón "Nueva reserva" solo visible para admin/editor
- Descripciones adaptadas a permisos del usuario
- Enlaces contextuales según rol

#### ReportsPage.jsx
- Botón "Nuevo reporte" solo visible para admin/editor
- Contenido adaptado para usuarios de solo lectura

#### AccountsPage.jsx
- Botón "Nueva cuenta" solo visible para admin
- Subtítulo adaptado según permisos

### 2. Páginas de Lista Modificadas

#### EventsListPage.jsx
- Botón "Nuevo evento" oculto para usuarios consulta
- Links "Editar" y "Eliminar" ocultos para usuarios consulta
- Solo muestra botón "Ver detalle" para consulta

#### ReportsListPage.jsx
- Botón "Nuevo reporte" oculto para usuarios consulta
- Links "Editar" y "Eliminar" ocultos para usuarios consulta

#### ReservationsListPage.jsx
- Usa componente Table con columna de acciones condicional
- Botón "Nueva reserva" oculto para usuarios consulta
- Links de edición/eliminación ocultos según permisos

#### AccountsListPage.jsx
- Usa componente Table con acciones basadas en rol
- "Editar" visible solo para admin/editor
- "Eliminar" visible solo para admin

### 3. Protección de Formularios y Eliminación

Todos los formularios y páginas de eliminación redirigen automáticamente si el usuario no tiene permisos:

- **EventFormPage.jsx**: Redirige a /eventos si no puede editar
- **ReportFormPage.jsx**: Redirige a /reportes si no puede editar
- **ReservationFormPage.jsx**: Redirige a /reservas si no puede editar
- **AccountFormPage.jsx**: Redirige a /cuentas si no es admin
- **EventDeletePage.jsx**: Redirige a /eventos si no puede editar
- **ReportDeletePage.jsx**: Redirige a /reportes si no puede editar
- **ReservationDeletePage.jsx**: Redirige a /reservas si no puede editar
- **AccountDeletePage.jsx**: Redirige a /cuentas si no es admin

### 4. Nuevo Componente: UserDashboard

Creado específicamente para usuarios con rol "consulta":
- No muestra botones de crear/editar
- Mensaje informativo sobre permisos de solo lectura
- Enlaces a las secciones de consulta
- Diseño simplificado y claro

## Hooks de Autenticación Utilizados

### useAuth()
Proporciona las siguientes funciones:

```javascript
const { role, hasRole, canEdit, isAdmin } = useAuth();
```

- **role**: String con el rol actual ("admin", "editor", "consulta")
- **hasRole(roles)**: Verifica si el usuario tiene uno de los roles especificados
- **canEdit()**: Retorna true si el usuario puede editar (admin o editor)
- **isAdmin()**: Retorna true si el usuario es administrador

## Patrón de Implementación

### Ejemplo de uso en páginas:

```javascript
import { useAuth } from "../contexts/AuthContext.jsx";

function MiPagina() {
  const { canEdit, isAdmin } = useAuth();

  return (
    <div>
      {canEdit() && (
        <button>Crear Nuevo</button>
      )}
      
      {isAdmin() && (
        <button>Acción de Admin</button>
      )}
    </div>
  );
}
```

### Ejemplo de protección de formularios:

```javascript
function MiFormulario() {
  const { canEdit } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!canEdit()) {
      navigate("/ruta-segura");
    }
  }, [canEdit, navigate]);

  // ... resto del componente
}
```

## Resultado Final

El sistema ahora proporciona una experiencia de usuario completamente adaptada al rol:

1. **Usuarios consulta**: Interfaz limpia de solo lectura, sin confusión por botones que no pueden usar
2. **Usuarios editor**: Acceso completo a crear y editar contenido, pero sin gestión de usuarios
3. **Administradores**: Control total del sistema incluyendo gestión de cuentas

Esta implementación mejora significativamente la usabilidad y seguridad del sistema SGRE.
