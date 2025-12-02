import axios, { AxiosError, AxiosResponse } from "axios";
const apiURL: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
if (!apiURL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is not set.");
}
const instance = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default instance;