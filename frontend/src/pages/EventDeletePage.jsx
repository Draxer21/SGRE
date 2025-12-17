import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import {
  deleteEvento,
  retrieveEvento,
} from "../services/eventsService.js";

function EventDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  useBackendStyles("eventos");

  // Redirect if user doesn't have edit permissions
  useEffect(() => {
    if (!canEdit()) {
      navigate("/eventos");
    }
  }, [canEdit, navigate]);

  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    retrieveEvento(id)
      .then((data) => {
        if (active) {
          setEvento(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!evento) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteEvento(evento.id);
      navigate("/eventos/lista");
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <h2 className="section-title">Eliminar evento</h2>
      {loading && (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      )}
      {error && (
        <div className="empty-state">
          <p>No pudimos cargar el evento. {error.message}</p>
        </div>
      )}
      {evento && !loading && (
        <>
          <p className="card__meta">
            ¿Confirma eliminar el evento <strong>{evento.titulo}</strong> en{" "}
            <strong>{evento.lugar}</strong>?
          </p>
          <p className="card__meta">
            Fecha: {new Date(`${evento.fecha}T00:00:00`).toLocaleDateString("es-CL")} •{" "}
            {evento.hora?.slice(0, 5)}
          </p>
          <div
            className="grid"
            style={{
              gridAutoFlow: "column",
              justifyContent: "start",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Eliminando..." : "Eliminar"}
            </button>
            <Link className="btn btn--ghost" to="/eventos/lista">
              Cancelar
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default EventDeletePage;
