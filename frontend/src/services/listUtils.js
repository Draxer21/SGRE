export function normalizeListResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      results: payload,
      count: payload.length,
      next: null,
      previous: null,
    };
  }

  const results = Array.isArray(payload?.results) ? payload.results : [];
  return {
    results,
    count: Number(payload?.count ?? results.length ?? 0),
    next: payload?.next ?? null,
    previous: payload?.previous ?? null,
  };
}
