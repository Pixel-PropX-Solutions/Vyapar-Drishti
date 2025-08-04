import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../Api/userApi'; // Your Axios instance
import { UserSignUp } from '../Utils/types';
import AuthStore from '../Store/AuthStore';
import { jwtDecode } from 'jwt-decode';


/**
 * This file contains the user-related async actions using createAsyncThunk.
 * It includes actions for getting the current user, logging in, registering,
 * updating user settings, forgetting and resetting passwords, logging out,
 * and deleting the user account.
 */
export const getCurrentUser = createAsyncThunk(
  'get/current/user',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.get('/auth/current/user',);
      console.log('Current user response', response.data);

      if (response.data.success === true) {
        const user = response.data.data[0];
        return { user };
      } else { return rejectWithValue('Login Failed: No access token recieved.'); }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Login failed: Invalid credentials or server error.'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    formData: FormData,
    { rejectWithValue }
  ): Promise<{ accessToken: string } | any> => {
    try {
      const response = await userApi.post('/auth/login?user_type=user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Login response', response);


      if (response.data.ok === true) {
        const { accessToken } = response.data;
        const decoded: any = jwtDecode(accessToken);
        const current_company_id = decoded.current_company_id;
        AuthStore.set('accessToken', accessToken);
        AuthStore.set('current_company_id', current_company_id);
        return { accessToken, current_company_id };
      } else {
        return rejectWithValue('Login failed: No access token received.');
      }
    } catch (error: any) {
      const message = error.response?.data?.message;
      return rejectWithValue(message);
    }
  }
);


export const register = createAsyncThunk(
  'user/register',
  async (
    userData: UserSignUp,
    { rejectWithValue }
  ): Promise<{ ok: boolean } | any> => {
    try {
      const response = await userApi.post('/auth/register', userData);
      console.log('register response', response.data);

      if (response.data.ok === true) {  
        return;
      } else {
        return rejectWithValue(
          'Registration failed: No access token received.'
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed: Server error.'
      );
    }
  }
);

export const switchCompany = createAsyncThunk(
  'switch/company',
  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {

      const response = await userApi.post(`/user/settings/switch-company/${id}`);
      console.log('Switch company response:', response);

      if (response.data.success === true) {
        const accessToken = response.data.accessToken;
        // 👇 Decode the token to get updated company ID
        const decoded: any = jwtDecode(accessToken);
        const current_company_id = decoded.current_company_id;
        AuthStore.set('accessToken', accessToken);
        AuthStore.set('current_company_id', current_company_id);
        return { accessToken, current_company_id };
      } else {
        return rejectWithValue('Login failed: Unknown error.');
      }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);



export const deleteCompany = createAsyncThunk(
  'delete/company',
  async (
    id: string,
    { rejectWithValue }
  ): Promise<{ accessToken: string, current_company_id: string, company_id: string } | any> => {
    try {
      const response = await userApi.delete(`/auth/delete/user/company/${id}`);
      console.log('Delete Company Response:', response);

      if (response.data.success === true) {
        const accessToken = response.data.accessToken;
        console.log('Access Token after deletion:', accessToken);
        // 👇 Decode the token to get updated company ID
        const company_id = response.data.company_id;
        console.log('Company ID after deletion:', company_id);
        const decoded: any = jwtDecode(accessToken);
        console.log('Decoded Token:', decoded);
        const current_company_id = decoded.current_company_id;
        console.log('Current Company ID after deletion:', current_company_id);

        AuthStore.set('accessToken', accessToken);
        AuthStore.set('current_company_id', current_company_id);

        console.log('Company deleted successfully adsdasdas:', response.data);

        return { accessToken, current_company_id, company_id };
      } else { return rejectWithValue('Login Failed: No access token recieved.'); }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const updateUserSettings = createAsyncThunk(
  'update/user/settings',
  async (
    { id, data }: { id: string; data: Record<string, unknown> },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put(`/user/settings/update/${id}`, data);
      console.log('updateUserSettings response', response);

      if (response.data.success === true) {
        const data = response.data.data;
        return data;
      } else { return rejectWithValue('Login Failed: No access token recieved.'); }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Login failed: Invalid credentials or server error.'
      );
    }
  }
);

export const forgetPassword = createAsyncThunk(
  'user/forgetPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.put('/auth/forgetPassword', {
        email,
      });

      if (response.data.sucess === true) {
        console.log('reset link share on registered mailID');
        return 1;
      } else {
        return rejectWithValue(
          'Registration failed: No access token received.'
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed: Server error.'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (
    {
      password,
      confirmPassword,
      token,
    }: { password: string; confirmPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.put('/auth/resetPassword', {
        password,
        confirmPassword,
        token,
      });

      console.log('reset Password res', response);
      if (response.data.sucess === true) {
        console.log('reset link share on registered mailID');
        return 1;
      } else {
        return rejectWithValue('Password not updated.');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Password updation failed: Server error.'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.post('/auth/logout');
      console.log('Response logout', response);

      if (response.status === 200) {
        AuthStore.delete('accessToken');
        AuthStore.delete('refreshToken');
        AuthStore.clearAll();
        return response.data;
      } else {
        return rejectWithValue('Login Failed: No access token recieved.');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Login failed: Invalid credentials or server error.'
      );
    }
  }
);


export const deleteAccount = createAsyncThunk(
  'delete/account',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.delete('auth/delete/user');

      if (response.data.success === true) {
        localStorage.clear();
        return { success: true };
      } else { return rejectWithValue('Login Failed: No access token recieved.'); }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


