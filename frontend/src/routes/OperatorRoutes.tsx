import { Routes , Route, Navigate } from "react-router-dom";
import OperatorLayout from "@/components/layouts/operator/OperatorLayout";

import OperatorRegisterSection from "@/features/auth/operator/pages/OperatorRegister";
import OperatorLoginSection from "@/features/auth/operator/pages/OperatorLogin";
import OperatorStatusSection from '@/features/operator/pages/OperatorStatusSection '
import Home from '@/features/operator/pages/Home'
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "./PublicRoute";

const OperatorRoutes = () => {
    return (
        <Routes>

            <Route index element={<Navigate to="login" replace />} />
            <Route element={<PublicRoute role="operator" />}>
                <Route path="/register" element={<OperatorRegisterSection/>}/>
                <Route path="/login" element={<OperatorLoginSection/>}/>            
            </Route>

            <Route path="/register" element={<OperatorRegisterSection/>}/>
            <Route path="/login" element={<OperatorLoginSection/>}/>
            <Route path="status" element={<OperatorStatusSection />} />
            <Route element={<ProtectedRoute role="operator" />}>
            <Route  element={<OperatorLayout />}>
                <Route path="/home" element={<Home/>}/>
            </Route>
            </Route>
        </Routes>
    )
}

export default OperatorRoutes