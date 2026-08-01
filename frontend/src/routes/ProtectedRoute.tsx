import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

interface ProtectedRouteProps {
  role: "user" | "operator" | "admin";
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const operator = useSelector((state: RootState) => state.operatorAuth.operator);
  const admin = useSelector((state: RootState) => state.adminAuth.admin);

  if (role === "user") {
    return user ? <Outlet /> : <Navigate to="/login" replace />;
  }

  if (role === "operator") {
    return operator ? <Outlet /> : <Navigate to="/operator/login" replace />;
  }

  if (role === "admin") {
    return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
  }

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;