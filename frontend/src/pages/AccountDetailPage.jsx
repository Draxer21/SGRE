import { Link, useParams } from "react-router-dom";

import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { retrieveCuenta } from "../services/accountsService.js";

function AccountDetailPage() {
  const { id } = useParams();
  useBackendStyles("cuentas");
  const { data, error, loading, refetch } = useAsync(
    () => retrieveCuenta(id),
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
        <p className="card__meta">No pudimos cargar la cuenta. {error.message}</p>
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
      <h2 className="section-title">{data.nombre}</h2>
      <p className="card__meta">Usuario: {data.usuario}</p>
      {data.email && <p className="card__meta">{data.email}</p>}
      <p className="card__meta">Rol: {data.rol_display ?? data.rol}</p>
      <p className="card__meta">Estado: {data.activo ? "Activa" : "Inactiva"}</p>
      <div
        className="grid"
        style={{
          gridAutoFlow: "column",
          justifyContent: "start",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <Link className="btn btn--ghost" to={`/cuentas/${data.id}/editar`}>
          Editar
        </Link>
        <Link className="btn btn--ghost" to="/cuentas/lista">
          Volver
        </Link>
      </div>
    </section>
  );
}

export default AccountDetailPage;
