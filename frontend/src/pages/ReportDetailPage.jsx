import { Link, useParams } from "react-router-dom";

import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { retrieveReporte } from "../services/reportsService.js";

function ReportDetailPage() {
  const { id } = useParams();
  useBackendStyles("reportes");
  const { data, error, loading, refetch } = useAsync(
    () => retrieveReporte(id),
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
        <p className="card__meta">No pudimos cargar el reporte. {error.message}</p>
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
        Fecha: {new Date(`${data.fecha}T00:00:00`).toLocaleDateString("es-CL")}
      </p>
      <p className="card__meta">
        Estado: {data.publicado ? "Publicado" : "Borrador"}
      </p>
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
        <Link className="btn btn--ghost" to={`/reportes/${data.id}/editar`}>
          Editar
        </Link>
        <Link className="btn btn--ghost" to="/reportes/lista">
          Volver
        </Link>
      </div>
    </section>
  );
}

export default ReportDetailPage;
