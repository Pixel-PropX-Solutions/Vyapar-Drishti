import { createSlice, Slice } from '@reduxjs/toolkit';
import { loginUser, register, getCurrentUser, updateUserSettings } from '../../Services/user';

interface UserState {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: any | null;
}

const initialState: UserState = {
    loading: false,
    error: null,
    isAuthenticated: false,
    user: null, // Assuming you want to store user data after login or registration
};

const userSlice: Slice<UserState> = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = true; // Assuming successful login sets this to true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
                state.isAuthenticated = false; // Reset authentication on failure
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload.accessToken ? true : false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Registration failed';
                state.isAuthenticated = false;
            })

            .addCase(getCurrentUser.pending, (state, action) => {
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
