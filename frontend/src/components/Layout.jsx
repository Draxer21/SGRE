import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import Footer from "./Footer.jsx";
import { getSessionStatus, logoutSession } from "../services/sessionService.js";

const navigationItems = [
  { to: "/dashboard", label: "Panel" },
  { to: "/eventos", label: "Eventos" },
  { to: "/reservas", label: "Reservas" },
  { to: "/reportes", label: "Reportes" },
];

function Layout() {
  const location = useLocation();
  const [sessionInfo, setSessionInfo] = useState({
    loading: true,
    isAuthenticated: false,
    username: null,
  });
  const [sessionError, setSessionError] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchStatus() {
      try {
        const data = await getSessionStatus();
        if (!active) {
          return;
        }
        setSessionInfo({
          loading: false,
          isAuthenticated: Boolean(data?.isAuthenticated),
          username: data?.username ?? null,
        });
        setSessionError(null);
      } catch (error) {
        if (!active) {
          return;
        }
        setSessionInfo((prev) => ({
          ...prev,
          loading: false,
          isAuthenticated: false,
          username: null,
        }));
        setSessionError("No pudimos verificar la sesión.");
      }
    }

    fetchStatus();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    setSessionError(null);
    try {
      await logoutSession();
      setSessionInfo({
        loading: false,
        isAuthenticated: false,
        username: null,
      });
    } catch (error) {
      setSessionError("No conseguimos cerrar la sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="app-shell app-shell--react">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          <span className="brand__title">SGRE</span>
          <span className="brand__subtitle">Gestion Municipal</span>
        </div>
        <nav className="app-shell__nav">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav__link${isActive ? " nav__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-shell__actions">
          {sessionInfo.isAuthenticated ? (
            <>
              <span className="nav__user">
                Sesion:{" "}
                <strong>
                  {sessionInfo.username ?? "usuario"}
                </strong>
              </span>
              <button
                type="button"
                className="nav__cta nav__cta--logout"
                onClick={handleLogout}
                disabled={sessionInfo.loading}
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link to="/acceso" className="nav__cta">
              Iniciar sesion
            </Link>
          )}
          {sessionError && (
            <span className="nav__status nav__status--error">{sessionError}</span>
          )}
        </div>
      </aside>
      <div className="app-shell__content">
        <header className="app-shell__header">
          <h1>Municipalidad de ejemplo</h1>
          <p className="app-shell__intro">
            Sistema de Gestion de Reservas y Eventos.
          </p>
        </header>
        <main className="app-shell__main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
