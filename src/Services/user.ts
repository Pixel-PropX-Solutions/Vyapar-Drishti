// services/authService.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../Api/userApi'; // Your Axios instance
import { UserSignUp } from '../Utils/types';



export const getCurrentUser = createAsyncThunk(
  "get/current/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get('/auth/current/user',);
      console.log("Current user response", response.data);
      const user = response.data.data[0];

      if (user) {
        return { user };
      } else return rejectWithValue("Login Failed: No access token recieved.");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser", 
  async (
    formData: FormData, 
    {rejectWithValue}
  ): Promise<{accessToken: string} | any> => {
  try {
    const response = await userApi.post( `/auth/login?user_type=user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    });
    const { accessToken } = response.data;

    if (accessToken) {
      return { accessToken };
    } else {
      return rejectWithValue('Login failed: No access token received.');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || 'Login failed: Invalid credentials or server error.';
    return rejectWithValue(message);
  }
});


export const register = createAsyncThunk(
  "user/register",
  async (
    userData: UserSignUp,
    { rejectWithValue }
  ): Promise<{accessToken: string} | any> => {
    try {
      const response = await userApi.post(`/auth/register`, userData);
      console.log("register response", response.data);

      const accessToken = response.data.accessToken;

      if (accessToken) {
        return { accessToken };
      }
      else {
        return rejectWithValue(
          "Registration failed: No access token received."
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed: Server error."
      );
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.put("/auth/forgetPassword", {
        email,
      });

      if (response.data.sucess === true) {
        console.log("reset link share on registered mailID");
        return 1;
      } else {
        return rejectWithValue(
          "Registration failed: No access token received."
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed: Server error."
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    {
      password,
      confirmPassword,
      token,
    }: { password: string; confirmPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put("/auth/resetPassword", {
        password,
        confirmPassword,
        token,
      });

      console.log("reset Password res", response);
      if (response.data.sucess === true) {
        console.log("reset link share on registered mailID");
        return 1;
      } else {
        return rejectWithValue("Password not updated.");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Password updation failed: Server error."
      );
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.post("/auth/logout");
      console.log("Response logout", response);

      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        // localStorage.clear();
        return response.data;
      } else {
        return rejectWithValue("Login Failed: No access token recieved.");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed: Invalid credentials or server error."
      );
    }
  }
);
