import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";

function RegisterPage() {
  useBackendStyles("cuentas");
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    password: "",
    passwordConfirm: "",
  });
  const [status, setStatus] = useState({ loading: false, error: null });

  const hasFormData = useMemo(() => {
    return Boolean(form.nombre && form.usuario && form.password && form.passwordConfirm);
  }, [form.nombre, form.usuario, form.password, form.passwordConfirm]);

  if (user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-bg, #f2f7ff)",
        }}
      >
        <div style={{ flex: "1 1 auto" }}>
          <section className="surface" style={{ maxWidth: "720px", margin: "24px auto" }}>
            <h2 className="section-title">Ya tienes sesión activa</h2>
            <p className="card__meta">Puedes continuar al panel o cerrar sesión si deseas registrar otra cuenta.</p>
            <div className="grid" style={{ gridAutoFlow: "column", gap: "12px", justifyContent: "start" }}>
              <Link className="btn btn--primary" to="/dashboard">Ir al panel</Link>
              <Link className="btn btn--ghost" to="/perfil">Ver perfil</Link>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg, #f2f7ff)",
      }}
    >
      <div style={{ flex: "1 1 auto" }}>
        <section className="surface" style={{ maxWidth: "720px", margin: "24px auto" }}>
          <h1 className="section-title">Registro de usuarios</h1>
          <p className="card__meta" style={{ marginTop: 0 }}>
            Crea tu cuenta para reservar eventos. Ingresarás con un perfil de solo lectura.
          </p>

          <form
            className="grid"
            style={{ gap: "12px", marginTop: "12px" }}
            onSubmit={async (e) => {
              e.preventDefault();
              if (form.password !== form.passwordConfirm) {
                setStatus({ loading: false, error: "Las contraseñas no coinciden." });
                return;
              }
              setStatus({ loading: true, error: null });
              try {
                await register({
                  nombre: form.nombre.trim(),
                  usuario: form.usuario.trim(),
                  password: form.password,
                });
                navigate("/inicio", { replace: true });
              } catch (error) {
                const responseData = error?.response?.data;
                const fieldMessage =
                  responseData && typeof responseData === "object"
                    ? Object.values(responseData)[0]
                    : null;
                setStatus({
                  loading: false,
                  error:
                    (Array.isArray(fieldMessage) ? fieldMessage.join(" ") : fieldMessage) ??
                    responseData?.detail ??
                    "No se pudo completar el registro.",
                });
              }
            }}
          >
            <label className="form-field">
              <span className="form-field__label">Nombre completo</span>
              <input
                required
                value={form.nombre}
                onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Ana Torres"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Usuario</span>
              <input
                required
                autoComplete="username"
                value={form.usuario}
                onChange={(e) => setForm((prev) => ({ ...prev, usuario: e.target.value }))}
                placeholder="usuario"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Contraseña</span>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Minimo 8 caracteres"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Confirmar contraseña</span>
              <input
                type="password"
                required
                minLength={8}
                value={form.passwordConfirm}
                onChange={(e) => setForm((prev) => ({ ...prev, passwordConfirm: e.target.value }))}
                placeholder="Repite la contraseña"
              />
            </label>

            <div className="grid" style={{ gridAutoFlow: "column", gap: "12px", justifyContent: "start" }}>
              <button type="submit" className="btn btn--primary" disabled={!hasFormData || status.loading}>
                {status.loading ? "Creando..." : "Crear cuenta"}
              </button>
              <Link className="btn btn--ghost" to="/acceso">
                Ya tengo cuenta
              </Link>
            </div>
            {status.error && (
              <p className="card__meta" style={{ color: "#b91c1c" }}>
                {status.error}
              </p>
            )}
          </form>

          <div className="surface" style={{ marginTop: "16px", padding: "12px" }}>
            <h3 className="card__title" style={{ marginTop: 0 }}>¿Qué podrás hacer?</h3>
            <ul className="card__meta" style={{ paddingLeft: "16px", margin: 0, display: "grid", gap: "4px" }}>
              <li>Reservar cupos en eventos municipales.</li>
              <li>Ver el estado de tus reservas.</li>
              <li>Actualizar tus datos y solicitar la eliminacion de la cuenta.</li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;
