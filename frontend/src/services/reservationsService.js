import apiClient from "./apiClient";

export async function listReservas(params = {}) {
  const response = await apiClient.get("reservas/", { params });
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload?.results ?? [];
}

export async function createReserva(payload) {
  const response = await apiClient.post("reservas/", payload);
  return response.data;
}

export async function updateReserva(id, payload) {
  const response = await apiClient.put(`reservas/${id}/`, payload);
  return response.data;
}

export async function deleteReserva(id) {
  return apiClient.delete(`reservas/${id}/`);
}
