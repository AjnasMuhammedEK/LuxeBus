import AdminLayout from "@/components/layouts/admin/AdminLayout";
import SuperAdminLogin from "@/features/auth/admin/pages/AdminLogin";
import { Route , Routes } from "react-router-dom";
import Home from '@/features/admin/pages/Home'
import Operators from '@/features/admin/pages/Operators'
import ProtectedRoute from "@/routes/ProtectedRoute";

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<SuperAdminLogin/>}/>

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
