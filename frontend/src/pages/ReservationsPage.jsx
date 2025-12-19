import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import Header from "../components/Header.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { listReservas } from "../services/reservationsService.js";

function ReservationsPage() {
  useBackendStyles("reservas");
  const { user, canEdit } = useAuth();
  const { data: reservasData, loading: loadingReservas, error: errorReservas } = useAsync(
    () => listReservas({ page_size: 5, ordering: "-creado" }),
    [],
  );

  return (
    <>
      <Header
        title="Gestion de Reservas"
        subtitle={canEdit() ? "Controla espacios, cupos y solicitudes." : "Consulta reservas de espacios."}
        actions={
          <>
            {user && (
              <Link className="btn btn--primary" to="/reservas/nueva">
                Nueva reserva
              </Link>
            )}
            <Link className="btn btn--ghost" to="/reservas/lista">
              {canEdit() ? "Gestionar" : "Ver lista"}
            </Link>
          </>
        }
      />
      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">Panel rapido</h2>
          <div className="grid grid--two-columns">
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Espacios</h3>
              </div>
              <p className="card__meta">{canEdit() ? "Define y administra salas." : "Consulta espacios disponibles."}</p>
              <Link className="link" to="/reservas/lista">
                Revisar reservas
              </Link>
            </article>
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Solicitudes</h3>
              </div>
              <p className="card__meta">{canEdit() ? "Aprueba o rechaza reservas." : "Consulta estado de solicitudes."}</p>
              <Link className="link" to="/reservas/lista">
                Ver solicitudes
              </Link>
            </article>
          </div>
        </section>

        <section className="surface">
          <h2 className="section-title">Accesos rapidos</h2>
          <div className="grid">
            <Link className="link" to="/reservas/lista">
              Ver todas las reservas
            </Link>
            <Link className="link" to="/eventos">
              Ir a Eventos
            </Link>
          </div>
        </section>

        <section className="surface">
          <h2 className="section-title">Reservas recientes</h2>
          {loadingReservas && (
            <p className="card__meta">Cargando reservas...</p>
          )}
          {errorReservas && (
            <p className="card__meta" style={{ color: "#b91c1c" }}>
              No se pudieron cargar las reservas.
            </p>
          )}
          {!loadingReservas && !errorReservas && (
            <div className="card" style={{ padding: 0 }}>
              <div className="card__body">
                {(reservasData?.results ?? []).length === 0 ? (
                  <p className="card__meta" style={{ margin: 0 }}>Sin reservas recientes.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {(reservasData?.results ?? []).map((reserva) => (
                      <li
                        key={reserva.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <div>
                          <p className="card__title" style={{ margin: 0, fontSize: "0.95rem" }}>
                            {reserva.codigo}
                          </p>
                          <p className="card__meta" style={{ margin: 0 }}>
                            {reserva.evento_titulo || "Sin evento"} • {reserva.solicitante}
                          </p>
                          <p className="card__meta" style={{ margin: 0 }}>
                            {reserva.fecha} {reserva.hora?.slice(0, 5)}
                          </p>
                        </div>
                        <Link className="link" to={`/reservas/${reserva.id}`}>
                          Ver
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default ReservationsPage;
