import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useI18n } from "../contexts/I18nContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";

function LoginPage() {
  useBackendStyles("cuentas");
  const { t } = useI18n();
  const { user, login, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;

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

  if (user) {
    return <Navigate to={from ?? "/dashboard"} replace />;
  }

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      await login({
        username: formData.username.trim(),
        password: formData.password,
        remember: formData.remember,
      });
      navigate(from ?? "/dashboard", { replace: true });
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error?.response?.data?.detail ??
          t("auth.errorMissingCsrf", "No se pudo completar la solicitud."),
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
              {t("auth.loginTitle")}
            </h1>
            <p style={{ margin: 0, color: "var(--color-muted, #64748b)" }}>
              {t("auth.loginSubtitle")}
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
              <span className="card__title">{t("auth.username")}</span>
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
              <span className="card__title">{t("auth.password")}</span>
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
              {t("auth.remember")}
            </label>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={!hasFormData || status.loading || loading}
            >
              {status.loading ? t("auth.submitting") : t("auth.submit")}
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
            <span>{t("auth.help")}</span>
            <Link to="/inicio" className="link">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
