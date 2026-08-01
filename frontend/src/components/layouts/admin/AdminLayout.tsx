import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <AdminNavbar />

        <main className="min-h-screen bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;