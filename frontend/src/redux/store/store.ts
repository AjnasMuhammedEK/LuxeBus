import { configureStore , combineReducers } from '@reduxjs/toolkit'
import authReducer from '../slice/authSlice'
import operatorAuthReducer from '../slice/operatorAuthSlice'
import adminAuthReducer from "../slice/adminAuthSlice";
import storageModule from "redux-persist/lib/storage";

const storage = (storageModule as any).default ?? storageModule;
import {persistReducer , persistStore} from "redux-persist"

console.log("storage:", storage);
console.log("getItem:", storage.getItem);
console.log("setItem:", storage.setItem);
console.log("removeItem:", storage.removeItem);

const persistConfig = {
  key : 'root',
  storage
}

const rootReducer = combineReducers ({
  auth : authReducer,
  operatorAuth : operatorAuthReducer,
  adminAuth : adminAuthReducer
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