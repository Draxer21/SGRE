import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header.jsx";
import NotificationHistory from "../components/NotificationHistory.jsx";
import { useI18n } from "../contexts/I18nContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";

function NotificationsPage() {
  useBackendStyles("notificaciones");
  const { t } = useI18n();
  const [filter, setFilter] = useState("todas");

  const filterOptions = [
    { value: "todas", label: "Todas" },
    { value: "enviadas", label: "Enviadas" },
    { value: "programadas", label: "Programadas" },
    { value: "fallidas", label: "Fallidas" },
  ];

  return (
    <>
      <Header
        title={t("notifications.title", "Centro de Notificaciones")}
        subtitle={t("notifications.subtitle", "Comunica, programa y monitorea mensajes a usuarios.")}
        actions={
          <>
            <Link className="btn btn--ghost" to="/notificaciones/historial">
              Historial completo
            </Link>
          </>
        }
      />


      {/* Filter section */}
      <section className="surface" style={{ padding: "16px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{ fontWeight: 500 }}>Filtrar por estado:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ minWidth: "200px" }}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">Estado de canales</h2>
          <div className="grid">
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">📧 Correo Electrónico</h3>
                <span className="badge" style={{ backgroundColor: "#059669", color: "white" }}>
                  Operativo
                </span>
              </div>
              <p className="card__meta">Última notificación enviada hace 2 horas</p>
            </article>
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">🔔 Push</h3>
                <span className="badge" style={{ backgroundColor: "#059669", color: "white" }}>
                  Operativo
                </span>
              </div>
              <p className="card__meta">Sistema funcionando correctamente</p>
            </article>
            <article className="card">
              <div className="card__header">
                <h3 className="card__title">📱 SMS</h3>
                <span className="badge" style={{ backgroundColor: "#f59e0b", color: "white" }}>
                  En revisión
                </span>
              </div>
              <p className="card__meta">Verificando configuración de proveedor</p>
            </article>
          </div>
        </section>

        <section className="surface">
          <h2 className="section-title">Estadísticas</h2>
          <div className="grid" style={{ gap: "12px" }}>
            <div className="card">
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#52606d" }}>
                Enviadas hoy
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "2rem", fontWeight: 700, color: "#1d4ed8" }}>
                127
              </p>
            </div>
            <div className="card">
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#52606d" }}>
                Programadas
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "2rem", fontWeight: 700, color: "#059669" }}>
                45
              </p>
            </div>
            <div className="card">
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#52606d" }}>
                Tasa de éxito
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "2rem", fontWeight: 700, color: "#059669" }}>
                98.5%
              </p>
            </div>
          </div>
          <div className="grid" style={{ marginTop: "16px" }}>
            <Link className="link" to="/reportes">
              📊 Ver reportes detallados
            </Link>
            <a className="link" href="/admin/">
              ⚙️ Configuración avanzada
            </a>
          </div>
        </section>
      </main>
      <NotificationHistory />
    </>
  );
}

export default NotificationsPage;
