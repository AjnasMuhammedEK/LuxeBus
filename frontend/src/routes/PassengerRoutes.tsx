
import { Routes, Route } from "react-router-dom";

import PassengerLayout from "@/components/layouts/passenger/PassengerLayout";

import Home from "@/features/passenger/pages/Home";
import Profile from "@/features/passenger/pages/Profile";

import PassengerRegister from "@/features/auth/passenger/pages/PassengerRegister";
import PassengerLogin from "@/features/auth/passenger/pages/PassengerLogin";
import ForgotPasswordSection from "@/features/auth/passenger/pages/ForgotPassword";
import ResetPasswordSection from "@/features/auth/passenger/pages/ResetPassword";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import PassengerTrips from "@/features/passenger/pages/PassengerTrips";

const PassengerRoutes = () => {
  return (
    <Routes>
      
      <Route element={<PublicRoute role="user" />}>
        <Route path="login" element={<PassengerLogin />} />
        <Route path="register" element={<PassengerRegister />} />
        <Route path="forgotPassword" element={<ForgotPasswordSection />} />
        <Route path="resetPassword" element={<ResetPasswordSection />} />
      </Route>
 
      <Route path="/" element={<PassengerLayout />}>
       
        <Route index element={<Home />} />
        <Route path="trips" element={<PassengerTrips />} />

     
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default PassengerRoutes;
