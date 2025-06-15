// services/authService.ts

import userApi from '../Api/userApi'; // Your Axios instance

export const loginUser = async (formData: FormData): Promise<{ accessToken: string }> => {
  try {
    const response = await userApi.post( `/auth/login?user_type=user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    console.log("Respnse", response)
    const { accessToken } = response.data;

    if (accessToken) {
      return { accessToken };
    } else {
      throw new Error('Login failed: No access token received.');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || 'Login failed: Invalid credentials or server error.';
    throw new Error(message);
  }
};
