import apiClient from "./apiClient";
import { normalizeListResponse } from "./listUtils";

export async function listEventos(params = {}) {
  const response = await apiClient.get("eventos/", { params });
  return normalizeListResponse(response.data);
}

export async function retrieveEvento(id) {
  if (!id) {
    throw new Error("ID de evento requerido.");
  }
  const response = await apiClient.get(`eventos/${id}/`);
  return response.data;
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
