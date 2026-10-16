import { Navigate, Route , Routes } from "react-router-dom";
import StaffLoginSection from '@/features/auth/staff/pages/StaffLogin'
import StaffLayout from "@/components/layouts/staff/StaffLayout";
import StaffHome from "@/features/staff/pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const StaffRoutes = () => {
    return (
        <Routes>

            <Route element={<PublicRoute role="staff"/>}>

            <   Route path="login" element={<StaffLoginSection/>}/>
            </Route>

            <Route element={<ProtectedRoute role="staff"/>}> 
                <Route element={<StaffLayout/>}>
                
                    <Route path="dashboard" element={<StaffHome/>}/>
                
                </Route>
            </Route>
            <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
    )
}

export default StaffRoutes