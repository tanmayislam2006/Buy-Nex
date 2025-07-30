import React from 'react';
import logo from '../assets/logo.png';


const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <span className="relative flex h-16 w-16">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-16 w-16 bg-primary"></span>
                <svg className="absolute top-0 left-0 h-16 w-16 animate-spin text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <img className='absolute z-50 top-6 left-6 w-4 h-4' src={logo} alt="BuyNex" />
            </span>
        </div>
    );
};

export default Loading;