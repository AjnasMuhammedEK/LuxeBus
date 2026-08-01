import { Outlet } from "react-router-dom";

import OperatorSidebar from "./OperatorSidebar";
import OperatorNavbar from "./OperatorNavbar";

function OperatorLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <OperatorSidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <OperatorNavbar />

        <main className="min-h-screen bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OperatorLayout;