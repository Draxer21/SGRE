import { NavLink, Outlet } from "react-router-dom";

const navigationItems = [
  { to: "/dashboard", label: "Panel" },
  { to: "/eventos", label: "Eventos" },
  { to: "/reservas", label: "Reservas" },
  { to: "/reportes", label: "Reportes" },
];

function Layout() {
  return (
    <div className="app-shell">
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
      </div>
    </div>
  );
}

export default Layout;
