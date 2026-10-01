import { Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
 
import { logoutOperator } from "@/redux/slice/operatorAuthSlice";

import { operatorLogout } from "@/features/auth/services/authService";
import type { RootState } from "@/redux/store/store";

const OperatorNavbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await operatorLogout()
      dispatch(logoutOperator())
      navigate("/operator/login");

    } catch (error) {
      console.log("Operator Logout failed:", error);
    }
  };

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-gray-100 bg-white px-6">
       <div>
        <h1 className="text-lg font-semibold text-gray-800">Operator Panel</h1>
      </div>

       <div className="flex items-center gap-5">
        <button type="button" className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
        </button>

        {user && (
          <span className="font-semibold text-gray-800">Hi, {user.name}</span>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-emerald-700 px-6 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default OperatorNavbar;