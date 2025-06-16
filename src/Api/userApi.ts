import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "../../env";
import AuthStore from "../Store/AuthStore";
import { navigate } from "../Navigation/NavigationService";


interface Token {
    accessToken: string;
    refreshToken: string;
}

const userApi = axios.create({
    baseURL: BASE_URL,
    // baseURL: import.meta.env.VITE_LOCAL_BACKEND_BASE_URL,
    withCredentials: true,
});

// ✅ Add token to headers *and* as cookies manually
userApi.interceptors.request.use((config) => {

    const accessToken = AuthStore.getString("accessToken");
    const refreshToken = AuthStore.getString("refreshToken");
  
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  
    // Manually set both tokens in Cookie header
    if (accessToken && refreshToken) {
      config.headers["Cookie"] = `access_token=${accessToken}; refresh_token=${refreshToken}`;
    }
  
    return config;
  });


userApi.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      const { accessToken, refreshToken } = response.data || {};
  
      if (accessToken && refreshToken) {
        AuthStore.set("accessToken", accessToken);
        AuthStore.set("refreshToken", refreshToken);
      }
      
      return response;
    },
  
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const refreshToken = AuthStore.getString("refreshToken");
          if (!refreshToken) throw new Error("Refresh token not found.");
  
          console.log("Attempting token refresh");
  
          const { data } = await axios.post<Token>(
            `${BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Cookie: `refreshToken=${refreshToken}`,
                Authorization: `Bearer ${refreshToken}`, // If your backend needs it
              },
              withCredentials: true,
            }
          );
  
          console.log("Token refreshed:", data);
  
          AuthStore.set("accessToken", data.accessToken);
          AuthStore.set("refreshToken", data.refreshToken);
  
          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          originalRequest.headers["Cookie"] = `access_token=${data.accessToken}; refresh_token=${data.refreshToken}`;
  
          return userApi(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          AuthStore.delete("accessToken");
          AuthStore.delete("refreshToken");

          // Add logout or navigation logic if needed
          navigate('login-screen');
        }
      }
  
      console.error("API call error:", error);
      return Promise.reject(error);
    }
  );

export default userApi;