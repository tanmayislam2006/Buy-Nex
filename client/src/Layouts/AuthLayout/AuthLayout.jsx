import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/Navbar';

const AuthLayout = () => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 h-screen'>
            <div className='col-span-2'>
                <Navbar/>
            </div>
        <div>
          <Outlet />
        </div>
        <div>
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