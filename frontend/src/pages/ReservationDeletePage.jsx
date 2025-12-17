import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import {
  deleteReserva,
  retrieveReserva,
} from "../services/reservationsService.js";

function ReservationDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  useBackendStyles("reservas");

  // Redirect if user doesn't have edit permissions
  useEffect(() => {
    if (!canEdit()) {
      navigate("/reservas");
    }
  }, [canEdit, navigate]);

  const [reserva, setReserva] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    retrieveReserva(id)
      .then((data) => {
        if (active) {
          setReserva(data);
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
    if (!reserva) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteReserva(reserva.id);
      navigate("/reservas/lista");
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <h2 className="section-title">Eliminar reserva</h2>
      {loading && (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      )}
      {error && (
        <div className="empty-state">
          <p>No pudimos cargar la reserva. {error.message}</p>
        </div>
      )}
      {reserva && !loading && (
        <>
          <p className="card__meta">
            ¿Confirma eliminar la reserva <strong>{reserva.codigo}</strong> para{" "}
            <strong>{reserva.espacio}</strong>?
          </p>
          <p className="card__meta">
            Fecha: {new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString("es-CL")} •{" "}
            {reserva.hora?.slice(0, 5)}
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
            <Link className="btn btn--ghost" to="/reservas/lista">
              Cancelar
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default ReservationDeletePage;
