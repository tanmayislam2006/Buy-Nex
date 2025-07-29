import React from "react";
import { Outlet, useLocation } from "react-router";
import ShoppingImage from "../../assets/shopping-image.png";
import ShoppingImage2 from "../../assets/shopping-image-2.png";
const AuthLayout = () => {
  const location = useLocation();
  const image =
    location.pathname === "/auth/login" ? ShoppingImage : ShoppingImage2;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-[#fda085] to-[#f85606]/80">
      {/* Main container for the layout - responsive two-column */}
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Section - Image Background & Blobs */}
        <div className="relative lg:w-1/2 min-h-[200px] lg:min-h-[500px] flex items-center justify-center p-4">
          {/* Background image for the left panel */}
          <img src={image} alt="" className="rounded-xl" />
        </div>

        {/* Right Section - Content (where Login/Register forms will be rendered) */}
        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
