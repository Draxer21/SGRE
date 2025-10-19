import apiClient from "./apiClient";

export async function listEventos(params = {}) {
  const response = await apiClient.get("eventos/", { params });
  const payload = response.data;
  return Array.isArray(payload) ? payload : payload?.results ?? [];
}

export async function createEvento(payload) {
  const response = await apiClient.post("eventos/", payload);
  return response.data;
}

export async function updateEvento(id, payload) {
  const response = await apiClient.put(`eventos/${id}/`, payload);
  return response.data;
}

export async function deleteEvento(id) {
  return apiClient.delete(`eventos/${id}/`);
}
