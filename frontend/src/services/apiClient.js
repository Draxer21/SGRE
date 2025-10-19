import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("Sesión expirada. Inicia sesión nuevamente.");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
