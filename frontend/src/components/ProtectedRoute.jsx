import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
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

  return children;
}

export default ProtectedRoute;
