import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import Header from "../components/Header.jsx";
import { listReportes } from "../services/reportsService.js";

function ReportsPage() {
  useBackendStyles("reportes");
  const { canEdit } = useAuth();
  const { data, loading, error } = useAsync(
    () => listReportes({ page: 1, page_size: 5 }),
    [],
  );

  return (
    <>
      <Header
        title="Reportes e Indicadores"
        subtitle={canEdit() ? "Monitorea desempeno y publica informes." : "Consulta reportes publicados."}
        actions={
          <>
            {canEdit() && (
              <Link className="btn btn--primary" to="/reportes/nuevo">
                Nuevo reporte
              </Link>
            )}
            <Link className="btn btn--ghost" to="/reportes/lista">
              {canEdit() ? "Gestionar" : "Ver lista"}
            </Link>
          </>
        }
      />

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">{canEdit() ? "Comienza aqui" : "Información"}</h2>
          <article className="card">
            <div className="card__header">
              <h3 className="card__title">{canEdit() ? "Crear un informe" : "Consulta reportes"}</h3>
            </div>
            <p className="card__meta">
              {canEdit() ? "Titulo, fecha, descripcion y estado de publicacion." : "Revisa reportes publicados y sus estadisticas."}
            </p>
            <Link className="link" to={canEdit() ? "/reportes/nuevo" : "/reportes/lista"}>
              {canEdit() ? "Crear ahora" : "Ver reportes"}
            </Link>
          </article>
        </section>

        <section className="surface">
          <h2 className="section-title">Historial de reportes</h2>
          {loading && (
            <div className="empty-state" style={{ marginTop: "8px" }}>
              <span className="loader" aria-label="Cargando" />
            </div>
          )}

          {error && (
            <div className="empty-state" style={{ marginTop: "8px" }}>
              <p>Error al cargar historial: {error.message}</p>
              <Link className="link" to="/reportes/lista">
                Ir a lista completa
              </Link>
            </div>
          )}

          {Array.isArray(data?.results) && data.results.length > 0 ? (
            <div className="grid" style={{ gap: "12px" }}>
              {data.results.map((reporte) => (
                <article key={reporte.id} className="card">
                  <div className="card__header">
                    <h3 className="card__title" style={{ margin: 0 }}>
                      {reporte.titulo}
                    </h3>
                    <span className="tag">{reporte.publicado ? "Publicado" : "Borrador"}</span>
                  </div>
                  <p className="card__meta" style={{ margin: "4px 0" }}>
                    {new Date(`${reporte.fecha}T00:00:00`).toLocaleDateString("es-CL")}
                  </p>
                  <div className="grid" style={{ gridAutoFlow: "column", justifyContent: "start", gap: "12px" }}>
                    <Link className="link" to={`/reportes/${reporte.id}`}>
                      Ver detalle
                    </Link>
                    {canEdit() && (
                      <Link className="link" to={`/reportes/${reporte.id}/editar`}>
                        Editar
                      </Link>
                    )}
                  </div>
                </article>
              ))}
              <Link className="btn btn--ghost" to="/reportes/lista" style={{ justifySelf: "start" }}>
                Ver historial completo
              </Link>
            </div>
          ) : (
            !loading &&
            !error && (
              <div className="empty-state" style={{ marginTop: "8px" }}>
                Aun no hay reportes registrados.
              </div>
            )
          )}
        </section>
      </main>
    </>
  );
}

export default ReportsPage;
