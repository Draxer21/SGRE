import apiClient from "./apiClient";
import { normalizeListResponse } from "./listUtils";

function buildEventPayload(payload) {
  const hasFile = payload?.imagen_portada instanceof File;
  if (!hasFile) {
    return { data: payload, isForm: false };
  }

  const formData = new FormData();
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    formData.append(key, value);
  });
  return { data: formData, isForm: true };
}

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
  const { data, isForm } = buildEventPayload(payload);
  const config = isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
  const response = await apiClient.post("eventos/", data, config);
  return response.data;
}

export async function updateEvento(id, payload) {
  const { data, isForm } = buildEventPayload(payload);
  const config = isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined;
  const response = await apiClient.put(`eventos/${id}/`, data, config);
  return response.data;
}

export async function deleteEvento(id) {
  return apiClient.delete(`eventos/${id}/`);
}
