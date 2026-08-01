import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../../../public/logo.png";
import { clearUser } from "@/redux/slice/authSlice";

interface NavLinkItem {
  label: string;
  href: string;
}

const navLinks: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PassengerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('token');
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center px-6 md:flex md:justify-between">
         <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="justify-self-start md:hidden"
        >
          <Menu className="h-7 w-7" />
        </button>

         <Link
          to="/"
          className="flex items-center justify-self-center md:justify-self-auto"
        >
          <img
            src={logo}
            alt="LuxeBus Logo"
            className="h-20 w-40 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-[15px] font-medium text-gray-700 transition hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Buttons */}
        <div className="hidden items-center gap-5 md:flex">
          <button type="button">
            <Bell className="h-6 w-6" />
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-800">Hi, {user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-emerald-700 px-6 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-emerald-700 px-6 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-emerald-700 px-6 py-2 font-semibold text-white hover:bg-emerald-800"
              >
                Join Luxe
              </Link>
            </>
          )}
        </div>

        {/* Mobile Bell */}
        <button className="justify-self-end md:hidden">
          <Bell className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-5">
          <img src={logo} className="h-16" />

          <button onClick={() => setIsMenuOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-4 py-3 hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-5 space-y-3">
          {user ? (
            <>
              <p className="px-2 font-semibold text-gray-800">Hi, {user.name}</p>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full rounded-full border border-emerald-700 px-6 py-2 text-center font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full rounded-full border border-emerald-700 px-6 py-2 text-center font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full rounded-full bg-emerald-700 px-6 py-2 text-center font-semibold text-white hover:bg-emerald-800"
              >
                Join Luxe
              </Link>
            </>
          )}
        </div>
      </aside>
    </header>
  );
};

export default PassengerNavbar;