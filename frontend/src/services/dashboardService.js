import apiClient from "./apiClient";

export async function getDashboardOverview() {
  const response = await apiClient.get("dashboard/overview/");
  return response.data;
}
