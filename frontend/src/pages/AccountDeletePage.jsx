import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import {
  deleteCuenta,
  retrieveCuenta,
} from "../services/accountsService.js";

function AccountDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  useBackendStyles("cuentas");

  // Redirect if user doesn't have admin permissions
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/cuentas");
    }
  }, [isAdmin, navigate]);

  const [cuenta, setCuenta] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    retrieveCuenta(id)
      .then((data) => {
        if (active) {
          setCuenta(data);
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
    if (!cuenta) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteCuenta(cuenta.id);
      navigate("/cuentas/lista");
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <h2 className="section-title">Eliminar cuenta</h2>
      {loading && (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      )}
      {error && (
        <div className="empty-state">
          <p>No pudimos cargar la cuenta. {error.message}</p>
        </div>
      )}
      {cuenta && !loading && (
        <>
          <p className="card__meta">
            ¿Confirma eliminar la cuenta <strong>{cuenta.nombre}</strong>?
          </p>
          <p className="card__meta">{cuenta.email}</p>
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
            <Link className="btn btn--ghost" to="/cuentas/lista">
              Cancelar
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default AccountDeletePage;
