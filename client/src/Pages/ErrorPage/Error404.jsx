import React from "react";
import { Link } from "react-router";
import { FiHome } from "react-icons/fi";

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="text-[120px] font-extrabold text-orange-400 drop-shadow-lg select-none leading-none">
        404
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Page Not Found
      </h1>
      <p className="text-lg text-gray-500 mb-6 text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold shadow transition"
      >
        <FiHome className="text-xl" />
        Go Home
      </Link>
    </div>
  );
};

export default Error404;
