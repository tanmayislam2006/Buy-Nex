import React from "react";
import { FaBullseye, FaHandshake, FaUsers, FaShieldAlt, FaBolt, FaCheckCircle } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="bg-base-100 text-base-content px-4 md:px-8 py-16 container mx-auto my-6 space-y-16">

      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Welcome to Buynex</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Buynex is a real-life digital marketplace where people connect to buy and sell with trust, simplicity, and security.
        </p>
        <div className="h-1 w-24 bg-primary mx-auto rounded-full mt-2"></div>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="bg-base-200 p-6 rounded-xl shadow-md space-y-3">
          <div className="flex items-center gap-3">
            <FaBullseye className="text-2xl text-primary" />
            <h2 className="text-2xl font-semibold">Our Mission</h2>
          </div>
          <p>
            To create a safe and efficient platform where anyone can confidently buy, sell, or exchange real-life products and services.
          </p>
        </div>
        <div className="bg-base-200 p-6 rounded-xl shadow-md space-y-3">
          <div className="flex items-center gap-3">
            <FaHandshake className="text-2xl text-primary" />
            <h2 className="text-2xl font-semibold">Our Promise</h2>
          </div>
          <p>
            We promise fairness, transparency, and a community-focused experience where every user feels valued and protected.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Buynex?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature icon={<FaUsers />} title="Real Community" desc="Connect with real buyers & sellers in your area." />
          <Feature icon={<FaShieldAlt />} title="Secure Platform" desc="Every post and user is monitored for trust & safety." />
          <Feature icon={<FaBolt />} title="Fast Deals" desc="Direct negotiation means quicker decisions & results." />
          <Feature icon={<FaCheckCircle />} title="Verified Listings" desc="We ensure listings are clear, honest, and updated." />
          <Feature icon={<FaHandshake />} title="Transparent Trades" desc="Buy and sell with mutual agreement—no surprises." />
          <Feature icon={<FaBullseye />} title="Focused Support" desc="Got stuck? Our support team is ready to assist you 24/7." />
        </div>
      </section>
    </div>
  );
};

// ✅ Reusable Feature Box
const Feature = ({ icon, title, desc }) => {
  return (
    <div className="bg-base-200 p-6 rounded-lg shadow hover:shadow-lg transition-all">
      <div className="text-3xl text-primary mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
};

export default AboutUs;
