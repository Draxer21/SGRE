import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import Header from "../components/Header.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { listEventos } from "../services/eventsService.js";

function EventsPage() {
  useBackendStyles("eventos");
  const navigate = useNavigate();
  const { user, canEdit } = useAuth();
  const { data, loading, error, refetch } = useAsync(
    // No filtramos por estado para que se muestren todos los eventos disponibles
    () => listEventos({ ordering: "fecha", page_size: 12 }),
    [],
  );

  const handleReserve = (eventoId) => {
    const reservePath = `/reservas/nueva?evento=${eventoId}`;
    if (user) {
      navigate(reservePath);
      return;
    }
    navigate("/acceso", { state: { from: reservePath } });
  };

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

      <section className="surface" style={{ marginTop: "16px" }}>
        <h2 className="section-title">Eventos disponibles</h2>
        <p className="card__meta" style={{ marginTop: 0 }}>
          Reserva tu cupo. Si no tienes cuenta, inicia sesión o solicita la creación de una.
        </p>
        {!canEdit() && (
          <p className="card__meta" style={{ color: "#b91c1c", marginTop: 0 }}>
            Tu rol actual es de solo consulta. Pide a un administrador que habilite tu perfil para crear reservas.
          </p>
        )}

        {loading && (
          <div className="empty-state" style={{ marginTop: "12px" }}>
            <span className="loader" aria-label="Cargando" />
          </div>
        )}

        {error && (
          <div className="empty-state" style={{ marginTop: "12px" }}>
            <p>No pudimos cargar los eventos. {error.message}</p>
            <button type="button" onClick={refetch}>
              Reintentar
            </button>
          </div>
        )}

        {Array.isArray(data?.results) && data.results.length > 0 ? (
          <div className="grid" style={{ marginTop: "12px", gap: "12px" }}>
            {data.results.map((evento) => (
              <article key={evento.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div className="card__header" style={{ alignItems: "flex-start" }}>
                  <div>
                    <h3 className="card__title" style={{ margin: 0 }}>{evento.titulo}</h3>
                    <p className="card__meta" style={{ margin: "4px 0" }}>
                      {new Date(`${evento.fecha}T00:00:00`).toLocaleDateString("es-CL")} • {evento.hora?.slice(0, 5)} • {evento.lugar}
                    </p>
                  </div>
                  <StatusPill status={evento.estado} label={evento.estado_display ?? evento.estado} />
                </div>
                {evento.descripcion && (
                  <p className="card__meta" style={{ margin: 0 }}>{evento.descripcion}</p>
                )}
                <div className="grid" style={{ gridAutoFlow: "column", justifyContent: "start", gap: "12px" }}>
                  <button className="btn btn--primary" type="button" onClick={() => handleReserve(evento.id)}>
                    Reservar
                  </button>
                  <Link className="btn btn--ghost" to={`/eventos/${evento.id}`}>
                    Ver detalle
                  </Link>
                </div>
              </article>
            ))}
            <Link className="btn btn--ghost" to="/eventos/lista" style={{ justifySelf: "start" }}>
              Ver listado completo
            </Link>
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="empty-state" style={{ marginTop: "12px" }}>
              No hay eventos disponibles.
            </div>
          )
        )}
      </section>
    </>
  );
}

export default EventsPage;
