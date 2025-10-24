import apiClient from "./apiClient";

export async function getSessionStatus() {
  const response = await apiClient.get("session/status/");
  return response.data;
}

export async function logoutSession() {
  const response = await apiClient.post("session/logout/");
  return response.data;
}
