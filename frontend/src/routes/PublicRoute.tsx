import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";



interface PublicRouteProps {
    role :'user'|'operator'|'admin'
}

const PublicRoute = ({role} : PublicRouteProps) =>{
    const user = useSelector((state : RootState) => state.auth.user)
    const operator = useSelector((state : RootState) => state.operatorAuth.operator)
    const admin = useSelector((state : RootState) => state.adminAuth.admin)

    if(role === 'user' && user) {
        return <Navigate to='/' replace/>
    }

    if(role === 'operator' && operator) {
        return <Navigate to="/operator/home" replace />;
    }

    if(role === 'admin' && admin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet/>
}
export default PublicRoute;