import { Link } from "react-router-dom";

import { useBackendStyles } from "../hooks/useBackendStyles.js";

function ReservationsPage() {
  useBackendStyles("reservas");

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-title">Gestion de Reservas</h1>
          <p className="app-subtitle">Controla espacios, cupos y solicitudes.</p>
        </div>
        <div className="grid" style={{ gap: "12px", gridAutoFlow: "column" }}>
          <Link className="btn btn--primary" to="/reservas/nueva">
            Nueva reserva
          </Link>
          <Link className="btn btn--ghost" to="/reservas/lista">
            Gestionar
          </Link>
        </div>
      </header>
      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">Panel rapido</h2>
          <div className="grid grid--two-columns">
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Espacios</h3>
              </div>
              <p className="card__meta">Define y administra salas.</p>
              <Link className="link" to="/reservas/lista">
                Revisar reservas
              </Link>
            </article>
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Solicitudes</h3>
              </div>
              <p className="card__meta">Aprueba o rechaza reservas.</p>
              <Link className="link" to="/reservas/lista">
                Ver solicitudes
              </Link>
            </article>
          </div>
        </section>

        <section className="surface">
          <h2 className="section-title">Accesos rapidos</h2>
          <div className="grid">
            <Link className="link" to="/reservas/lista">
              Ver todas las reservas
            </Link>
            <Link className="link" to="/eventos">
              Ir a Eventos
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default ReservationsPage;
