import React from 'react';
import logo from "../assets/logo.png"; 
import { Link } from 'react-router';

const MainLogo = () => {
    return (
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <span className="text-2xl font-semibold text-primary mt-1">
            BuyNext
          </span>
        </Link>
    );
};

export default MainLogo;