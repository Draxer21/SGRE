function PaginationControls({ page, pageSize, count, onPageChange, disabled }) {
  if (count <= pageSize) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "16px",
        gap: "12px",
      }}
    >
      <span className="card__meta">
        Página {page} de {totalPages}
      </span>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev || disabled}
        >
          Anterior
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext || disabled}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
