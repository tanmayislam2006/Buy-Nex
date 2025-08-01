import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../../components/Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-20">
        <Outlet />
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
