import { useI18n } from "../contexts/I18nContext.jsx";

const FALLBACK_HISTORY = [
  {
    id: 1,
    titulo: "Aviso de mantencion",
    canal: "Correo",
    fecha: "2025-05-28T10:05:00",
    estado: "Enviado",
  },
  {
    id: 2,
    titulo: "Recordatorio de reunion",
    canal: "Push",
    fecha: "2025-05-27T16:40:00",
    estado: "Programado",
  },
  {
    id: 3,
    titulo: "Alerta de clima",
    canal: "SMS",
    fecha: "2025-05-26T08:00:00",
    estado: "Enviado",
  },
];

function NotificationHistory({ records = FALLBACK_HISTORY }) {
  const items = Array.isArray(records) && records.length > 0 ? records : FALLBACK_HISTORY;
  const { t, locale } = useI18n();
  const intlLocale = locale === "en" ? "en-US" : "es-CL";

  return (
    <div className="surface">
      <h3 className="section-title" style={{ marginTop: 0 }}>
        {t("notifications.historyTitle", "Historial reciente")}
      </h3>
      <div className="grid" style={{ gap: "16px" }}>
        {items.map((item) => (
          <article key={item.id ?? `${item.titulo}-${item.fecha}`} className="card">
            <div className="card__header">
              <h4 className="card__title">{item.titulo}</h4>
              <span className="badge">{item.estado}</span>
            </div>
            <p className="card__meta">
              {new Date(item.fecha).toLocaleString(intlLocale)} • Canal: {item.canal}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default NotificationHistory;
