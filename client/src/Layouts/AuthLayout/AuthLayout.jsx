import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='min-h-screen px-4 bg-gradient-to-r from-green-50 to-purple-50 '>
        <div className=''>
          <Outlet />
        </div>
      </div>
    );
};

export default AuthLayout;