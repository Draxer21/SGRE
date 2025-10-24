import StatusPill from "../components/StatusPill.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { listEventos } from "../services/eventsService.js";

function EventsPage() {
  const { data, error, loading, refetch } = useAsync(listEventos, []);
  useBackendStyles("eventos");

  return (
    <section className="card">
      <header>
        <h2 className="card__title">Eventos institucionales</h2>
        <p>Listado de actividades registradas en el sistema.</p>
      </header>

      {loading && (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      )}

      {error && (
        <div className="empty-state">
          <p>Error al cargar eventos: {error.message}</p>
          <button type="button" onClick={refetch}>
            Reintentar
          </button>
        </div>
      )}

      {Array.isArray(data) && data.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Lugar</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((evento) => (
                <tr key={evento.id}>
                  <td>{evento.titulo}</td>
                  <td>{evento.fecha}</td>
                  <td>{evento.hora}</td>
                  <td>{evento.lugar}</td>
                  <td>
                    <StatusPill label={evento.estado_display ?? evento.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        !error && <p className="empty-state">Aun no hay eventos registrados.</p>
      )}
    </section>
  );
}

export default EventsPage;
