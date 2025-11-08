import { Link } from "react-router-dom";

import { useI18n } from "../contexts/I18nContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import NotificationHistory from "../components/NotificationHistory.jsx";

function NotificationsPage() {
  useBackendStyles("notificaciones");
  const { t } = useI18n();

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-title">{t("notifications.title")}</h1>
          <p className="app-subtitle">
            {t("notifications.subtitle")}
          </p>
        </div>
        <div className="grid" style={{ gap: "12px", gridAutoFlow: "column" }}>
          <Link className="btn btn--primary" to="/notificaciones/nueva">
            Nueva notificacion
          </Link>
          <Link className="btn btn--ghost" to="/notificaciones/historial">
            Historial
          </Link>
        </div>
      </header>

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">Estado de canales</h2>
          <div className="grid">
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Correo</h3>
              </div>
              <p className="card__meta">Operativo</p>
            </article>
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">Push</h3>
              </div>
              <p className="card__meta">Operativo</p>
            </article>
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">SMS</h3>
              </div>
              <p className="card__meta">En revision</p>
            </article>
          </div>
        </section>

        <section className="surface">
          <h2 className="section-title">Enlaces</h2>
          <div className="grid">
            <Link className="link" to="/reportes">
              Ver reportes
            </Link>
            <a className="link" href="/admin/">
              Administracion
            </a>
          </div>
        </section>
      </main>
      <NotificationHistory />
    </>
  );
}

export default NotificationsPage;
