import React from "react";
import { useParams } from "react-router";
import {
  FaBox,
  FaCheckCircle,
  FaPaperPlane,
  FaShippingFast,
  FaTruck,
} from "react-icons/fa";

const trackingData = [
  {
    trackingId: "T001",
    productId: "P1001",
    productName: "Wireless Mouse",
    userEmail: "user@example.com",
    step: 1,
    status: "Order Placed",
    estimatedDelivery: "2025-08-01",
    lastUpdated: "2025-07-30 14:00",
  },
  {
    trackingId: "T002",
    productId: "P1002",
    productName: "Bluetooth Speaker",
    userEmail: "user@example.com",
    step: 2,
    status: "Confirmed",
    estimatedDelivery: "2025-08-02",
    lastUpdated: "2025-07-30 16:00",
  },
  {
    trackingId: "T003",
    productId: "P1003",
    productName: "Gaming Keyboard",
    userEmail: "user@example.com",
    step: 4,
    status: "Out for Delivery",
    estimatedDelivery: "2025-08-01",
    lastUpdated: "2025-07-31 10:30",
  },
  {
    trackingId: "T004",
    productId: "P1004",
    productName: "Smart Watch",
    userEmail: "user@example.com",
    step: 5,
    status: "Delivered",
    estimatedDelivery: "2025-07-30",
    lastUpdated: "2025-07-30 18:00",
  },
  {
    trackingId: "T005",
    productId: "P1005",
    productName: "Laptop Stand",
    userEmail: "user@example.com",
    step: 3,
    status: "Shipped",
    estimatedDelivery: "2025-08-03",
    lastUpdated: "2025-07-31 08:00",
  },
];

const ProductStatus = () => {
  const { id } = useParams();
  const trackingInfo = trackingData.find((item) => item.trackingId === id);

  if (!trackingInfo) {
    return (
      <div className="text-center mt-16 text-red-500 text-lg">
        No tracking info found.
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", icon: <FaBox size={18} /> },
    { label: "Confirmed", icon: <FaCheckCircle size={18} /> },
    { label: "Shipped", icon: <FaPaperPlane size={18} /> },
    { label: "Out for Delivery", icon: <FaShippingFast size={18} /> },
    { label: "Delivered", icon: <FaTruck size={18} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:p-8">
      <h2 className="text-3xl font-bold mb-6">{trackingInfo.productName}</h2>

      <div className="bg-base-100 shadow-md rounded-lg p-6 space-y-3">
        <p>
          <strong>Status:</strong> {trackingInfo.status}
        </p>
        <p>
          <strong>Estimated Delivery:</strong> {trackingInfo.estimatedDelivery}
        </p>
        <p>
          <strong>Last Updated:</strong> {trackingInfo.lastUpdated}
        </p>
      </div>

      <div className="mt-12">
        <h4 className="text-xl font-semibold mb-8">Tracking Progress</h4>

        <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
          {/* Horizontal Line for md+ */}
          <div className="hidden md:block absolute top-[28px] left-6 right-6 h-1 z-0">
            <div
              className="h-1 w-[90%] left-3 -top-[2px] bg-gray-300 relative"
              style={{
                background: `linear-gradient(to right, #F85606 ${
                  (trackingInfo.step - 1) * 25
                }%, #d1d5db ${(trackingInfo.step - 1) * 25}%)`,
              }}
            />
          </div>

          {/* Vertical Line for mobile */}
          <div className="md:hidden absolute top-6 bottom-0 left-[28px] w-1 z-0">
            <div
              className="w-1 h-[370px] relative -left-1 bg-gray-300"
              style={{
                background: `linear-gradient(to bottom, #F85606 ${
                  (trackingInfo.step - 1) * 25
                }%, #d1d5db ${(trackingInfo.step - 1) * 25}%)`,
              }}
            />
          </div>

          {steps.map((step, index) => {
            const isActive = trackingInfo.step >= index + 1;

            return (
              <div
                key={index}
                className="relative z-10 flex md:flex-col items-center md:items-center mb-10 md:mb-0">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300
                    ${
                      isActive
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-300 text-gray-500 border-gray-300"
                    }
                  `}>
                  {step.icon}
                </div>

                {/* Label beside icon in mobile, under icon in desktop */}
                <span
                  className={`ml-4 md:ml-0 md:mt-2 text-sm font-medium text-start md:text-center w-28
                    ${isActive ? "text-primary" : "text-gray-500"}
                  `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductStatus;
