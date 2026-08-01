import { Routes, Route } from "react-router-dom";

import PassengerLayout from "@/components/layouts/passenger/PassengerLayout";

import Home from "@/features/passenger/pages/Home";
import PassengerRegister from "@/features/auth/passenger/pages/PassengerRegister";
import PassengerLogin from "@/features/auth/passenger/pages/PassengerLogin"
import ForgotPasswordSection from "@/features/auth/passenger/pages/ForgotPassword";
import ResetPasswordSection from "@/features/auth/passenger/pages/ResetPassword";

const PassengerRoutes = () => {
  return (
    <Routes>

       <Route path="/" element={<PassengerLayout />}>

        <Route index element={<Home />} />
        <Route path="register" element={<PassengerRegister />} />
        <Route path="login" element={<PassengerLogin/>}/>
        <Route path="forgotPassword" element={<ForgotPasswordSection/>}/>
        <Route path="/resetPassword" element={<ResetPasswordSection/>}/>
      </Route>

    </Routes>
  );
};

export default PassengerRoutes;