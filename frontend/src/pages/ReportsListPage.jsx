import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PaginationControls from "../components/PaginationControls.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { listReportes } from "../services/reportsService.js";

const PUBLICADO_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Publicado" },
  { value: "false", label: "Borrador" },
];
const PAGE_SIZE = 10;

function ReportsListPage() {
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    publicado: "",
  });
  const debouncedSearch = useDebounce(filters.search, 400);
  const queryParams = useMemo(
    () => ({
      page: filters.page,
      page_size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      publicado: filters.publicado || undefined,
    }),
    [filters.page, debouncedSearch, filters.publicado],
  );

  const { data, error, loading, refetch } = useAsync(
    () => listReportes(queryParams),
    [queryParams],
  );
  useBackendStyles("reportes");

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "960px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <h2 className="section-title" style={{ margin: 0 }}>
            Reportes
          </h2>
          <p className="card__meta" style={{ margin: 0 }}>
            Consulta informes registrados, edita o publica novedades.
          </p>
        </div>
        <Link className="btn btn--primary" to="/reportes/nuevo">
          Nuevo reporte
        </Link>
      </div>

      <div
        className="grid"
        style={{
          marginTop: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        <input
          type="search"
          placeholder="Buscar por titulo o descripcion"
          value={filters.search}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))
          }
        />
        <select
          value={filters.publicado}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, publicado: event.target.value, page: 1 }))
          }
        >
          {PUBLICADO_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="empty-state" style={{ marginTop: "16px" }}>
          <span className="loader" aria-label="Cargando" />
        </div>
      )}

      {error && (
        <div className="empty-state" style={{ marginTop: "16px" }}>
          <p>Error al cargar reportes: {error.message}</p>
          <button type="button" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {Array.isArray(data?.results) && data.results.length > 0 ? (
        <div className="grid" style={{ marginTop: "16px", gap: "16px" }}>
          {data.results.map((reporte) => (
            <article key={reporte.id} className="card">
              <div className="card__header">
                <h3 className="card__title">{reporte.titulo}</h3>
                <span className="tag">
                  {reporte.publicado ? "Publicado" : "Borrador"}
                </span>
              </div>
              <p className="card__meta">
                {new Date(`${reporte.fecha}T00:00:00`).toLocaleDateString("es-CL")}
              </p>
              <div
                className="grid"
                style={{
                  gridAutoFlow: "column",
                  justifyContent: "start",
                  gap: "12px",
                }}
              >
                <Link className="link" to={`/reportes/${reporte.id}`}>
                  Ver detalle
                </Link>
                <Link className="link" to={`/reportes/${reporte.id}/editar`}>
                  Editar
                </Link>
                <Link className="link" to={`/reportes/${reporte.id}/eliminar`}>
                  Eliminar
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="empty-state" style={{ marginTop: "16px" }}>
            Aun no hay reportes registrados.
          </div>
        )
      )}
      <PaginationControls
        page={filters.page}
        pageSize={PAGE_SIZE}
        count={data?.count ?? 0}
        onPageChange={(next) => setFilters((prev) => ({ ...prev, page: next }))}
        disabled={loading}
      />
    </section>
  );
}

export default ReportsListPage;
