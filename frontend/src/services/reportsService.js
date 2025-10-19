import apiClient from "./apiClient";

export async function listReportes(params = {}) {
  const response = await apiClient.get("reportes/", { params });
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload?.results ?? [];
}

export async function createReporte(payload) {
  const response = await apiClient.post("reportes/", payload);
  return response.data;
}

export async function updateReporte(id, payload) {
  const response = await apiClient.put(`reportes/${id}/`, payload);
  return response.data;
}

export async function deleteReporte(id) {
  return apiClient.delete(`reportes/${id}/`);
}
