import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";



interface PublicRouteProps {
    role :'user'|'operator'|'admin' | 'staff'
}

const PublicRoute = ({role} : PublicRouteProps) =>{
    const user = useSelector((state : RootState) => state.auth.user)
    const operator = useSelector((state : RootState) => state.operatorAuth.operator)
    const admin = useSelector((state : RootState) => state.adminAuth.admin)
    const staff = useSelector((state : RootState) => state.staffAuth.staff)

    if(role === 'user' && user) {
        return <Navigate to='/' replace/>
    }

    if (role === "operator" && operator) {
        if (operator.status === "approved") {
            return <Navigate to="/operator/home" replace />;
        }

        if (operator.status === "pending" || operator.status === "rejected") {
            return <Navigate to="/operator/status" replace />;
        }
    }

    if(role === 'admin' && admin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if(role === 'staff' && staff) {
        return <Navigate to='/staff/dashboard' replace />
    }

    return <Outlet/>
}
export default PublicRoute;