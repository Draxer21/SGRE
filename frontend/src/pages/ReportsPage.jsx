import { useAsync } from "../hooks/useAsync.js";
import { listReportes } from "../services/reportsService.js";

function ReportsPage() {
  const { data, error, loading, refetch } = useAsync(listReportes, []);

  return (
    <section className="card">
      <header>
        <h2 className="card__title">Reportes administrativos</h2>
        <p>Publicaciones e informes generados por las unidades.</p>
      </header>

      {loading && (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      )}

      {error && (
        <div className="empty-state">
          <p>Error al cargar reportes: {error.message}</p>
          <button type="button" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {Array.isArray(data) && data.length > 0 ? (
        <div className="card-grid">
          {data.map((reporte) => (
            <article key={reporte.id} className="card">
              <header>
                <h3 className="card__title">{reporte.titulo}</h3>
                <span className="tag">
                  {new Date(`${reporte.fecha}T00:00:00`).toLocaleDateString("es-CL")}
                </span>
              </header>
              <p>{reporte.descripcion}</p>
              <p>
                Estado: <strong>{reporte.publicado ? "Publicado" : "Borrador"}</strong>
              </p>
            </article>
          ))}
        </div>
      ) : (
        !loading &&
        !error && <p className="empty-state">Aun no hay reportes registrados.</p>
      )}
    </section>
  );
}

export default ReportsPage;
