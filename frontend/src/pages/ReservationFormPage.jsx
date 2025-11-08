import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useBackendStyles } from "../hooks/useBackendStyles.js";
import {
  createReserva,
  retrieveReserva,
  updateReserva,
} from "../services/reservationsService.js";
import { useSerializerSchema } from "../hooks/useSerializerSchema.js";

const ESTADO_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
];

const EMPTY_VALUES = {
  codigo: "",
  espacio: "",
  fecha: "",
  hora: "",
  solicitante: "",
  estado: ESTADO_OPTIONS[0].value,
  notas: "",
};

function ReservationFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  useBackendStyles("reservas");
  const { schema: reservaSchema } = useSerializerSchema("reservas");

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
    retrieveReserva(id)
      .then((data) => {
        if (!active) {
          return;
        }
        setFormValues({
          codigo: data.codigo ?? "",
          espacio: data.espacio ?? "",
          fecha: data.fecha ?? "",
          hora: data.hora ?? "",
          solicitante: data.solicitante ?? "",
          estado: data.estado ?? ESTADO_OPTIONS[0].value,
          notas: data.notas ?? "",
        });
        setFeedback(null);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setFeedback({
          type: "error",
          message: `No pudimos cargar la reserva: ${error.message}`,
        });
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
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const getFieldRule = (fieldName, prop, fallback) =>
    reservaSchema?.[fieldName]?.[prop] ?? fallback;

  const validate = () => {
    const nextErrors = {};
    const codigoMin = getFieldRule("codigo", "min_length", 4);
    const codigoMax = getFieldRule("codigo", "max_length", 32);
    const codigoRegex = /^[a-z0-9-]+$/;
    if (
      formValues.codigo.length < codigoMin ||
      formValues.codigo.length > codigoMax ||
      !codigoRegex.test(formValues.codigo)
    ) {
      nextErrors.codigo =
        reservaSchema?.codigo?.help_text ??
        "Usa minusculas, numeros o guiones (min. 4 caracteres).";
    }
    const espacioMin = getFieldRule("espacio", "min_length", 3);
    if (
      !formValues.espacio.trim() ||
      formValues.espacio.trim().length < espacioMin
    ) {
      nextErrors.espacio = "Ingresa un espacio valido (minimo 3 caracteres).";
    }
    if (!formValues.fecha) {
      nextErrors.fecha = "La fecha es obligatoria.";
    } else if (!isEdit && formValues.fecha < today) {
      nextErrors.fecha = "Usa una fecha de hoy o futura.";
    }
    const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!horaRegex.test(formValues.hora)) {
      nextErrors.hora = "Usa el formato 24h HH:MM.";
    }
    const solicitanteMin = getFieldRule("solicitante", "min_length", 3);
    if (
      !formValues.solicitante.trim() ||
      formValues.solicitante.trim().length < solicitanteMin
    ) {
      nextErrors.solicitante =
        "Ingresa el area/responsable (minimo 3 caracteres).";
    }
    if (!ESTADO_OPTIONS.some((option) => option.value === formValues.estado)) {
      nextErrors.estado = "Selecciona un estado valido.";
    }
    const notasMax = getFieldRule("notas", "max_length", 2000);
    if (formValues.notas && formValues.notas.length > notasMax) {
      nextErrors.notas = "Maximo 2000 caracteres.";
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
        await updateReserva(id, formValues);
        setFeedback({ type: "success", message: "Reserva actualizada." });
      } else {
        await createReserva(formValues);
        setFeedback({ type: "success", message: "Reserva creada correctamente." });
        setFormValues(EMPTY_VALUES);
      }
      setFormErrors({});
      setTimeout(() => {
        navigate("/reservas/lista");
      }, 500);
    } catch (requestError) {
      const responseData = requestError?.response?.data;
      const serverErrors = {};
      let serverMessage = "No pudimos guardar la reserva. Intenta nuevamente.";

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

  const formTitle = isEdit ? "Editar reserva" : "Nueva reserva";

  return (
    <section className="surface" style={{ margin: "0 auto", maxWidth: "720px" }}>
      <header className="app-header" style={{ marginBottom: "18px" }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: "8px" }}>
            {formTitle}
          </h2>
          <p className="app-subtitle">
            Completa los datos del espacio, horario y responsable.
          </p>
        </div>
      </header>

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
            <label htmlFor="codigo">
              Codigo <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {reservaSchema?.codigo?.help_text ??
                "Solo minusculas, numeros y guiones (ej.: res-2025-001)."}
            </p>
            <input
              id="codigo"
              name="codigo"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={formValues.codigo}
              onChange={handleChange}
              required
              disabled={submitting}
              minLength={getFieldRule("codigo", "min_length", 4)}
              maxLength={getFieldRule("codigo", "max_length", 32)}
            />
            {formErrors.codigo && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.codigo}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="espacio">
              Espacio <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {reservaSchema?.espacio?.help_text ?? "Nombre del espacio o sala."}
            </p>
            <input
              id="espacio"
              name="espacio"
              type="text"
              autoComplete="off"
              value={formValues.espacio}
              onChange={handleChange}
              required
              disabled={submitting}
              minLength={getFieldRule("espacio", "min_length", 3)}
              maxLength={getFieldRule("espacio", "max_length", 150)}
            />
            {formErrors.espacio && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.espacio}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="fecha">
              Fecha <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">Formato AAAA-MM-DD. Hoy o futuro.</p>
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formValues.fecha}
              onChange={handleChange}
              min={isEdit ? undefined : today}
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
            <label htmlFor="hora">
              Hora <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">Formato 24h HH:MM.</p>
            <input
              id="hora"
              name="hora"
              type="time"
              value={formValues.hora}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            {formErrors.hora && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.hora}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="solicitante">
              Solicitante <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {reservaSchema?.solicitante?.help_text ??
                "Area o responsable de la reserva."}
            </p>
            <input
              id="solicitante"
              name="solicitante"
              type="text"
              autoComplete="organization"
              value={formValues.solicitante}
              onChange={handleChange}
              required
              disabled={submitting}
              minLength={getFieldRule("solicitante", "min_length", 3)}
              maxLength={getFieldRule("solicitante", "max_length", 150)}
            />
            {formErrors.solicitante && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.solicitante}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="estado">
              Estado <span aria-hidden="true">*</span>
            </label>
            <select
              id="estado"
              name="estado"
              value={formValues.estado}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              {ESTADO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.estado && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.estado}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="notas">Notas</label>
            <textarea
              id="notas"
              name="notas"
              value={formValues.notas}
              onChange={handleChange}
              maxLength={getFieldRule("notas", "max_length", 2000)}
              disabled={submitting}
            />
            <p className="card__meta">
              {reservaSchema?.notas?.help_text ??
                "Opcional. Maximo 2000 caracteres."}{" "}
              Restantes:{" "}
              {(getFieldRule("notas", "max_length", 2000) ?? 2000) -
                formValues.notas.length}
            </p>
            {formErrors.notas && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.notas}
              </span>
            )}
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
            <Link className="btn btn--ghost" to="/reservas/lista">
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

export default ReservationFormPage;
