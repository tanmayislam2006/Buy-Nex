import React, { useState } from "react";
import "./Css/seller.css";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake } from "react-icons/fa";
import banner from "../../assets/seller/seller-banner.png";
import seller from "../../assets/seller/seller.jpg";
import useAxios from "./../../Hooks/useAxios";
import { toast } from "react-hot-toast";

const BecomeSeller = () => {
  const axiosInstance = useAxios();
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
  const applicationInfo = {
    ...formData,
    status: "pending",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post(
      "/seller-application",
      applicationInfo
    );
    if (res.data.success) {
      toast.success("Application submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
      });
      e.target.reset();
    }
    if (res.data.message) {
      toast.error(res.data.message);
    }
    if (res.data.error) {
      toast.error(res.data.error);
    }
  };
  return (
    <div className="py-10 md:py-0 md:pb-20 lg:pb-25 lg:py-10 pb-16 ">
      <img
        src={banner}
        alt=""
        className="mx-auto md:pb-18 lg:pb-30  hidden md:block"
      />
      <div className=" flex flex-col lg:flex-row justify-center items-center px-4 sm:px-6 md:px-8 lg:px-10 max-w-6xl mx-auto gap-10 ">
        <div className="border border-secondary/50 rounded-lg p-5 md:px-6 shadow-md shadow-secondary flex gap-6 justify-center items-center">
          {/* content */}
          <div className="text-primary text-center ">
            {/* Title */}
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold mb-2">
              Let's Create Account
            </h2>
            <p className="text-accent text-xs sm:text-sm mb-6 ">
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
                  name="sellerEmail"
                  placeholder="Email"
                  value={formData.sellerEmail}
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
            <img
              src={seller}
              alt=""
              className="rounded-lg min-h-[450px] object-center object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
