import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { getDashboardOverview } from "../services/dashboardService.js";

/**
 * Dashboard simplificado para usuarios con rol "consulta"
 * Solo muestra información de lectura, sin opciones de creación/edición
 */
function UserDashboard() {
  const { data, error, loading, refetch } = useAsync(getDashboardOverview, []);
  const navigate = useNavigate();
  useBackendStyles("cuentas");

  if (loading) {
    return (
      <section className="card">
        <span className="loader" aria-label="Cargando" />
        <p>Cargando datos del panel...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card">
        <h2 className="card__title">No pudimos cargar la información</h2>
        <p>Detalle: {error.message}</p>
        <button type="button" onClick={refetch}>
          Reintentar
        </button>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const { agenda = [], reservas = [], indicadores = {} } = data;

  return (
    <>
      {/* Welcome section */}
      <section className="card">
        <div>
          <h2 className="card__title" style={{ marginBottom: "4px" }}>
            Panel de Consulta
          </h2>
          <p style={{ margin: 0, color: "#52606d" }}>
            Vista de solo lectura del sistema municipal. Para solicitar cambios, contacta a un administrador.
          </p>
        </div>
      </section>

      {/* Key metrics - Read only */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <StatCard
          title="Total Eventos"
          value={indicadores.eventos_totales ?? 0}
          subtitle="Registrados en el sistema"
          icon="📅"
          color="#1d4ed8"
        />
        <StatCard
          title="Total Reservas"
          value={indicadores.reservas_totales ?? 0}
          subtitle="Espacios solicitados"
          icon="🏢"
          color="#059669"
        />
        <StatCard
          title="Reportes Publicados"
          value={indicadores.reportes_publicados ?? 0}
          subtitle="Disponibles públicamente"
          icon="📊"
          color="#dc2626"
        />
      </div>

      {/* Upcoming activities - Read only */}
      <section className="card-grid card-grid--two">
        <article className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 className="card__title" style={{ margin: 0 }}>Próximos Eventos</h2>
            <button
              type="button"
              className="btn btn--ghost"
              style={{ padding: "6px 12px", fontSize: "0.85rem" }}
              onClick={() => navigate("/eventos/lista")}
            >
              Ver todos
            </button>
          </div>
          {agenda.length === 0 ? (
            <p className="empty-state">No hay eventos agendados.</p>
          ) : (
            <ul>
              {agenda.map((evento) => (
                <li key={evento.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/eventos/${evento.id}`)}>
                  <strong>{evento.titulo}</strong>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#52606d" }}>
                      {new Date(`${evento.fecha}T00:00:00`).toLocaleDateString("es-CL", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      • {evento.hora?.slice(0, 5)} • {evento.lugar}
                    </span>
                    <StatusPill status={evento.estado} label={evento.estado} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
        <article className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 className="card__title" style={{ margin: 0 }}>Próximas Reservas</h2>
            <button
              type="button"
              className="btn btn--ghost"
              style={{ padding: "6px 12px", fontSize: "0.85rem" }}
              onClick={() => navigate("/reservas/lista")}
            >
              Ver todas
            </button>
          </div>
          {reservas.length === 0 ? (
            <p className="empty-state">No hay reservas confirmadas.</p>
          ) : (
            <ul>
              {reservas.map((reserva) => (
                <li key={reserva.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/reservas/${reserva.id}`)}>
                  <strong>{reserva.espacio}</strong>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#52606d" }}>
                      {new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString("es-CL", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      • {reserva.hora?.slice(0, 5)} • {reserva.solicitante}
                    </span>
                    <StatusPill status={reserva.estado} label={reserva.estado} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      {/* Info section for users */}
      <section className="card">
        <h2 className="card__title">Información</h2>
        <div className="grid" style={{ gap: "12px" }}>
          <p style={{ margin: 0, padding: "12px", backgroundColor: "#f0f4f8", borderRadius: "8px" }}>
            ℹ️ Tu cuenta tiene permisos de <strong>solo lectura</strong>. Puedes consultar información pero no crear ni modificar registros.
          </p>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/eventos/lista")}
            >
              📅 Consultar Eventos
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/reservas/lista")}
            >
              🏢 Consultar Reservas
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/reportes/lista")}
            >
              📊 Ver Reportes
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default UserDashboard;
