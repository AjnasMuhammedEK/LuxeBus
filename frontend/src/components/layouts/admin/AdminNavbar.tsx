import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

const AdminNavbar = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-gray-100 bg-white px-6">
       <div>
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
      </div>

       <div className="flex items-center gap-5">
        <button type="button" className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1437] font-semibold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;