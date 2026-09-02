import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Bus,
  Ticket,
  Users,
  FileBarChart2,
  Landmark,
  UserCircle,
  LogOut,
} from "lucide-react";
import logo from "../../../../public/logo.png";
import { logoutAdmin } from "@/redux/slice/adminAuthSlice";
import { adminLogout } from "@/features/auth/services/authService";

interface SidebarLinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainLinks: SidebarLinkItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Travel Operators", href: "/admin/operators", icon: Bus },
  // { label: "Bookings", href: "/admin/bookings", icon: Ticket },
  // { label: "Users", href: "/admin/users", icon: Users },
  // { label: "Reports", href: "/admin/reports", icon: FileBarChart2 },
  // { label: "Financials", href: "/admin/financials", icon: Landmark },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminLogout()
      dispatch(logoutAdmin())
    } catch (error) {
      console.log("Admin Logout failed:", error);
    }
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-amber-400 text-[#0b1437]"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-[#0b1437]">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
          <img src={logo} alt="LuxeBus Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {mainLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              end={link.href === "/admin"}
              className={linkClasses}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Nav */}
      <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-4">
        <NavLink to="/admin/profile" className={linkClasses}>
          <UserCircle className="h-5 w-5 shrink-0" />
          <span>Profile</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;