import { Link, useParams } from "react-router-dom";

import StatusPill from "../components/StatusPill.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { retrieveReserva } from "../services/reservationsService.js";

function ReservationDetailPage() {
  const { id } = useParams();
  useBackendStyles("reservas");
  const { data, error, loading, refetch } = useAsync(
    () => retrieveReserva(id),
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
        <p className="card__meta">No pudimos cargar la reserva. {error.message}</p>
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
      <h2 className="section-title">
        {data.codigo} — {data.espacio}
      </h2>
      <p className="card__meta">
        {new Date(`${data.fecha}T00:00:00`).toLocaleDateString("es-CL")} •{" "}
        {data.hora?.slice(0, 5)}
      </p>
      <p className="card__meta">Solicitante: {data.solicitante}</p>
      <p className="card__meta">
        Estado: <StatusPill label={data.estado_display ?? data.estado} />
      </p>
      {data.notas && (
        <p className="card__meta" style={{ marginTop: "12px" }}>
          {data.notas}
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
        <Link className="btn btn--ghost" to={`/reservas/${data.id}/editar`}>
          Editar
        </Link>
        <Link className="btn btn--ghost" to="/reservas/lista">
          Volver
        </Link>
      </div>
    </section>
  );
}

export default ReservationDetailPage;
