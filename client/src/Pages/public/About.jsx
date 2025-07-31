import React from "react";
import { FaCheckCircle, FaBullseye, FaHandshake } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="px-4 py-12 container mx-auto space-y-12 my-15">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">About Buynex</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Buynex is a real-life marketplace where people can connect to buy, sell, or exchange products with trust and simplicity. Our mission is to empower people with safe and easy transactions.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaBullseye className="text-primary" /> Our Mission
          </h2>
          <p className="text-gray-700">
            To build a trusted digital platform where people can directly interact to buy and sell real-life products easily, safely, and efficiently.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaHandshake className="text-primary" /> Our Promise
          </h2>
          <p className="text-gray-700">
            We promise a secure, user-friendly, and community-driven platform that values transparency and fairness.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Why Choose Buynex?</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <li className="flex items-start gap-3">
            <FaCheckCircle className="text-primary text-xl mt-1" />
            <span>Real-life buying & selling platform</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="text-primary text-xl mt-1" />
            <span>Direct negotiation between buyers & sellers</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="text-primary text-xl mt-1" />
            <span>User-friendly interface</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="text-primary text-xl mt-1" />
            <span>Secure & verified listings</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="text-primary text-xl mt-1" />
            <span>Fast customer support</span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheckCircle className="text-primary text-xl mt-1" />
            <span>Community-driven reputation system</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
