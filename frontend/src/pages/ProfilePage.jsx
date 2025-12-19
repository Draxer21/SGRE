import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import {
  getCuentaMe,
  requestCuentaDeletion,
  updateCuentaMe,
} from "../services/accountsService.js";

function ProfilePage() {
  useBackendStyles("cuentas");
  const { user, role, loading: authLoading, refresh } = useAuth();
  const { data: cuenta, error, loading, refetch } = useAsync(
    () => (user ? getCuentaMe() : Promise.resolve(null)),
    [user],
  );
  const [formValues, setFormValues] = useState({
    nombre: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [status, setStatus] = useState({ saving: false, error: null, success: null });
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteStatus, setDeleteStatus] = useState({ submitting: false, error: null, success: null });

  const roleLabels = {
    admin: "Administrador",
    editor: "Editor",
    consulta: "Consulta",
  };

  const roleDescription = {
    admin: "Puede gestionar y configurar todo el sistema.",
    editor: "Puede crear y editar eventos, reservas y reportes.",
    consulta: "Puede visualizar información, sin editar.",
  };

  useEffect(() => {
    if (!cuenta) {
      return;
    }
    setFormValues((prev) => ({
      ...prev,
      nombre: cuenta.nombre ?? "",
      email: cuenta.email ?? "",
      password: "",
      passwordConfirm: "",
    }));
  }, [cuenta]);

  const canShowForm = useMemo(() => Boolean(user && cuenta), [user, cuenta]);

  return (
    <section className="surface" style={{ maxWidth: "720px", margin: "0 auto" }}>
      <Header
        title="Perfil"
        subtitle="Información de tu sesión y permisos actuales."
        actions={
          <Link className="btn btn--ghost" to="/dashboard">
            Ir al panel
          </Link>
        }
      />

      {authLoading || loading ? (
        <div className="empty-state">
          <span className="loader" aria-label="Cargando" />
        </div>
      ) : user ? (
        <>
          {error && (
            <div className="empty-state">
              <p>No pudimos cargar tu perfil. {error.message}</p>
              <button type="button" onClick={refetch}>
                Reintentar
              </button>
            </div>
          )}
          {canShowForm && (
            <>
              <div className="card" style={{ marginBottom: "16px" }}>
                <div className="card__header">
                  <h3 className="card__title" style={{ margin: 0 }}>{cuenta.nombre}</h3>
                  <p className="card__meta" style={{ margin: 0 }}>Sesión activa</p>
                </div>
                <div className="card__body" style={{ display: "grid", gap: "8px" }}>
                  <div>
                    <p className="card__meta" style={{ margin: 0, fontWeight: 600 }}>Rol</p>
                    <p className="card__meta" style={{ margin: 0 }}>
                      {roleLabels[role] ?? role ?? "No asignado"}
                    </p>
                    {role && (
                      <p className="card__meta" style={{ margin: 0, color: "#475569" }}>
                        {roleDescription[role] ?? "Permisos personalizados."}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="card__meta" style={{ margin: 0, fontWeight: 600 }}>Usuario</p>
                    <p className="card__meta" style={{ margin: 0 }}>
                      {cuenta.usuario}
                    </p>
                  </div>
                  <div>
                    <p className="card__meta" style={{ margin: 0, fontWeight: 600 }}>Email</p>
                    <p className="card__meta" style={{ margin: 0 }}>
                      {cuenta.email || "No registrado"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ display: "grid", gap: "12px" }}>
                <h3 className="card__title" style={{ margin: 0 }}>Actualizar datos</h3>
                {status.error && (
                  <p className="card__meta" style={{ color: "#b91c1c", margin: 0 }}>
                    {status.error}
                  </p>
                )}
                {status.success && (
                  <p className="card__meta" style={{ color: "#059669", margin: 0 }}>
                    {status.success}
                  </p>
                )}
                <form
                  className="grid"
                  style={{ gap: "12px" }}
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (formValues.password && formValues.password.length < 8) {
                      setStatus({
                        saving: false,
                        error: "La contraseña debe tener al menos 8 caracteres.",
                        success: null,
                      });
                      return;
                    }
                    if (formValues.password !== formValues.passwordConfirm) {
                      setStatus({
                        saving: false,
                        error: "Las contraseñas no coinciden.",
                        success: null,
                      });
                      return;
                    }

                    setStatus({ saving: true, error: null, success: null });
                    try {
                      const payload = {
                        nombre: formValues.nombre.trim(),
                        email: formValues.email.trim() || null,
                      };
                      if (formValues.password) {
                        payload.password = formValues.password;
                      }
                      const updated = await updateCuentaMe(payload);
                      await refresh();
                      setFormValues((prev) => ({
                        ...prev,
                        nombre: updated.nombre ?? prev.nombre,
                        email: updated.email ?? prev.email,
                        password: "",
                        passwordConfirm: "",
                      }));
                      setStatus({ saving: false, error: null, success: "Datos actualizados." });
                    } catch (err) {
                      setStatus({
                        saving: false,
                        error: err?.response?.data?.detail ?? "No pudimos actualizar los datos.",
                        success: null,
                      });
                    }
                  }}
                >
                  <label className="form-field">
                    <span className="form-field__label">Nombre completo</span>
                    <input
                      required
                      value={formValues.nombre}
                      onChange={(event) =>
                        setFormValues((prev) => ({ ...prev, nombre: event.target.value }))
                      }
                    />
                  </label>
                  <label className="form-field">
                    <span className="form-field__label">Correo (opcional)</span>
                    <input
                      type="email"
                      value={formValues.email}
                      onChange={(event) =>
                        setFormValues((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="correo@ejemplo.cl"
                    />
                  </label>
                  <label className="form-field">
                    <span className="form-field__label">Nueva contraseña</span>
                    <input
                      type="password"
                      minLength={8}
                      value={formValues.password}
                      onChange={(event) =>
                        setFormValues((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder="Deja vacio si no deseas cambiarla"
                    />
                  </label>
                  <label className="form-field">
                    <span className="form-field__label">Confirmar contraseña</span>
                    <input
                      type="password"
                      minLength={8}
                      value={formValues.passwordConfirm}
                      onChange={(event) =>
                        setFormValues((prev) => ({ ...prev, passwordConfirm: event.target.value }))
                      }
                    />
                  </label>
                  <div className="grid" style={{ gridAutoFlow: "column", gap: "12px", justifyContent: "start" }}>
                    <button type="submit" className="btn btn--primary" disabled={status.saving}>
                      {status.saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card" style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
                <h3 className="card__title" style={{ margin: 0 }}>Solicitar eliminacion</h3>
                <p className="card__meta" style={{ margin: 0 }}>
                  Envia una solicitud y un administrador la revisara.
                </p>
                {deleteStatus.error && (
                  <p className="card__meta" style={{ color: "#b91c1c", margin: 0 }}>
                    {deleteStatus.error}
                  </p>
                )}
                {deleteStatus.success && (
                  <p className="card__meta" style={{ color: "#059669", margin: 0 }}>
                    {deleteStatus.success}
                  </p>
                )}
                <form
                  className="grid"
                  style={{ gap: "12px" }}
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setDeleteStatus({ submitting: true, error: null, success: null });
                    try {
                      await requestCuentaDeletion(deleteReason);
                      setDeleteReason("");
                      setDeleteStatus({
                        submitting: false,
                        error: null,
                        success: "Solicitud enviada correctamente.",
                      });
                    } catch (err) {
                      setDeleteStatus({
                        submitting: false,
                        error: err?.response?.data?.detail ?? "No pudimos enviar la solicitud.",
                        success: null,
                      });
                    }
                  }}
                >
                  <label className="form-field">
                    <span className="form-field__label">Motivo (opcional)</span>
                    <textarea
                      rows={3}
                      value={deleteReason}
                      onChange={(event) => setDeleteReason(event.target.value)}
                    />
                  </label>
                  <div className="grid" style={{ gridAutoFlow: "column", gap: "12px", justifyContent: "start" }}>
                    <button type="submit" className="btn btn--ghost" disabled={deleteStatus.submitting}>
                      {deleteStatus.submitting ? "Enviando..." : "Solicitar eliminacion"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No hay una sesión activa. Inicia sesión para ver tu perfil.</p>
          <Link className="btn btn--primary" to="/acceso">
            Iniciar sesión
          </Link>
        </div>
      )}
    </section>
  );
}

export default ProfilePage;
