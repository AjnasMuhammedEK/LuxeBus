import { NavLink } from "react-router-dom";
import {Home,Route,CalendarCheck,Bus,CalendarClock,Users,BarChart3,Headset,Radio,UserCircle,} from "lucide-react";
import logo from "../../../../public/logo.png";

interface SidebarLinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const sidebarLinks: SidebarLinkItem[] = [
  { label: "Home", href: "/operator", icon: Home },
  { label: "Route Management", href: "/operator/routes", icon: Route },
  { label: "Bookings", href: "/operator/bookings", icon: CalendarCheck },
  { label: "Fleet Management", href: "/operator/fleet", icon: Bus },
  { label: "Trip & Schedules", href: "/operator/trips", icon: CalendarClock },
  { label: "Staff Management", href: "/operator/staff", icon: Users },
  { label: "Reports", href: "/operator/reports", icon: BarChart3 },
  { label: "Support", href: "/operator/support", icon: Headset },
  { label: "Broadcast Messaging", href: "/operator/broadcast", icon: Radio },
  { label: "Profile", href: "/operator/profile", icon: UserCircle },
];

const OperatorSidebar = () => {
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0b1437] text-gray-300">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <img src={logo} alt="LuxeBus Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Nav Links */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.href}
            end={link.href === "/operator"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border-emerald-500 bg-white/10 text-white"
                  : "border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <link.icon className="h-5 w-5 shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default OperatorSidebar;