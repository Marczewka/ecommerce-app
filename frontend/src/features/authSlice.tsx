import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthRes, UserRes } from "@shared/dtos";

export type AuthState = {
  user: UserRes | null;
  token: AuthRes["token"] | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<Omit<AuthRes, "message">>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
