import AdminLayout from "@/components/layouts/admin/AdminLayout";
import SuperAdminLogin from "@/features/auth/admin/pages/AdminLogin";
import { Route , Routes } from "react-router-dom";
import Home from '@/features/admin/pages/Home'
import Operators from '@/features/admin/pages/Operators'
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute role="admin" />}>
        <Route path="/login" element={<SuperAdminLogin/>}/>
      </Route>
        

        <Route element={<ProtectedRoute role="admin" />}>
        
        <Route  element={<AdminLayout/>}>
            <Route path="/dashboard" element={<Home/>}/>
            <Route path="/operators" element={<Operators/>}/>
        </Route>
        </Route>
    
    </Routes>
  )
}

export default AdminRoutes
