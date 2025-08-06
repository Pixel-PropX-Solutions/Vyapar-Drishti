import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { loginUser, register, getCurrentUser, updateUserSettings, switchCompany, deleteCompany, getAppVersion } from '../../Services/user';
import AuthStore from '../AuthStore';

interface UserState {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: any | null;
    current_company_id: string | null; // Optional, if you want to track the current company ID
    latest_version: string; // Optional, if you want to track the latest version
    minimum_version: string; // Optional, if you want to track the minimum version
}

const initialState: UserState = {
    loading: false,
    error: null,
    isAuthenticated: false,
    user: null, // Assuming you want to store user data after login or registration
    current_company_id: AuthStore.getString('current_company_id') ?? null,
    latest_version: '', // Optional, if you want to track the latest version
    minimum_version: '', // Optional, if you want to track the minimum version
};

const userSlice: Slice<UserState> = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentCompanyId: (state, action: PayloadAction<string>) => {
            state.current_company_id = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.current_company_id = action.payload.current_company_id; // Update current company ID
                state.isAuthenticated = true; // Assuming successful login sets this to true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
                state.isAuthenticated = false; // Reset authentication on failure
            })

            .addCase(deleteCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCompany.fulfilled, (state, action: PayloadAction<{ accessToken: string; current_company_id: string; company_id: string; }>) => {
                state.loading = false;
                state.current_company_id = action.payload.current_company_id; // Update current company ID
            })
            .addCase(deleteCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })

            .addCase(switchCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(switchCompany.fulfilled, (state, action: PayloadAction<{ accessToken: string; current_company_id: string; }>) => {
                state.loading = false;
                state.current_company_id = action.payload.current_company_id; // Update current company ID
            })
            .addCase(switchCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Registration failed';
            })

            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload.user ? true : false;
                state.user = action.payload.user;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch current user';
                state.isAuthenticated = false;
            })

            .addCase(getAppVersion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAppVersion.fulfilled, (state, action) => {
                state.loading = false;
                state.latest_version = action.payload.latest_version;
                state.minimum_version = action.payload.minimum_version;
            })
            .addCase(getAppVersion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch app version';
            })

            .addCase(updateUserSettings.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateUserSettings.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUserSettings.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            ;
    },
});


const userReducer = userSlice.reducer;
export default userReducer;
export const { setCurrentCompanyId } = userSlice.actions;
