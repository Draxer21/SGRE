import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { useSerializerSchema } from "../hooks/useSerializerSchema.js";
import {
  createCuenta,
  retrieveCuenta,
  updateCuenta,
} from "../services/accountsService.js";

const ROL_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "editor", label: "Editor" },
  { value: "consulta", label: "Consulta" },
];

const EMPTY_VALUES = {
  nombre: "",
  email: "",
  rol: ROL_OPTIONS[0].value,
  activo: true,
};

function AccountFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  useBackendStyles("cuentas");
  const { schema: cuentaSchema } = useSerializerSchema("cuentas");

  // Redirect if user doesn't have admin permissions
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/cuentas");
    }
  }, [isAdmin, navigate]);

  const [formValues, setFormValues] = useState(EMPTY_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    let active = true;
    setLoadingInitial(true);
    retrieveCuenta(id)
      .then((data) => {
        if (!active) {
          return;
        }
        setFormValues({
          nombre: data.nombre ?? "",
          email: data.email ?? "",
          rol: data.rol ?? ROL_OPTIONS[0].value,
          activo: Boolean(data.activo),
        });
        setFeedback(null);
      })
      .catch((error) => {
        if (active) {
          setFeedback({
            type: "error",
            message: `No pudimos cargar la cuenta: ${error.message}`,
          });
        }
      })
      .finally(() => {
        if (active) {
          setLoadingInitial(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const getFieldRule = (fieldName, prop, fallback) =>
    cuentaSchema?.[fieldName]?.[prop] ?? fallback;

  const validate = () => {
    const nextErrors = {};
    const nombreMin = getFieldRule("nombre", "min_length", 3);
    if (!formValues.nombre.trim() || formValues.nombre.trim().length < nombreMin) {
      nextErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!formValues.email.trim()) {
      nextErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = "Ingresa un email valido.";
    }
    if (!ROL_OPTIONS.some((option) => option.value === formValues.rol)) {
      nextErrors.rol = "Selecciona un rol valido.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loadingInitial) {
      return;
    }

    setFeedback(null);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateCuenta(id, formValues);
        setFeedback({ type: "success", message: "Cuenta actualizada." });
      } else {
        await createCuenta(formValues);
        setFeedback({ type: "success", message: "Cuenta creada correctamente." });
        setFormValues(EMPTY_VALUES);
      }
      setFormErrors({});
      setTimeout(() => {
        navigate("/cuentas/lista");
      }, 500);
    } catch (requestError) {
      const responseData = requestError?.response?.data;
      const serverErrors = {};
      let serverMessage = "No pudimos guardar la cuenta. Intenta nuevamente.";

      if (responseData && typeof responseData === "object") {
        Object.entries(responseData).forEach(([field, messages]) => {
          const normalizedMessage = Array.isArray(messages)
            ? messages.join(" ")
            : String(messages);

          if (field === "non_field_errors") {
            serverMessage = normalizedMessage;
          } else {
            serverErrors[field] = normalizedMessage;
          }
        });

        if (Object.keys(serverErrors).length > 0) {
          setFormErrors(serverErrors);
        }
      } else if (requestError?.message) {
        serverMessage = requestError.message;
      }

      setFeedback({ type: "error", message: serverMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const formTitle = isEdit ? "Editar cuenta" : "Nueva cuenta";

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <h2 className="section-title">{formTitle}</h2>

      {feedback && (
        <div
          className="empty-state"
          style={{
            marginBottom: "16px",
            background:
              feedback.type === "success"
                ? "rgba(16, 185, 129, 0.15)"
                : "rgba(248, 113, 113, 0.15)",
            borderColor:
              feedback.type === "success"
                ? "rgba(34, 197, 94, 0.5)"
                : "rgba(239, 68, 68, 0.5)",
            color: feedback.type === "success" ? "#0f5132" : "#7f1d1d",
          }}
        >
          {feedback.message}
        </div>
      )}

      {loadingInitial ? (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      ) : (
        <form className="grid" style={{ gap: "14px" }} onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="nombre">
              Nombre <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {cuentaSchema?.nombre?.help_text ?? "Entre 3 y 150 caracteres."}
            </p>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              value={formValues.nombre}
              onChange={handleChange}
              required
              disabled={submitting}
              minLength={getFieldRule("nombre", "min_length", 3)}
              maxLength={getFieldRule("nombre", "max_length", 150)}
            />
            {formErrors.nombre && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.nombre}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">
              Email <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {cuentaSchema?.email?.help_text ?? "Correo institucional del usuario."}
            </p>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formValues.email}
              onChange={handleChange}
              required
              disabled={submitting}
              maxLength={getFieldRule("email", "max_length", 254)}
            />
            {formErrors.email && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.email}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="rol">
              Rol <span aria-hidden="true">*</span>
            </label>
            <select
              id="rol"
              name="rol"
              value={formValues.rol}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              {ROL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.rol && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.rol}
              </span>
            )}
          </div>

          <div className="form-field" style={{ alignItems: "flex-start" }}>
            <label htmlFor="activo">Activo</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                id="activo"
                name="activo"
                type="checkbox"
                checked={formValues.activo}
                onChange={handleChange}
                disabled={submitting}
              />
              <span className="card__meta">Desmarca para suspender el acceso.</span>
            </div>
          </div>

          <div
            className="grid"
            style={{
              gridAutoFlow: "column",
              justifyContent: "start",
              gap: "12px",
            }}
          >
            <button className="btn btn--primary" type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </button>
            <Link className="btn btn--ghost" to="/cuentas/lista">
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

export default AccountFormPage;
