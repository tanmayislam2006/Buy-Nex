import React from 'react';
import { Link } from 'react-router';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFail = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center px-4">
      <FaTimesCircle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! Something went wrong with your payment. Please try again later.
      </p>
      <Link
        to="/cart"
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition"
      >
        Return to Cart
      </Link>
    </div>
  );
};

export default PaymentFail;
