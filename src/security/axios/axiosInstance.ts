import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

import { EnvVariableName, getEnvVariable } from "@/config/env/getEnvVariable";
import { endSession, getAccessToken } from "@/security/session";

// Endpoints that work without a token. They get none: the BE rejects an expired token with 401
// even where no token is needed, which would make logging in again impossible.
const PUBLIC_URLS = ["/api/auth/login", "/api/auth/sign-up"];

// Every request goes through this instance; the token is attached here and nowhere else.
export const axiosInstance = axios.create({
  baseURL: getEnvVariable(EnvVariableName.HOST_CORE),
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !PUBLIC_URLS.includes(config.url ?? "")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 on a protected call means the token expired or was revoked: drop it and go to login.
axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
  if (error.response?.status === 401 && !PUBLIC_URLS.includes(error.config?.url ?? "")) {
    endSession();
    // Imported lazily: the router imports the pages, which import the API hooks, which import this file
    const { router } = await import("@/routes/-router");
    await router.navigate({ to: "/login" });
  }
  return Promise.reject(error);
});

// Mutator used by the orval-generated hooks (see orval.config.ts).
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance(config).then(({ data }) => data);
