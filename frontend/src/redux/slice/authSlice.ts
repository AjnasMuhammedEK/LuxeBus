import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {IUser} from '../../types/user.types'

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

interface LoginPayload {
  user: IUser;
  accessToken: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers : {
    login :(
      state , action :PayloadAction<LoginPayload>
    ) => {
      state.user = action.payload.user

      state.accessToken = action.payload.accessToken

      state.isAuthenticated = true
    },

    setAccessToken :(
      state , action:PayloadAction<string>
    ) => {
      state.accessToken = action.payload
    },

    logout : (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
    }
  }
  

  
});

export const { login , setAccessToken , logout } = authSlice.actions;

export default authSlice.reducer;