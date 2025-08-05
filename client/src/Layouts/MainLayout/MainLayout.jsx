import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../../components/Footer";
import AIAssistant from "../../components/AIAssistant/AIAssistant";

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
      <AIAssistant/>
    </div>
  );
};

export default MainLayout;
