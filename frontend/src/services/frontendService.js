import apiClient from "./apiClient";

export async function getFrontendManifest() {
  const response = await apiClient.get("frontend/manifest/");
  return response.data;
}
