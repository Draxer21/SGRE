const STATUS_CLASS_MAP = {
  Confirmado: "status-pill--confirmado",
  "En convocatoria": "status-pill--convocatoria",
  Borrador: "status-pill--borrador",
  Pendiente: "status-pill--pendiente",
  Confirmada: "status-pill--confirmada",
  Cancelada: "status-pill--cancelada",
};

function StatusPill({ label }) {
  const normalized = STATUS_CLASS_MAP[label] ?? "status-pill--borrador";

  return <span className={`status-pill ${normalized}`}>{label}</span>;
}

export default StatusPill;
