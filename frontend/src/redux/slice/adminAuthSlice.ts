import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
 

interface AdminState {
  admin: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}


interface AdminLoginPayload {
  admin: any;
  accessToken: string;
}



const initialState: AdminState = {
  admin: null,
  accessToken: null,
  isAuthenticated: false,
};

const adminAuthSlice = createSlice({
  name:'adminAuth',
  initialState,

  reducers : {
    loginAdmin : (
      state , action : PayloadAction<AdminLoginPayload>
    ) => {
      state.admin = action.payload.admin
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
    },

    setAdminAccessToken : (state , action : PayloadAction <string>) => {
      state.accessToken = action.payload
    },

    logoutAdmin : (state) => {
      state.admin = null
      state.accessToken = null
      state.isAuthenticated = false
    }
  }
});

export const {loginAdmin,setAdminAccessToken,logoutAdmin} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;