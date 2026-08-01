import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  admin: any | null;
  token: string | null;
}

const initialState: AdminState = {
  admin: JSON.parse(localStorage.getItem("admin") || "null"),
  token: localStorage.getItem("adminToken"),
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdmin: (
      state,
      action: PayloadAction<{
        admin: any;
        token: string;
      }>
    ) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;

      localStorage.setItem(
        "admin",
        JSON.stringify(action.payload.admin)
      )
      localStorage.setItem(
        "adminToken",
        action.payload.token
      )

    },

    clearAdmin: (state) => {
      state.admin = null;
      state.token = null;


      localStorage.removeItem("admin")
      localStorage.removeItem("adminToken")
    },
  },
});

export const {setAdmin,clearAdmin,} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;