import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

/**
 * Component that restricts access based on user roles.
 * Redirects to /acceso if not authenticated or doesn't have required role.
 * 
 * @param {Object} props
 * @param {string|string[]} props.roles - Required role(s) to access the content
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} [props.fallback] - Optional fallback content instead of redirect
 */
function RequireRole({ roles, children, fallback = null }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="empty-state">
        <span className="loader" aria-label="Cargando" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/acceso"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Check if user has required role
  const hasRequiredRole = Array.isArray(roles)
    ? roles.includes(role)
    : role === roles;

  if (!hasRequiredRole) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="empty-state">
        <h2>Acceso denegado</h2>
        <p>No tienes permisos suficientes para acceder a esta sección.</p>
        <p>Rol requerido: {Array.isArray(roles) ? roles.join(", ") : roles}</p>
        <p>Tu rol actual: {role || "ninguno"}</p>
      </div>
    );
  }

  return children;
}

RequireRole.propTypes = {
  roles: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default RequireRole;
