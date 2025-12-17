import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PaginationControls from "../components/PaginationControls.jsx";
import Table from "../components/Table.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { listEventos } from "../services/eventsService.js";
import { listReservas } from "../services/reservationsService.js";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
];
const PAGE_SIZE = 10;

function ReservationsListPage() {
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    estado: "",
    evento: "",
  });
  const debouncedSearch = useDebounce(filters.search, 400);
  const queryParams = useMemo(
    () => ({
      page: filters.page,
      page_size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      estado: filters.estado || undefined,
      evento: filters.evento || undefined,
    }),
    [filters.page, debouncedSearch, filters.estado, filters.evento],
  );

  const { data, error, loading, refetch } = useAsync(
    () => listReservas(queryParams),
    [queryParams],
  );
  const { data: eventosData } = useAsync(() => listEventos({ page_size: 200, ordering: "-fecha" }), []);
  useBackendStyles("reservas");

  const columns = useMemo(
    () => [
      {
        key: "codigo",
        label: "Código",
        sortable: true,
      },
      {
        key: "evento_titulo",
        label: "Evento",
        sortable: true,
        render: (value, row) =>
          value ? (
            <Link to={`/eventos/${row.evento}`}>{value}</Link>
          ) : (
            <span style={{ color: "#94a3b8" }}>Sin evento</span>
          ),
      },
      {
        key: "espacio",
        label: "Espacio",
        sortable: true,
      },
      {
        key: "fecha",
        label: "Fecha",
        sortable: true,
        render: (value) => new Date(`${value}T00:00:00`).toLocaleDateString("es-CL"),
      },
      {
        key: "hora",
        label: "Hora",
        sortable: true,
        render: (value) => value?.slice(0, 5),
      },
      {
        key: "zona",
        label: "Zona",
        render: (_, row) => row.zona_nombre || <span style={{ color: "#94a3b8" }}>N/A</span>,
      },
      {
        key: "cupos_solicitados",
        label: "Cupos",
        sortable: true,
      },
      {
        key: "solicitante",
        label: "Solicitante",
        sortable: true,
      },
      {
        key: "estado",
        label: "Estado",
        sortable: true,
        align: "center",
        render: (value, row) => (
          <StatusPill status={value}>
            {row.estado_display ?? value}
          </StatusPill>
        ),
      },
      {
        key: "acciones",
        label: "Acciones",
        align: "center",
        render: (_, row) => (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Link className="link" to={`/reservas/${row.id}`}>
              Ver
            </Link>
            {canEdit() && (
              <>
                <Link className="link" to={`/reservas/${row.id}/editar`}>
                  Editar
                </Link>
                <Link className="link" to={`/reservas/${row.id}/eliminar`}>
                  Eliminar
                </Link>
              </>
            )}
          </div>
        ),
      },
    ],
    [canEdit]
  );

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
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => window.open('/api/reservas/export/', '_blank')}
          >
            Exportar CSV
          </button>
          <Link className="btn btn--primary" to="/reservas/nueva">
            Nueva reserva
          </Link>
        </div>
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
        <select
          value={filters.evento}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, evento: event.target.value, page: 1 }))
          }
        >
          <option value="">Todos los eventos</option>
          {(eventosData?.results ?? []).map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.titulo} — {ev.fecha}
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

      {!loading && !error && (
        <Table
          data={data?.results ?? []}
          columns={columns}
          onRowClick={(row) => navigate(`/reservas/${row.id}`)}
          emptyMessage="Aun no hay reservas registradas."
        />
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
