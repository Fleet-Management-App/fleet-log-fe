import axios, { type AxiosRequestConfig } from "axios";

import { EnvVariableName, getEnvVariable } from "@/config/env/getEnvVariable";

// Every request goes through this instance. Authentication is not decided yet; once it is, the
// token is attached here in a request interceptor and nowhere else.
export const axiosInstance = axios.create({
  baseURL: getEnvVariable(EnvVariableName.HOST_CORE),
});

// Mutator used by the orval-generated hooks (see orval.config.ts).
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance(config).then(({ data }) => data);
