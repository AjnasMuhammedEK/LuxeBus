import { configureStore , combineReducers } from '@reduxjs/toolkit'
import authReducer from '../slice/authSlice'
import operatorAuthReducer from '../slice/operatorAuthSlice'
import adminAuthReducer from "../slice/adminAuthSlice";
import staffAuthReducer from "../slice/staffAuthSlice";
import storageModule from "redux-persist/lib/storage";
import {persistReducer , persistStore} from "redux-persist"


const storage =
  "getItem" in storageModule
    ? storageModule
    : storageModule.default;

const persistConfig = {
  key : 'root',
  storage
}

const rootReducer = combineReducers ({
  auth : authReducer,
  operatorAuth : operatorAuthReducer,
  adminAuth : adminAuthReducer,
  staffAuth : staffAuthReducer
})

const persistedReducer = persistReducer (persistConfig , rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  
  middleware : (getDefaultMiddleware) =>  
    getDefaultMiddleware({
      serializableCheck:false
    })
  
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;