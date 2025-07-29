import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#fda085] to-[#f85606]/80 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
