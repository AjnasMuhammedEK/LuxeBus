import { Routes, Route } from "react-router-dom";

import PassengerRoutes from "@/routes/PassengerRoutes";
import OperatorRoutes from "@/routes/OperatorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Toaster } from 'react-hot-toast'
function App() {
  return (
    <>
     <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    <Routes> 

      <Route path="/*" element={<PassengerRoutes />} />

 
      <Route path="/operator/*" element={<OperatorRoutes />} />

      <Route path="/admin/*" element={<AdminRoutes />} />
 

      
    </Routes>
    </>
  );
}

export default App;