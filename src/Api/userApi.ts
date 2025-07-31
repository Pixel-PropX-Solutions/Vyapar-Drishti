import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from '../../env';
import AuthStore from '../Store/AuthStore';
import navigator from '../Navigation/NavigationService';
import { jwtDecode } from 'jwt-decode';


interface Token {
  accessToken: string;
  refreshToken: string;
}

const userApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

userApi.interceptors.request.use((config) => {

  const accessToken = AuthStore.getString('accessToken');
  const refreshToken = AuthStore.getString('refreshToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Manually set both tokens in Cookie header
  if (accessToken && refreshToken) {
    config.headers.Cookie = `access_token=${accessToken}; refresh_token=${refreshToken}`;
  }

  return config;
});


userApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const { accessToken, refreshToken } = response.data || {};

    if (accessToken && refreshToken) {
      const decoded: any = jwtDecode(accessToken);
      const current_company_id = decoded.current_company_id;
      AuthStore.set('accessToken', accessToken);
      AuthStore.set('refreshToken', refreshToken);
      AuthStore.set('current_company_id', current_company_id);
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (originalRequest.url === '/auth/logout') {
      AuthStore.delete('accessToken');
      AuthStore.delete('refreshToken');
      AuthStore.delete('current_company_id');
      AuthStore.clearAll();
      console.log('User logged out successfully');
      navigator.reset('landing-screen');
      return;
    }

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/logout') {
      originalRequest._retry = true;

      try {
        const refreshToken = AuthStore.getString('refreshToken');
        if (!refreshToken) { throw new Error('Refresh token not found.'); }

        console.log('Attempting token refresh');

        const { data } = await axios.post<Token>(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Cookie: `refresh_token=${refreshToken}`,
              Authorization: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          }
        );

        console.log('Token refreshed:', data);

        AuthStore.set('accessToken', data.accessToken);
        AuthStore.set('refreshToken', data.refreshToken);
        const decoded: any = jwtDecode(data.accessToken);
        const current_company_id = decoded.current_company_id;
        AuthStore.set('current_company_id', current_company_id);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers.Cookie = `access_token=${data.accessToken}; refresh_token=${data.refreshToken}`;

        return userApi(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        AuthStore.delete('accessToken');
        AuthStore.delete('refreshToken');
        AuthStore.delete('current_company_id');

        navigator.reset('landing-screen');
      }
    }

    // Log detailed error information
    if (axios.isAxiosError(error)) {
      console.error('Message:', error.message);

      if (error.response) {
        console.error('Response:', error.response);
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request was:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      console.error('Config:', error.config);
    } else {
      console.error('Non-Axios error:', error);
    }



    return Promise.reject(error);
  }
);

export default userApi;
