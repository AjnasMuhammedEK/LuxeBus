import { Routes, Route } from "react-router-dom";

import PassengerRoutes from "@/routes/PassengerRoutes";
import OperatorRoutes from "@/routes/OperatorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import StaffRoutes from './routes/StaffRoutes'
import { Toaster } from 'react-hot-toast'
function App() {
  return (
    <>
     <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    <Routes> 

      <Route path="/*" element={<PassengerRoutes />} />

 
      <Route path="/operator/*" element={<OperatorRoutes />} />

      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route path="/staff/*" element={<StaffRoutes/>}/>
 

      
    </Routes>
    </>
  );
}

export default App;