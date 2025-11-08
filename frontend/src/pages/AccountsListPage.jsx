import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PaginationControls from "../components/PaginationControls.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { listCuentas } from "../services/accountsService.js";

const ROL_OPTIONS = [
  { value: "", label: "Todos los roles" },
  { value: "admin", label: "Administrador" },
  { value: "editor", label: "Editor" },
  { value: "consulta", label: "Consulta" },
];
const ACTIVO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "true", label: "Activas" },
  { value: "false", label: "Inactivas" },
];
const PAGE_SIZE = 10;

function AccountsListPage() {
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    rol: "",
    activo: "",
  });
  const debouncedSearch = useDebounce(filters.search, 400);
  const queryParams = useMemo(
    () => ({
      page: filters.page,
      page_size: PAGE_SIZE,
      search: debouncedSearch || undefined,
      rol: filters.rol || undefined,
      activo: filters.activo || undefined,
    }),
    [filters.page, debouncedSearch, filters.rol, filters.activo],
  );

  const { data, error, loading, refetch } = useAsync(
    () => listCuentas(queryParams),
    [queryParams],
  );
  useBackendStyles("cuentas");

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
            Cuentas
          </h2>
          <p className="card__meta" style={{ margin: 0 }}>
            Gestiona usuarios habilitados y sus roles.
          </p>
        </div>
        <Link className="btn btn--primary" to="/cuentas/nueva">
          Nueva cuenta
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
          placeholder="Buscar por nombre o email"
          value={filters.search}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))
          }
        />
        <select
          value={filters.rol}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, rol: event.target.value, page: 1 }))
          }
        >
          {ROL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filters.activo}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, activo: event.target.value, page: 1 }))
          }
        >
          {ACTIVO_OPTIONS.map((option) => (
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
          <p>Error al cargar cuentas: {error.message}</p>
          <button type="button" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {Array.isArray(data?.results) && data.results.length > 0 ? (
        <div className="grid" style={{ marginTop: "16px", gap: "16px" }}>
          {data.results.map((cuenta) => (
            <article key={cuenta.id} className="card">
              <div className="card__header">
                <h3 className="card__title">{cuenta.nombre}</h3>
                <span className="badge">{cuenta.rol_display ?? cuenta.rol}</span>
              </div>
              <p className="card__meta">{cuenta.email}</p>
              <p className="card__meta">Estado: {cuenta.activo ? "Activa" : "Inactiva"}</p>
              <div
                className="grid"
                style={{
                  gridAutoFlow: "column",
                  justifyContent: "start",
                  gap: "12px",
                }}
              >
                <Link className="link" to={`/cuentas/${cuenta.id}`}>
                  Ver detalle
                </Link>
                <Link className="link" to={`/cuentas/${cuenta.id}/editar`}>
                  Editar
                </Link>
                <Link className="link" to={`/cuentas/${cuenta.id}/eliminar`}>
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
            Aun no hay cuentas registradas.
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

export default AccountsListPage;
