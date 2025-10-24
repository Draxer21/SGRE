import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";

const BACKEND_ORIGIN =
  import.meta.env.VITE_BACKEND_ORIGIN ?? "http://localhost:8000";
const LOGIN_URL = `${BACKEND_ORIGIN}/cuentas/login/`;
const RESERVAS_DESTINATION = `${BACKEND_ORIGIN}/reservas/gestionar/nueva/`;

function readCookie(name) {
  const rawValue = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
  return rawValue ? decodeURIComponent(rawValue) : undefined;
}

async function sha256Hex(value) {
  if (!window.crypto?.subtle) {
    return null;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function LoginPage() {
  useBackendStyles("cuentas");

  const [csrfToken, setCsrfToken] = useState("");
  const [status, setStatus] = useState({ loading: false, error: null });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: true,
  });

  const hasFormData = useMemo(
    () => Boolean(formData.username && formData.password),
    [formData.username, formData.password],
  );

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function bootstrapCsrf() {
      try {
        const response = await fetch(LOGIN_URL, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("No se pudo preparar el formulario");
        }
        const token = readCookie("csrftoken");
        if (active && token) {
          setCsrfToken(token);
        } else if (active && !token) {
          setStatus((prev) => ({
            ...prev,
            error:
              "No se pudo obtener el token de seguridad. Actualiza e intenta de nuevo.",
          }));
        }
      } catch (error) {
        if (!active) {
          return;
        }
        setStatus((prev) => ({
          ...prev,
          error:
            "No pudimos preparar el inicio de sesión. Revisa tu conexión e inténtalo nuevamente.",
        }));
      }
    }

    bootstrapCsrf();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!csrfToken) {
      setStatus({
        loading: false,
        error:
          "No se pudo obtener el token de seguridad. Actualiza e intenta de nuevo.",
      });
      return;
    }

    setStatus({ loading: true, error: null });

    try {
      const body = new URLSearchParams();
      body.set("username", formData.username.trim());

      const hashed = formData.password
        ? await sha256Hex(formData.password)
        : null;

      if (hashed) {
        body.set("password", hashed);
      } else if (formData.password) {
        body.set("password_plain", formData.password);
      }

      if (formData.remember) {
        body.set("remember", "on");
      }

      const response = await fetch(LOGIN_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrfToken,
        },
        redirect: "follow",
        body: body.toString(),
      });

      if (response.redirected || response.url.includes("/cuentas/")) {
        window.location.href = RESERVAS_DESTINATION;
        return;
      }

      setStatus({
        loading: false,
        error:
          "No pudimos validar tus datos. Revisa usuario y contraseña e intenta nuevamente.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error:
          "Ocurrió un error al enviar el formulario. Comprueba tu conexión.",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg, #f2f7ff)",
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 16px",
        }}
      >
        <div
          className="surface"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "var(--radius-lg, 16px)",
          }}
        >
        <header style={{ marginBottom: "20px" }}>
          <h1 className="section-title" style={{ marginBottom: "8px" }}>
            Iniciar sesión
          </h1>
          <p style={{ margin: 0, color: "var(--color-muted, #64748b)" }}>
            Ingresa tu usuario municipal para solicitar una reserva.
          </p>
        </header>

        {status.error && (
          <div className="empty-state" role="alert">
            {status.error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid"
          style={{ gap: "16px", margin: 0 }}
        >
          <label style={{ display: "grid", gap: "6px" }}>
            <span className="card__title">Usuario</span>
            <input
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="usuario.municipal"
            />
          </label>

          <label style={{ display: "grid", gap: "6px" }}>
            <span className="card__title">Contraseña</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.9rem",
              color: "var(--color-muted, #64748b)",
            }}
          >
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            Mantener sesión iniciada
          </label>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={!hasFormData || status.loading}
          >
            {status.loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            fontSize: "0.9rem",
            color: "var(--color-muted, #64748b)",
          }}
        >
          <span>¿Necesitas ayuda? Contacta a la mesa de soporte.</span>
          <Link to="/" className="link">
            Volver al panel
          </Link>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
