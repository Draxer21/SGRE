import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { useSerializerSchema } from "../hooks/useSerializerSchema.js";
import {
  createEvento,
  retrieveEvento,
  updateEvento,
} from "../services/eventsService.js";

const ESTADO_OPTIONS = [
  { value: "borrador", label: "Borrador" },
  { value: "convocatoria", label: "En convocatoria" },
  { value: "confirmado", label: "Confirmado" },
];

const EMPTY_VALUES = {
  titulo: "",
  fecha: "",
  hora: "",
  lugar: "",
  direccion: "",
  estado: ESTADO_OPTIONS[0].value,
  descripcion: "",
  modo_aforo: "general",
  cupo_total: 0,
};

function EventFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  useBackendStyles("eventos");
  const { schema: eventoSchema } = useSerializerSchema("eventos");

  // Redirect if user doesn't have edit permissions
  useEffect(() => {
    if (!canEdit()) {
      navigate("/eventos");
    }
  }, [canEdit, navigate]);

  const [formValues, setFormValues] = useState(EMPTY_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    let active = true;
    setLoadingInitial(true);
    retrieveEvento(id)
      .then((data) => {
        if (!active) {
          return;
        }
        setFormValues({
          titulo: data.titulo ?? "",
          fecha: data.fecha ?? "",
          hora: data.hora ?? "",
          lugar: data.lugar ?? "",
          direccion: data.direccion ?? "",
          estado: data.estado ?? ESTADO_OPTIONS[0].value,
          descripcion: data.descripcion ?? "",
          modo_aforo: data.modo_aforo ?? "general",
          cupo_total: data.cupo_total ?? 0,
        });
        setPreviewImage(data.imagen_portada ?? "");
        setFeedback(null);
      })
      .catch((error) => {
        if (active) {
          setFeedback({
            type: "error",
            message: `No pudimos cargar el evento: ${error.message}`,
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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewImage("");
      return;
    }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    if (formErrors.imagen_portada) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.imagen_portada;
        return next;
      });
    }
  };

  const getFieldRule = (fieldName, prop, fallback) =>
    eventoSchema?.[fieldName]?.[prop] ?? fallback;

  const validate = () => {
    const nextErrors = {};
    const tituloMin = getFieldRule("titulo", "min_length", 5);
    if (!formValues.titulo.trim() || formValues.titulo.trim().length < tituloMin) {
      nextErrors.titulo = "El titulo debe tener al menos 5 caracteres.";
    }
    if (!formValues.fecha) {
      nextErrors.fecha = "La fecha es obligatoria.";
    }
    const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!horaRegex.test(formValues.hora)) {
      nextErrors.hora = "Usa el formato 24h HH:MM.";
    }
    const lugarMin = getFieldRule("lugar", "min_length", 3);
    if (!formValues.lugar.trim() || formValues.lugar.trim().length < lugarMin) {
      nextErrors.lugar = "Ingresa un lugar valido (minimo 3 caracteres).";
    }
    const direccionMin = getFieldRule("direccion", "min_length", 5);
    if (!formValues.direccion.trim() || formValues.direccion.trim().length < direccionMin) {
      nextErrors.direccion = "Ingresa una direccion valida (minimo 5 caracteres).";
    }
    if (!ESTADO_OPTIONS.some((option) => option.value === formValues.estado)) {
      nextErrors.estado = "Selecciona un estado valido.";
    }
    const descripcionMax = getFieldRule("descripcion", "max_length", 2000);
    if (formValues.descripcion && formValues.descripcion.length > descripcionMax) {
      nextErrors.descripcion = "Maximo 2000 caracteres.";
    }
    const cupo = Number(formValues.cupo_total);
    if (formValues.modo_aforo === "general") {
      if (!Number.isInteger(cupo) || cupo <= 0) {
        nextErrors.cupo_total = "Ingresa un cupo total mayor a 0.";
      }
    } else {
      if (!Number.isInteger(cupo) || cupo < 0) {
        nextErrors.cupo_total = "Usa un numero valido (0 o mayor).";
      }
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
      const payload = { ...formValues };
      if (selectedFile) {
        payload.imagen_portada = selectedFile;
      }
      if (isEdit) {
        await updateEvento(id, payload);
        setFeedback({ type: "success", message: "Evento actualizado." });
      } else {
        await createEvento(payload);
        setFeedback({ type: "success", message: "Evento creado correctamente." });
        setFormValues(EMPTY_VALUES);
        setSelectedFile(null);
        setPreviewImage("");
      }
      setFormErrors({});
      setTimeout(() => {
        navigate("/eventos/lista");
      }, 500);
    } catch (requestError) {
      const responseData = requestError?.response?.data;
      const serverErrors = {};
      let serverMessage = "No pudimos guardar el evento. Intenta nuevamente.";

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

  const formTitle = isEdit ? "Editar evento" : "Nuevo evento";

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
            <label htmlFor="titulo">
              Titulo <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {eventoSchema?.titulo?.help_text ??
                "Entre 5 y 200 caracteres. Evita abreviaturas ambiguas."}
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
            <p className="card__meta">Formato AAAA-MM-DD. Debe ser hoy o futura.</p>
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
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>{formErrors.hora}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="lugar">
              Lugar <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {eventoSchema?.lugar?.help_text ??
                "Nombre del espacio o direccion completa."}
            </p>
            <input
              id="lugar"
              name="lugar"
              type="text"
              autoComplete="off"
              value={formValues.lugar}
              onChange={handleChange}
              required
              disabled={submitting}
              minLength={getFieldRule("lugar", "min_length", 3)}
              maxLength={getFieldRule("lugar", "max_length", 200)}
            />
            {formErrors.lugar && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.lugar}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="direccion">
              Direccion <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              {eventoSchema?.direccion?.help_text ??
                "Calle y numero (dato atomico, sin embeds)."}
            </p>
            <input
              id="direccion"
              name="direccion"
              type="text"
              autoComplete="street-address"
              value={formValues.direccion}
              onChange={handleChange}
              required
              disabled={submitting}
              minLength={getFieldRule("direccion", "min_length", 5)}
              maxLength={getFieldRule("direccion", "max_length", 200)}
            />
            {formErrors.direccion && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.direccion}
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
            <label htmlFor="modo_aforo">
              Modo de aforo <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">General (un cupo total) o por zonas.</p>
            <select
              id="modo_aforo"
              name="modo_aforo"
              value={formValues.modo_aforo}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="general">General</option>
              <option value="zonas">Zonas</option>
            </select>
            {formErrors.modo_aforo && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.modo_aforo}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="cupo_total">Cupo total</label>
            <p className="card__meta">
              {formValues.modo_aforo === "general"
                ? "Aforo total disponible."
                : "Referencia general; el reparto real se hace por zonas."}
            </p>
            <input
              id="cupo_total"
              name="cupo_total"
              type="number"
              min={formValues.modo_aforo === "general" ? 1 : 0}
              value={formValues.cupo_total}
              onChange={handleChange}
              disabled={submitting}
            />
            {formErrors.cupo_total && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.cupo_total}
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
              {eventoSchema?.descripcion?.help_text ??
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

          <div className="form-field">
            <label htmlFor="imagen_portada">Imagen del lugar</label>
            <input
              id="imagen_portada"
              name="imagen_portada"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={submitting}
            />
            <p className="card__meta">Opcional. JPG/PNG/WebP, max 5 MB.</p>
            {previewImage && (
              <div style={{ marginTop: "8px" }}>
                <img
                  src={previewImage}
                  alt="Vista previa del lugar"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
            )}
            {formErrors.imagen_portada && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.imagen_portada}
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
            <Link className="btn btn--ghost" to="/eventos/lista">
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

export default EventFormPage;
