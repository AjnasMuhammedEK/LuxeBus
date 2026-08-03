import { Routes, Route } from "react-router-dom";

import PassengerLayout from "@/components/layouts/passenger/PassengerLayout";

import Home from "@/features/passenger/pages/Home";
import PassengerRegister from "@/features/auth/passenger/pages/PassengerRegister";
import PassengerLogin from "@/features/auth/passenger/pages/PassengerLogin"
import ForgotPasswordSection from "@/features/auth/passenger/pages/ForgotPassword";
import ResetPasswordSection from "@/features/auth/passenger/pages/ResetPassword";
import PublicRoute from "./PublicRoute";
const PassengerRoutes = () => {
  return (
    <Routes>

      <Route element={<PublicRoute role="user" />}>
        <Route path="login" element={<PassengerLogin/>}/>
        <Route path="register" element={<PassengerRegister />} />
      </Route>

       <Route path="/" element={<PassengerLayout />}>

        <Route index element={<Home />} />
        
        
        <Route path="forgotPassword" element={<ForgotPasswordSection/>}/>
        <Route path="/resetPassword" element={<ResetPasswordSection/>}/>
      </Route>

    </Routes>
  );
};

export default PassengerRoutes;