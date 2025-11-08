import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useBackendStyles } from "../hooks/useBackendStyles.js";
import {
  deleteReporte,
  retrieveReporte,
} from "../services/reportsService.js";

function ReportDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useBackendStyles("reportes");

  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    retrieveReporte(id)
      .then((data) => {
        if (active) {
          setReporte(data);
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
    if (!reporte) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteReporte(reporte.id);
      navigate("/reportes/lista");
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <h2 className="section-title">Eliminar reporte</h2>
      {loading && (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      )}
      {error && (
        <div className="empty-state">
          <p>No pudimos cargar el reporte. {error.message}</p>
        </div>
      )}
      {reporte && !loading && (
        <>
          <p className="card__meta">
            ¿Confirma eliminar el reporte <strong>{reporte.titulo}</strong>?
          </p>
          <p className="card__meta">
            Fecha: {new Date(`${reporte.fecha}T00:00:00`).toLocaleDateString("es-CL")}
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
            <Link className="btn btn--ghost" to="/reportes/lista">
              Cancelar
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default ReportDeletePage;
