import { Link } from "react-router-dom";

import { useBackendStyles } from "../hooks/useBackendStyles.js";

function EventsPage() {
  useBackendStyles("eventos");

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-title">Gestion de Eventos</h1>
          <p className="app-subtitle">Planifica actividades y coordina recursos.</p>
        </div>
        <div className="grid" style={{ gap: "12px", gridAutoFlow: "column" }}>
          <Link className="btn btn--primary" to="/eventos/nuevo">
            Nuevo evento
          </Link>
          <Link className="btn btn--ghost" to="/eventos/lista">
            Gestionar
          </Link>
        </div>
      </header>

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">Proximo paso</h2>
          <article className="card">
            <div className="card__header">
              <h3 className="card__title">Crea tu primer evento</h3>
            </div>
            <p className="card__meta">Define titulo, fecha, hora, lugar y estado.</p>
            <Link className="link" to="/eventos/nuevo">
              Comenzar ahora
            </Link>
          </article>
        </section>

        <section className="surface">
          <h2 className="section-title">Accesos rapidos</h2>
          <div className="grid">
            <Link className="link" to="/eventos/lista">
              Ver todos los eventos
            </Link>
            <Link className="link" to="/reportes">
              Ir a Reportes
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default EventsPage;
