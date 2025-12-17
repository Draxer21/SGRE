import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import Header from "../components/Header.jsx";

function EventsPage() {
  useBackendStyles("eventos");
  const { canEdit } = useAuth();

  return (
    <>
      <Header
        title="Gestion de Eventos"
        subtitle={canEdit() ? "Planifica actividades y coordina recursos." : "Consulta eventos programados."}
        actions={
          <>
            {canEdit() && (
              <Link className="btn btn--primary" to="/eventos/nuevo">
                Nuevo evento
              </Link>
            )}
            <Link className="btn btn--ghost" to="/eventos/lista">
              {canEdit() ? "Gestionar" : "Ver lista"}
            </Link>
          </>
        }
      />

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">{canEdit() ? "Proximo paso" : "Información"}</h2>
          <article className="card">
            <div className="card__header">
              <h3 className="card__title">
                {canEdit() ? "Crea tu primer evento" : "Consulta eventos"}
              </h3>
            </div>
            <p className="card__meta">
              {canEdit() 
                ? "Define titulo, fecha, hora, lugar y estado." 
                : "Revisa los eventos programados, fechas, lugares y estados."}
            </p>
            <Link className="link" to={canEdit() ? "/eventos/nuevo" : "/eventos/lista"}>
              {canEdit() ? "Comenzar ahora" : "Ver eventos"}
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
            {canEdit() && (
              <Link className="link" to="/reservas">
                Ir a Reservas
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default EventsPage;
