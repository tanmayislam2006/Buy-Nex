import React from "react";
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle } from "react-icons/fa";

const HelpSupport = () => {
  return (
    <div className="px-4 py-20 container mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">How can we help you?</h1>
        <p className="mt-4 text-gray-600">
          Welcome to Buynex Support Center. Find answers to common questions or reach out directly.
        </p>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FaQuestionCircle /> Frequently Asked Questions
        </h2>
        <div className="join join-vertical w-full space-y-2">
          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              How do I buy a product on Buynex?
            </div>
            <div className="collapse-content">
              <p>
                First, create an account, browse listings, and directly contact the seller to negotiate and buy.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              Can I sell my own products?
            </div>
            <div className="collapse-content">
              <p>
                Yes! After creating an account, go to the “Sell” section and post your product with full details.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
              How do I contact support if I face an issue?
            </div>
            <div className="collapse-content">
              <p>
                You can email us or call our hotline below. We're here 24/7 to assist you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-base-200 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-xl text-primary" />
            <div>
              <p className="font-semibold">Email</p>
              <p>support@buynex.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-xl text-primary" />
            <div>
              <p className="font-semibold">Phone</p>
              <p>+880 1234 567 890</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback or Message Form (optional) */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="input input-bordered w-full"
            required
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Your Message"
            rows={4}
            required
          ></textarea>
          
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default HelpSupport;
