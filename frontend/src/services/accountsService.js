import apiClient from "./apiClient";
import { normalizeListResponse } from "./listUtils";

export async function listCuentas(params = {}) {
  const response = await apiClient.get("cuentas/", { params });
  return normalizeListResponse(response.data);
}

export async function retrieveCuenta(id) {
  if (!id) {
    throw new Error("ID de cuenta requerido.");
  }
  const response = await apiClient.get(`cuentas/${id}/`);
  return response.data;
}

export async function createCuenta(payload) {
  const response = await apiClient.post("cuentas/", payload);
  return response.data;
}

export async function updateCuenta(id, payload) {
  const response = await apiClient.put(`cuentas/${id}/`, payload);
  return response.data;
}

export async function deleteCuenta(id) {
  return apiClient.delete(`cuentas/${id}/`);
}

export async function getCuentaMe() {
  const response = await apiClient.get("cuentas/me/");
  return response.data;
}

export async function updateCuentaMe(payload) {
  const response = await apiClient.put("cuentas/me/", payload);
  return response.data;
}

export async function requestCuentaDeletion(motivo = "") {
  const response = await apiClient.post("cuentas/solicitar-eliminacion/", { motivo });
  return response.data;
}
