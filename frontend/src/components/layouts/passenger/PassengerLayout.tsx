import { Outlet } from "react-router-dom";

import PassengerNavbar from "./PassengerNavbar";
import PassengerFooter from "./PassengerFooter";

function PassengerLayout() {
  return (
    <>
      <PassengerNavbar />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <PassengerFooter />
    </>
  );
}

export default PassengerLayout;