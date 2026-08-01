import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slice/authSlice'
import operatorAuthReducer from '../slice/operatorAuthSlice'
import adminAuthReducer from "../slice/adminAuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    operatorAuth:operatorAuthReducer,
    adminAuth: adminAuthReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch