import { Link } from "react-router-dom";

import { useBackendStyles } from "../hooks/useBackendStyles.js";

function AccountsPage() {
  useBackendStyles("cuentas");

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-title">Centro de Cuentas</h1>
          <p className="app-subtitle">Administra usuarios, roles y accesos.</p>
        </div>
        <div
          className="grid"
          style={{ gap: "12px", gridAutoFlow: "column", flexWrap: "wrap" }}
        >
          <Link className="btn btn--primary" to="/cuentas/nueva">
            Nueva cuenta
          </Link>
          <Link className="btn btn--ghost" to="/cuentas/lista">
            Gestionar
          </Link>
          <Link className="btn btn--ghost" to="/acceso">
            Iniciar sesion
          </Link>
        </div>
      </header>

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">Resumen</h2>
          <div className="grid grid--two-columns">
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Usuarios activos</h3>
              </div>
              <p className="card__meta">Cuentas habilitadas para acceso.</p>
            </article>
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Roles configurados</h3>
              </div>
              <p className="card__meta">Administrador, Editor y Consulta.</p>
            </article>
          </div>
        </section>

        <section className="surface">
          <h2 className="section-title">Accesos rapidos</h2>
          <div className="grid">
            <Link className="link" to="/cuentas/lista">
              Ver listado de cuentas
            </Link>
            <Link className="link" to="/cuentas/nueva">
              Crear nueva cuenta
            </Link>
            <a className="link" href="/admin/">
              Ir a Administracion
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default AccountsPage;
