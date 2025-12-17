import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import Header from "../components/Header.jsx";
import { useSerializerSchema } from "../hooks/useSerializerSchema.js";
import {
  createReporte,
  retrieveReporte,
  updateReporte,
} from "../services/reportsService.js";

const EMPTY_VALUES = {
  titulo: "",
  fecha: "",
  publicado: false,
  categorias: [],
  descripcion: "",
};

function ReportFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  useBackendStyles("reportes");
  const { schema: reporteSchema } = useSerializerSchema("reportes");

  const CATEGORY_OPTIONS = [
    { value: "eventos", label: "Eventos" },
    { value: "reservas", label: "Reservas" },
    { value: "notificaciones", label: "Notificaciones" },
    { value: "indicadores", label: "Indicadores" },
    { value: "financiero", label: "Financiero" },
    { value: "otros", label: "Otros" },
  ];

  // Redirect if user doesn't have edit permissions
  useEffect(() => {
    if (!canEdit()) {
      navigate("/reportes");
    }
  }, [canEdit, navigate]);

  const [formValues, setFormValues] = useState(EMPTY_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    let active = true;
    setLoadingInitial(true);
    retrieveReporte(id)
      .then((data) => {
        if (!active) {
          return;
        }
        setFormValues({
          titulo: data.titulo ?? "",
          fecha: data.fecha ?? "",
          publicado: Boolean(data.publicado),
          categorias: Array.isArray(data.categorias) ? data.categorias : [],
          descripcion: data.descripcion ?? "",
        });
        setFeedback(null);
      })
      .catch((error) => {
        if (active) {
          setFeedback({
            type: "error",
            message: `No pudimos cargar el reporte: ${error.message}`,
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
    if (name === "categorias") {
      const selected = Array.from(event.target.selectedOptions).map((opt) => opt.value);
      setFormValues((prev) => ({ ...prev, categorias: selected }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const getFieldRule = (fieldName, prop, fallback) =>
    reporteSchema?.[fieldName]?.[prop] ?? fallback;

  const validate = () => {
    const nextErrors = {};
    const tituloMin = getFieldRule("titulo", "min_length", 5);
    if (!formValues.titulo.trim() || formValues.titulo.trim().length < tituloMin) {
      nextErrors.titulo = "El titulo debe tener al menos 5 caracteres.";
    }
    if (!formValues.fecha) {
      nextErrors.fecha = "La fecha es obligatoria.";
    }
    if (!formValues.categorias || formValues.categorias.length === 0) {
      nextErrors.categorias = "Selecciona al menos una categoria.";
    }
    const descripcionMax = getFieldRule("descripcion", "max_length", 2000);
    if (formValues.descripcion && formValues.descripcion.length > descripcionMax) {
      nextErrors.descripcion = "Maximo 2000 caracteres.";
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
        await updateReporte(id, formValues);
        setFeedback({ type: "success", message: "Reporte actualizado." });
      } else {
        await createReporte(formValues);
        setFeedback({ type: "success", message: "Reporte creado correctamente." });
        setFormValues(EMPTY_VALUES);
      }
      setFormErrors({});
      setTimeout(() => {
        navigate("/reportes/lista");
      }, 500);
    } catch (requestError) {
      const responseData = requestError?.response?.data;
      const serverErrors = {};
      let serverMessage = "No pudimos guardar el reporte. Intenta nuevamente.";

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

  const formTitle = isEdit ? "Editar reporte" : "Nuevo reporte";
  const formSubtitle = isEdit
    ? "Actualiza los detalles del reporte para mantener la informacion al dia."
    : "Completa la informacion para registrar un nuevo reporte institucional.";

  return (
    <section className="surface surface--form" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <Header
        title={formTitle}
        subtitle={formSubtitle}
        className="form-header"
      />

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
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="titulo">
              Titulo <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {reporteSchema?.titulo?.help_text ?? "Entre 5 y 200 caracteres."}
            </p>
            <input
              id="titulo"
              name="titulo"
              type="text"
              autoComplete="off"
              value={formValues.titulo}
              onChange={handleChange}
              required
              disabled={submitting}
              minLength={getFieldRule("titulo", "min_length", 5)}
              maxLength={getFieldRule("titulo", "max_length", 200)}
            />
            {formErrors.titulo && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.titulo}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="fecha">
              Fecha <span aria-hidden="true">*</span>
            </label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formValues.fecha}
              onChange={handleChange}
              min={today}
              required
              disabled={submitting}
            />
            {formErrors.fecha && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.fecha}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="categorias">
              Categorias <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">Selecciona una o varias.</p>
            <select
              id="categorias"
              name="categorias"
              multiple
              value={formValues.categorias}
              onChange={handleChange}
              disabled={submitting}
              style={{ minHeight: "120px" }}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.categorias && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.categorias}
              </span>
            )}
          </div>

          <div className="form-field" style={{ alignItems: "flex-start" }}>
            <label htmlFor="publicado">Publicado</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                id="publicado"
                name="publicado"
                type="checkbox"
                checked={formValues.publicado}
                onChange={handleChange}
                disabled={submitting}
              />
              <span className="card__meta">
                Marca como publicado para mostrarlo en canales externos.
              </span>
            </div>
            {formErrors.publicado && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.publicado}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="descripcion">Descripcion</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formValues.descripcion}
              onChange={handleChange}
              maxLength={getFieldRule("descripcion", "max_length", 2000)}
              disabled={submitting}
            />
            <p className="card__meta">
              {reporteSchema?.descripcion?.help_text ??
                "Opcional. Maximo 2000 caracteres."}{" "}
              Restantes:{" "}
              {(getFieldRule("descripcion", "max_length", 2000) ?? 2000) -
                formValues.descripcion.length}
            </p>
            {formErrors.descripcion && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.descripcion}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button className="btn btn--primary" type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </button>
            <Link className="btn btn--ghost" to="/reportes/lista">
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

export default ReportFormPage;
