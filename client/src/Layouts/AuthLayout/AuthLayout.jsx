import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 h-screen border '>
        <div className='border'>
          <Outlet />
        </div>
        <div className='hidden md:block'>
          {/* alut image  */}
          <img
            src="https://web.justbeepit.com/authImg.png"
            alt="Auth Background"
          />
        </div>
      </div>
    );
};

export default AuthLayout;