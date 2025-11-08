import apiClient from "./apiClient";
import { normalizeListResponse } from "./listUtils";

export async function listReservas(params = {}) {
  const response = await apiClient.get("reservas/", { params });
  return normalizeListResponse(response.data);
}

export async function retrieveReserva(id) {
  if (!id) {
    throw new Error("ID de reserva requerido.");
  }
  const response = await apiClient.get(`reservas/${id}/`);
  return response.data;
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
