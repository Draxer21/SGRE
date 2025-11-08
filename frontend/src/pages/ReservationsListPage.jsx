import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PaginationControls from "../components/PaginationControls.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { listReservas } from "../services/reservationsService.js";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
];
const PAGE_SIZE = 10;

function ReservationsListPage() {
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
    () => listReservas(queryParams),
    [queryParams],
  );
  useBackendStyles("reservas");

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
            Reservas
          </h2>
          <p className="card__meta" style={{ margin: 0 }}>
            Gestiona solicitudes, actualiza estados o revisa detalles.
          </p>
        </div>
        <Link className="btn btn--primary" to="/reservas/nueva">
          Nueva reserva
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
          placeholder="Buscar por codigo, espacio o solicitante"
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
          <p>Error al cargar reservas: {error.message}</p>
          <button type="button" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {Array.isArray(data?.results) && data.results.length > 0 ? (
        <div className="grid" style={{ marginTop: "16px", gap: "16px" }}>
          {data.results.map((reserva) => (
            <article key={reserva.id} className="card">
              <div className="card__header">
                <h3 className="card__title">
                  {reserva.codigo} — {reserva.espacio}
                </h3>
                <span className="tag">
                  {reserva.estado_display ?? reserva.estado}
                </span>
              </div>
              <p className="card__meta">
                {new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString("es-CL")} •{" "}
                {reserva.hora?.slice(0, 5)}
              </p>
              <p className="card__meta">Solicitante: {reserva.solicitante}</p>
              <div
                className="grid"
                style={{
                  gridAutoFlow: "column",
                  justifyContent: "start",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                <Link className="link" to={`/reservas/${reserva.id}`}>
                  Ver detalle
                </Link>
                <Link className="link" to={`/reservas/${reserva.id}/editar`}>
                  Editar
                </Link>
                <Link className="link" to={`/reservas/${reserva.id}/eliminar`}>
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
            Aun no hay reservas registradas.
          </div>
        )
      )}
      <PaginationControls
        page={filters.page}
        pageSize={PAGE_SIZE}
        count={data?.count ?? 0}
        onPageChange={(nextPage) =>
          setFilters((prev) => ({ ...prev, page: nextPage }))
        }
        disabled={loading}
      />
    </section>
  );
}

export default ReservationsListPage;
