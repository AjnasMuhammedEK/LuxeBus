import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { LayoutDashboard, Route as RouteIcon, LogOut } from 'lucide-react'
import { LogoutStaff } from '@/redux/slice/staffAuthSlice'
import { staffLogout } from '@/features/auth/services/authService'

// TODO: create this action in your staff auth slice
// import { logoutStaff } from '@/redux/slice/staffAuthSlice'

const navItems = [
  { label: 'Dashboard', to: '/staff/dashboard', icon: LayoutDashboard },
  { label: 'Passengers', to: '/staff/passengers', icon: RouteIcon },
]

function StaffSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await staffLogout()
      dispatch(LogoutStaff())
      toast.success('Logged out successfully') 
      navigate('/staff/login')
    } catch (error) {
      toast.error('Staff Logout failed')
      console.log("Staff Logout failed:", error);
    }

  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col justify-between border-r border-slate-200 bg-slate-50 px-3 py-6">
      <div>
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center px-2">
          <img src="/logo.png" alt="LuxeBus Logo" className="h-14 w-auto object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Logout
      </button>
    </aside>
  )
}

export default StaffSidebar