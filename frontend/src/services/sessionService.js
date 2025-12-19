import apiClient from "./apiClient";

export async function getSessionStatus() {
  const response = await apiClient.get("session/status/");
  return response.data;
}

export async function logoutSession() {
  const response = await apiClient.post("session/logout/");
  return response.data;
}

export async function loginSession(payload) {
  const response = await apiClient.post("session/login/", payload);
  return response.data;
}

export async function registerSession(payload) {
  const response = await apiClient.post("session/register/", payload);
  return response.data;
}
