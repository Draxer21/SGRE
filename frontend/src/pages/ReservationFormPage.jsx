import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import Header from "../components/Header.jsx";
import {
  createReserva,
  retrieveReserva,
  updateReserva,
} from "../services/reservationsService.js";
import { listEventos } from "../services/eventsService.js";
import { useSerializerSchema } from "../hooks/useSerializerSchema.js";

const ESTADO_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
];

const EMPTY_VALUES = {
  espacio: "",
  solicitante: "",
  evento: "",
  zona: "",
  cupos_solicitados: 1,
  estado: ESTADO_OPTIONS[0].value,
  notas: "",
};

function ReservationFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { canEdit, user } = useAuth();
  useBackendStyles("reservas");
  const { schema: reservaSchema } = useSerializerSchema("reservas");

  const canManage = canEdit();

  // Redirect if user doesn't have edit permissions
  useEffect(() => {
    if (isEdit && !canEdit()) {
      navigate("/reservas");
    }
  }, [canEdit, isEdit, navigate]);

  const [formValues, setFormValues] = useState(() => ({
    ...EMPTY_VALUES,
    evento: searchParams.get("evento") || "",
  }));
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [eventOptions, setEventOptions] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const selectedEvent = useMemo(() => {
    const idNum = Number(formValues.evento);
    if (!idNum) return null;
    return eventOptions.find((ev) => ev.id === idNum) || null;
  }, [formValues.evento, eventOptions]);

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
          espacio: data.espacio ?? "",
          solicitante: data.solicitante ?? "",
          evento: data.evento ?? "",
          zona: data.zona ?? "",
          cupos_solicitados: data.cupos_solicitados ?? 1,
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

  // Cargar eventos para seleccionar
  useEffect(() => {
    let active = true;
    setLoadingEventos(true);
    listEventos({ page_size: 200, ordering: "-fecha" })
      .then((resp) => {
        if (!active) return;
        setEventOptions(resp?.results ?? []);
      })
      .catch(() => {
        if (!active) return;
        setEventOptions([]);
      })
      .finally(() => {
        if (active) setLoadingEventos(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => {
      if (name === "evento") {
        return { ...prev, evento: value, zona: "" };
      }
      return { ...prev, [name]: value };
    });
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
    if (canManage) {
      const espacioMin = getFieldRule("espacio", "min_length", 3);
      if (
        !formValues.espacio.trim() ||
        formValues.espacio.trim().length < espacioMin
      ) {
        nextErrors.espacio = "Ingresa un espacio valido (minimo 3 caracteres).";
      }
      const solicitanteMin = getFieldRule("solicitante", "min_length", 3);
      if (
        !formValues.solicitante.trim() ||
        formValues.solicitante.trim().length < solicitanteMin
      ) {
        nextErrors.solicitante =
          "Ingresa el area/responsable (minimo 3 caracteres).";
      }
    }
    if (!formValues.evento || !Number.isInteger(Number(formValues.evento))) {
      nextErrors.evento = "Selecciona un evento valido.";
    }
    if (selectedEvent?.modo_aforo === "zonas") {
      if (!formValues.zona) {
        nextErrors.zona = "Selecciona una zona.";
      }
    }
    const cupos = Number(formValues.cupos_solicitados);
    if (!Number.isInteger(cupos) || cupos <= 0) {
      nextErrors.cupos_solicitados = "Indica una cantidad de cupos mayor a 0.";
    }
    if (canManage && !ESTADO_OPTIONS.some((option) => option.value === formValues.estado)) {
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
      const payload = { ...formValues };
      if (!canManage) {
        payload.solicitante = undefined;
        payload.espacio = undefined;
        payload.estado = ESTADO_OPTIONS[0].value;
      }
      if (payload.evento === "") {
        payload.evento = null;
      }
      if (payload.zona === "") {
        payload.zona = null;
      }
      payload.cupos_solicitados = Number(payload.cupos_solicitados) || 0;
      if (isEdit) {
        await updateReserva(id, payload);
        setFeedback({ type: "success", message: "Reserva actualizada." });
      } else {
        await createReserva(payload);
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
      <Header
        title={formTitle}
        subtitle="Selecciona el evento, cupos y responsable. La fecha/hora se toman del evento."
        style={{ marginBottom: "18px" }}
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
        <form className="grid" style={{ gap: "14px" }} onSubmit={handleSubmit} noValidate>
          {canManage && (
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
          )}

          <div className="form-field">
            <label htmlFor="evento">Evento asociado</label>
            <p className="card__meta">
              Selecciona el evento. La fecha y hora se toman automaticamente del evento.
            </p>
            <select
              id="evento"
              name="evento"
              value={formValues.evento ?? ""}
              onChange={handleChange}
              disabled={submitting || loadingEventos}
              required
            >
              <option value="">Selecciona un evento</option>
              {eventOptions.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titulo} — {ev.fecha}
                </option>
              ))}
            </select>
            {loadingEventos && (
              <p className="card__meta">Cargando eventos...</p>
            )}
            {formErrors.evento && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.evento}
              </span>
            )}
          </div>

          {selectedEvent && (
            <div className="form-field">
              <p className="card__meta" style={{ margin: 0 }}>
                Fecha/Hora del evento: {selectedEvent.fecha} {selectedEvent.hora?.slice(0,5)}
              </p>
              <p className="card__meta" style={{ margin: 0 }}>
                Modo de aforo: {selectedEvent.modo_aforo === "zonas" ? "Zonas" : "General"}
              </p>
              {selectedEvent.modo_aforo === "general" && (
                <p className="card__meta" style={{ margin: 0 }}>
                  Cupo total: {selectedEvent.cupo_total}
                </p>
              )}
            </div>
          )}

          {selectedEvent?.modo_aforo === "zonas" && (
            <div className="form-field">
              <label htmlFor="zona">
                Zona <span aria-hidden="true">*</span>
              </label>
              <p className="card__meta">Selecciona la zona del evento.</p>
              <select
                id="zona"
                name="zona"
                value={formValues.zona ?? ""}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                <option value="">Elige una zona</option>
                {(selectedEvent.zonas ?? []).map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre} — cupo {z.cupo_total}
                  </option>
                ))}
              </select>
              {formErrors.zona && (
                <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                  {formErrors.zona}
                </span>
              )}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="cupos_solicitados">
              Cupos solicitados <span aria-hidden="true">*</span>
            </label>
            <p className="card__meta">
              Indica cuántos cupos ocupará esta reserva.
            </p>
            <input
              id="cupos_solicitados"
              name="cupos_solicitados"
              type="number"
              min={1}
              value={formValues.cupos_solicitados}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            {formErrors.cupos_solicitados && (
              <span style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
                {formErrors.cupos_solicitados}
              </span>
            )}
          </div>

          {canManage && (
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
          )}

          {canManage && (
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
          )}

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
