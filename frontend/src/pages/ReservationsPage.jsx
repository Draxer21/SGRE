import StatusPill from "../components/StatusPill.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { listReservas } from "../services/reservationsService.js";

function ReservationsPage() {
  const { data, error, loading, refetch } = useAsync(listReservas, []);
  useBackendStyles("reservas");

  return (
    <section className="card">
      <header>
        <h2 className="card__title">Reservas de espacios</h2>
        <p>Control de ocupacion y seguimiento de solicitudes.</p>
      </header>

      {loading && (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      )}

      {error && (
        <div className="empty-state">
          <p>Error al cargar reservas: {error.message}</p>
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
                <th>Codigo</th>
                <th>Espacio</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Solicitante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.codigo}</td>
                  <td>{reserva.espacio}</td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.hora}</td>
                  <td>{reserva.solicitante}</td>
                  <td>
                    <StatusPill label={reserva.estado_display ?? reserva.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        !error && <p className="empty-state">Aun no hay reservas registradas.</p>
      )}
    </section>
  );
}

export default ReservationsPage;
