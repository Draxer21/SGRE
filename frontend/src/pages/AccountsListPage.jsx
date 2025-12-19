import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PaginationControls from "../components/PaginationControls.jsx";
import Table from "../components/Table.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
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
  const navigate = useNavigate();
  const { isAdmin, canEdit } = useAuth();
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

  const columns = useMemo(
    () => [
      {
        key: "nombre",
        label: "Nombre",
        sortable: true,
      },
      {
        key: "usuario",
        label: "Usuario",
        sortable: true,
      },
      {
        key: "email",
        label: "Email",
        sortable: true,
      },
      {
        key: "rol_display",
        label: "Rol",
        sortable: true,
        render: (value, row) => (
          <span className="badge">{value ?? row.rol}</span>
        ),
      },
      {
        key: "activo",
        label: "Estado",
        sortable: true,
        align: "center",
        render: (value) => (
          <span style={{ color: value ? "#059669" : "#dc2626" }}>
            {value ? "Activa" : "Inactiva"}
          </span>
        ),
      },
      {
        key: "acciones",
        label: "Acciones",
        align: "center",
        render: (_, row) => (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <Link className="link" to={`/cuentas/${row.id}`}>
              Ver
            </Link>
            {canEdit() && (
              <>
                <Link className="link" to={`/cuentas/${row.id}/editar`}>
                  Editar
                </Link>
                {isAdmin() && (
                  <Link className="link" to={`/cuentas/${row.id}/eliminar`}>
                    Eliminar
                  </Link>
                )}
              </>
            )}
          </div>
        ),
      },
    ],
    [canEdit, isAdmin]
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
            Cuentas
          </h2>
          <p className="card__meta" style={{ margin: 0 }}>
            Gestiona usuarios habilitados y sus roles.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {isAdmin() && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => window.open('/api/cuentas/export/', '_blank')}
            >
              Exportar CSV
            </button>
          )}
          {isAdmin() && (
            <Link className="btn btn--primary" to="/cuentas/nueva">
              Nueva cuenta
            </Link>
          )}
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
          placeholder="Buscar por nombre, usuario o email"
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

      {!loading && !error && (
        <Table
          data={data?.results ?? []}
          columns={columns}
          onRowClick={(row) => navigate(`/cuentas/${row.id}`)}
          emptyMessage="Aun no hay cuentas registradas."
        />
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
