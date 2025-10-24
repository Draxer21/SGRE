import { useNavigate } from "react-router-dom";

import StatusPill from "../components/StatusPill.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { getDashboardOverview } from "../services/dashboardService.js";

function DashboardPage() {
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
              Administracion completa
            </h2>
            <p style={{ margin: 0, color: "#52606d" }}>
              Accede al backend para gestionar cuentas, eventos, reservas y reportes.
            </p>
          </div>
          <button type="button" onClick={() => navigate("/acceso")}>
            Iniciar sesion
          </button>
        </div>
      </section>

      <section className="card-grid card-grid--two">
        <article className="card">
          <h2 className="card__title">Agenda proxima</h2>
          {agenda.length === 0 ? (
            <p className="empty-state">No hay eventos agendados.</p>
          ) : (
            <ul>
              {agenda.map((evento) => (
                <li key={evento.id}>
                  <strong>{evento.titulo}</strong>
                  <div>
                    {new Date(`${evento.fecha}T00:00:00`).toLocaleDateString("es-CL", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    - {evento.hora?.slice(0, 5)} - {evento.lugar}
                  </div>
                  <StatusPill label={evento.estado} />
                </li>
              ))}
            </ul>
          )}
        </article>
        <article className="card">
          <h2 className="card__title">Reservas proximas</h2>
          {reservas.length === 0 ? (
            <p className="empty-state">No hay reservas confirmadas.</p>
          ) : (
            <ul>
              {reservas.map((reserva) => (
                <li key={reserva.id}>
                  <strong>{reserva.espacio}</strong>
                  <div>
                    {new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString("es-CL", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    - {reserva.hora?.slice(0, 5)} - {reserva.solicitante}
                  </div>
                  <StatusPill label={reserva.estado} />
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="card">
        <h2 className="card__title">Indicadores generales</h2>
        <div className="card-grid card-grid--two">
          {Object.entries(indicadores).map(([key, value]) => (
            <div key={key} className="card">
              <span className="tag">{key.replace(/_/g, " ")}</span>
              <strong style={{ fontSize: "2rem" }}>{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
