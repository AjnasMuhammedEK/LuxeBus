import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { GoogleOAuthProvider} from "@react-oauth/google";
import './index.css'
 
import App from "./App";
import { store } from './redux/store/store';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
     <Provider store = {store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
