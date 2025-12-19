import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { listEventos } from "../services/eventsService.js";

function PublicLandingPage() {
  useBackendStyles("eventos");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useAsync(
    // Mostrar todos los eventos próximos, sin filtrar por estado para que no quede vacío
    () => listEventos({ ordering: "fecha", page_size: 9 }),
    [],
  );

  const handleReserve = (eventoId) => {
    const reservePath = `/reservas/nueva?evento=${eventoId}`;
    if (user) {
      navigate(reservePath);
      return;
    }
    navigate("/acceso", { state: { from: reservePath } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg, #f2f7ff)",
      }}
    >
      <div style={{ flex: "1 1 auto" }}>
        <div style={{ padding: "24px", maxWidth: "1080px", margin: "0 auto" }}>
          <header className="surface" style={{ padding: "24px", marginBottom: "16px" }}>
            <p className="card__meta" style={{ margin: 0 }}>Municipalidad</p>
            <h1 className="app-title" style={{ margin: "4px 0" }}>
              Eventos disponibles
            </h1>
            <p className="card__meta" style={{ margin: "4px 0 12px" }}>
              Reserva tu cupo en actividades municipales. Inicia sesión o crea tu cuenta para continuar.
            </p>
            <div className="grid" style={{ gridAutoFlow: "column", gap: "12px", justifyContent: "start", flexWrap: "wrap" }}>
              <Link className="btn btn--primary" to="/acceso">
                Iniciar sesión
              </Link>
              <Link className="btn btn--ghost" to="/registro">
                Crear cuenta
              </Link>
              {user && (
                <Link className="btn btn--ghost" to="/dashboard">
                  Ir al panel
                </Link>
              )}
            </div>
          </header>

          <section className="surface" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <h2 className="section-title" style={{ margin: 0 }}>Próximos eventos</h2>
              <Link className="btn btn--ghost" to="/eventos/lista">
                Ver todos
              </Link>
            </div>
            <p className="card__meta" style={{ margin: "4px 0 12px" }}>
              Accede para reservar tu lugar. Si no tienes perfil, crea una cuenta antes de reservar.
            </p>

            {loading && (
              <div className="empty-state" style={{ marginTop: "12px" }}>
                <span className="loader" aria-label="Cargando" />
              </div>
            )}

            {error && (
              <div className="empty-state" style={{ marginTop: "12px" }}>
                <p>No pudimos cargar los eventos. {error.message}</p>
                <button type="button" onClick={refetch}>
                  Reintentar
                </button>
              </div>
            )}

            {Array.isArray(data?.results) && data.results.length > 0 ? (
              <div className="grid" style={{ marginTop: "12px", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                {data.results.map((evento) => (
                  <article key={evento.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div className="card__header" style={{ alignItems: "flex-start" }}>
                      <div>
                        <h3 className="card__title" style={{ margin: 0 }}>{evento.titulo}</h3>
                        <p className="card__meta" style={{ margin: "4px 0" }}>
                          {new Date(`${evento.fecha}T00:00:00`).toLocaleDateString("es-CL")} • {evento.hora?.slice(0, 5)} • {evento.lugar}
                        </p>
                      </div>
                      <StatusPill status={evento.estado} label={evento.estado_display ?? evento.estado} />
                    </div>
                    {evento.descripcion && (
                      <p className="card__meta" style={{ margin: 0 }}>{evento.descripcion}</p>
                    )}
                    <div className="grid" style={{ gridAutoFlow: "column", justifyContent: "start", gap: "12px" }}>
                      <button className="btn btn--primary" type="button" onClick={() => handleReserve(evento.id)}>
                        Reservar
                      </button>
                      <Link className="btn btn--ghost" to={`/eventos/${evento.id}`}>
                        Ver detalle
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              !loading &&
              !error && (
                <div className="empty-state" style={{ marginTop: "12px" }}>
                  No hay eventos disponibles.
                </div>
              )
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PublicLandingPage;
