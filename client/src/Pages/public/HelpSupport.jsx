import React from "react";
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import feedbackImage from "../../assets/contact-us.svg";

const HelpSupport = () => {
  return (
    <div className="px-4 py-20 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          How can we help you?
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Welcome to Buynex Support Center. Find answers to common questions or
          reach out directly.
        </p>
        <div className="h-1 w-24 bg-primary mx-auto mt-4 rounded-full"></div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FaQuestionCircle /> Frequently Asked Questions
        </h2>
        <div className="join join-vertical w-full space-y-2">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="collapse collapse-arrow join-item border border-base-300 bg-base-100"
            >
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                {item.question}
              </div>
              <div className="collapse-content text-gray-700">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact + Form Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Contact Info + Form */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="grid card shadow-sm p-6  grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FaEnvelope className="text-primary text-xl mt-1" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm">support@buynex.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-primary text-xl mt-1" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-sm">+880 1234 567 890</p>
              </div>
            </div>
          </div>

          {/* Message Form */}
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
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Feedback Illustration */}
        <div className="hidden md:block">
          <img
            src={feedbackImage}
            alt="Contact Support Illustration"
            className="w-full h-full "
          />
        </div>
      </section>
    </div>
  );
};

// FAQ data array
const faqData = [
  {
    question: "How do I buy a product on Buynex?",
    answer:
      "First, create an account, browse listings, and directly contact the seller to negotiate and buy.",
  },
  {
    question: "Can I sell my own products?",
    answer:
      "Yes! After creating an account, go to the “Sell” section and post your product with full details.",
  },
  {
    question: "How do I contact support if I face an issue?",
    answer:
      "You can email us or call our hotline below. We're here 24/7 to assist you.",
  },
];

export default HelpSupport;
