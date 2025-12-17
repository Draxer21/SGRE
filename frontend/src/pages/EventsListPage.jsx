import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PaginationControls from "../components/PaginationControls.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { listEventos } from "../services/eventsService.js";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "borrador", label: "Borrador" },
  { value: "convocatoria", label: "En convocatoria" },
  { value: "confirmado", label: "Confirmado" },
];
const PAGE_SIZE = 10;

function EventsListPage() {
  const { canEdit } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    estado: "",
  });
  const debouncedSearch = useDebounce(filters.search, 400);
  const queryParams = useMemo(
    () => ({
      page: filters.page,
      page_size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      estado: filters.estado || undefined,
    }),
    [filters.page, debouncedSearch, filters.estado],
  );

  const { data, error, loading, refetch } = useAsync(
    () => listEventos(queryParams),
    [queryParams],
  );
  useBackendStyles("eventos");

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
            Eventos
          </h2>
          <p className="card__meta" style={{ margin: 0 }}>
            Revisa actividades registradas y coordina los proximos pasos.
          </p>
        </div>
        {canEdit() && (
          <Link className="btn btn--primary" to="/eventos/nuevo">
            Nuevo evento
          </Link>
        )}
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
          placeholder="Buscar por titulo o lugar"
          value={filters.search}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))
          }
        />
        <select
          value={filters.estado}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, estado: event.target.value, page: 1 }))
          }
        >
          {ESTADO_OPTIONS.map((option) => (
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
          <p>Error al cargar eventos: {error.message}</p>
          <button type="button" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {Array.isArray(data?.results) && data.results.length > 0 ? (
        <div className="grid" style={{ marginTop: "16px", gap: "16px" }}>
          {data.results.map((evento) => (
            <article key={evento.id} className="card">
              <div className="card__header">
                <h3 className="card__title">{evento.titulo}</h3>
                <span className="badge">
                  {evento.estado_display ?? evento.estado}
                </span>
              </div>
              <p className="card__meta">
                {new Date(`${evento.fecha}T00:00:00`).toLocaleDateString("es-CL")} •{" "}
                {evento.hora?.slice(0, 5)} • {evento.lugar}
              </p>
              <div
                className="grid"
                style={{
                  gridAutoFlow: "column",
                  justifyContent: "start",
                  gap: "12px",
                }}
              >
                <Link className="link" to={`/eventos/${evento.id}`}>
                  Ver detalle
                </Link>
                {canEdit() && (
                  <>
                    <Link className="link" to={`/eventos/${evento.id}/editar`}>
                      Editar
                    </Link>
                    <Link className="link" to={`/eventos/${evento.id}/eliminar`}>
                      Eliminar
                    </Link>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="empty-state" style={{ marginTop: "16px" }}>
            Aun no hay eventos registrados.
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

export default EventsListPage;
