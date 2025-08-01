import React, { useState } from "react";
import "./Css/seller.css";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake } from "react-icons/fa";
import banner from "../../assets/seller/seller-banner.png";
import seller from '../../assets/seller/seller.jpg'

const BecomeSeller = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };
  return (
    <div className="py-30 md:py-18 lg:py-30">
      <img src={banner} alt="" className="mx-auto md:pb-18 lg:pb-30  hidden md:block" />
      <div className=" flex flex-col lg:flex-row justify-center items-center px-4 sm:px-6 md:px-8 lg:px-10 max-w-6xl mx-auto gap-10 ">
        <div className="border border-secondary/50 rounded-lg p-5 md:px-6 shadow-md shadow-secondary flex gap-6 justify-center items-center">
        {/* content */}
        <div className="text-primary text-center ">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
           Let’s Create Account
          </h2>
          <p className="text-accent text-sm mb-6 ">
            Fill out the form below to start selling on Buy-Nex.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="become-seller space-y-5">
            {/* Full Name */}
            <div>
              <FaUser className=" mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <FaEnvelope className=" mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            {/* Contact Number */}
            <div>
              <FaPhone className=" mr-2" />
              <input
                type="tel"
                name="phone"
                placeholder="01********"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{11}"
                maxLength="11"
                required
                className="w-full outline-none"
              />
            </div>

            {/* Age */}
            <div>
              <FaBirthdayCake className=" mr-2" />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full btn bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-lg transition-colors"
            >
              Join as a Seller
            </button>
          </form>
        </div>

        {/* image */}
        <div className="max-w-[430px]  hidden lg:flex flex-col">
          <img src={seller} alt="" className="rounded-lg min-h-[450px] object-center object-cover"/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
