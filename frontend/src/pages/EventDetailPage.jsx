import { Link, useParams } from "react-router-dom";

import StatusPill from "../components/StatusPill.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { retrieveEvento } from "../services/eventsService.js";

function EventDetailPage() {
  const { id } = useParams();
  useBackendStyles("eventos");
  const { data, error, loading, refetch } = useAsync(
    () => retrieveEvento(id),
    [id],
  );

  if (loading) {
    return (
      <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
        <p className="card__meta">No pudimos cargar el evento. {error.message}</p>
        <button type="button" onClick={refetch}>
          Reintentar
        </button>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <h2 className="section-title">{data.titulo}</h2>
      <p className="card__meta">
        {new Date(`${data.fecha}T00:00:00`).toLocaleDateString("es-CL")} •{" "}
        {data.hora?.slice(0, 5)} • {data.lugar}
      </p>
      {data.direccion && <p className="card__meta">Direccion: {data.direccion}</p>}
      <p className="card__meta">
        Aforo: {data.modo_aforo === "zonas" ? "Por zonas" : "General"}
        {typeof data.cupo_total === "number" ? ` • Cupo total: ${data.cupo_total}` : ""}
      </p>
      <p className="card__meta">
        Estado: <StatusPill label={data.estado_display ?? data.estado} />
      </p>
      {data.imagen_portada && (
        <div style={{ marginTop: "12px" }}>
          <img
            src={data.imagen_portada}
            alt={`Imagen del lugar de ${data.titulo}`}
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}
      {data.descripcion && (
        <p className="card__meta" style={{ marginTop: "12px" }}>
          {data.descripcion}
        </p>
      )}
      <div
        className="grid"
        style={{
          gridAutoFlow: "column",
          justifyContent: "start",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <Link className="btn btn--ghost" to={`/eventos/${data.id}/editar`}>
          Editar
        </Link>
        <Link className="btn btn--ghost" to="/eventos/lista">
          Volver
        </Link>
      </div>
    </section>
  );
}

export default EventDetailPage;
