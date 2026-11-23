
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

interface PublicRouteProps {
  role: "user" | "operator" | "admin" | "staff";
}

const PublicRoute = ({ role }: PublicRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isUserAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const operator = useSelector(
    (state: RootState) => state.operatorAuth.operator
  );

  const admin = useSelector(
    (state: RootState) => state.adminAuth.admin
  );

  const staff = useSelector(
    (state: RootState) => state.staffAuth.staff
  );

  // Passenger
  if (role === "user" && user && isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Operator
  if (role === "operator" && operator) {
    if (operator.status === "approved") {
      return <Navigate to="/operator/home" replace />;
    }

    return <Navigate to="/operator/status" replace />;
  }

  // Admin
  if (role === "admin" && admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Staff
  if (role === "staff" && staff) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
