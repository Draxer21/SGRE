import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard.jsx";
import StatusPill from "../components/StatusPill.jsx";
import UserDashboard from "./UserDashboard.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { getDashboardOverview } from "../services/dashboardService.js";

function DashboardPage() {
  const { data, error, loading, refetch } = useAsync(getDashboardOverview, []);
  const { user, role, isAdmin, canEdit } = useAuth();
  const navigate = useNavigate();
  useBackendStyles("cuentas");

  // Show user dashboard for users with "consulta" role
  if (role === "consulta") {
    return <UserDashboard />;
  }

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
        <h2 className="card__title">No pudimos cargar la informacion</h2>
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div>
            <h2 className="card__title" style={{ marginBottom: "4px" }}>
              {isAdmin() ? `Panel de Administrador - ${user}` : canEdit() ? `Panel de Editor - ${user}` : `Bienvenido, ${user}`}
            </h2>
            <p style={{ margin: 0, color: "#52606d" }}>
              {isAdmin() 
                ? "Control total del sistema municipal. Gestiona usuarios, eventos, reservas y reportes." 
                : "Gestiona contenido del sistema municipal. Crea y edita eventos, reservas y reportes."}
            </p>
          </div>
          {!user && (
            <button type="button" onClick={() => navigate("/acceso")}>
              Iniciar sesión
            </button>
          )}
        </div>
      </section>

      {/* Key metrics */}
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

      {/* Upcoming activities */}
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

      {/* Quick actions */}
      <section className="card">
        <h2 className="card__title">Acciones Rápidas</h2>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate("/eventos/nuevo")}
          >
            Crear Evento
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate("/reservas/nueva")}
          >
            Nueva Reserva
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate("/reportes/nuevo")}
          >
            Generar Reporte
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => window.open("/admin/", "_blank")}
          >
            Administración
          </button>
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
