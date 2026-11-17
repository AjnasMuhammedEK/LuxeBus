import axios from "axios";
import env from "@/config/env";
import { store } from "@/redux/store/store";

import { setStaffAccessToken, LogoutStaff } from "@/redux/slice/staffAuthSlice";

import { publicApi } from "./publicAoi";
import { AUTH_BASE_ROUTE } from "@/constants/apiRoutes";

export const staffApi = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
});

staffApi.interceptors.request.use((config) => {
  const state = store.getState();

  const token = state.staffAuth.accessToken;

  if (!token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

staffApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await publicApi.post(
          `/${AUTH_BASE_ROUTE}/staff-refresh-token`,
        );

        const accessToken = response.data.data.accessToken;

        if (accessToken) {
          store.dispatch(setStaffAccessToken(accessToken));
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return staffApi(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        store.dispatch(LogoutStaff());
        return Promise.reject(refreshError);
      }
    }

    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Something Went Wrong";

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);
