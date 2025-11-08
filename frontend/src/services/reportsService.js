import apiClient from "./apiClient";
import { normalizeListResponse } from "./listUtils";

export async function listReportes(params = {}) {
  const response = await apiClient.get("reportes/", { params });
  return normalizeListResponse(response.data);
}

export async function retrieveReporte(id) {
  if (!id) {
    throw new Error("ID de reporte requerido.");
  }
  const response = await apiClient.get(`reportes/${id}/`);
  return response.data;
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
