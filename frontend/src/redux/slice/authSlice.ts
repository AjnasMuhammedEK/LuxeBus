import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("userToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: any;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      )
      localStorage.setItem(
        "userToken",
        action.payload.token
      );
    },

    clearUser: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user")
      localStorage.removeItem("userToken")
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;