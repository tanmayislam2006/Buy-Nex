// ProductTracking.jsx
import React from "react";
import { Link } from "react-router"; // ✅ use react-router-dom

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
    status: "Seller Confirmed",
    estimatedDelivery: "2025-08-02",
    lastUpdated: "2025-07-30 16:00",
  },
  {
    trackingId: "T003",
    productId: "P1003",
    productName: "Gaming Keyboard",
    userEmail: "user@example.com",
    step: 3,
    status: "Out for Delivery",
    estimatedDelivery: "2025-08-01",
    lastUpdated: "2025-07-31 10:30",
  },
  {
    trackingId: "T004",
    productId: "P1004",
    productName: "Smart Watch",
    userEmail: "user@example.com",
    step: 4,
    status: "Delivered",
    estimatedDelivery: "2025-07-30",
    lastUpdated: "2025-07-30 18:00",
  },
  {
    trackingId: "T005",
    productId: "P1005",
    productName: "Laptop Stand",
    userEmail: "user@example.com",
    step: 2,
    status: "Seller Confirmed",
    estimatedDelivery: "2025-08-03",
    lastUpdated: "2025-07-31 08:00",
  },
];

const ProductTracking = () => {
  const userEmail = "user@example.com";
  const products = trackingData.filter((item) => item.userEmail === userEmail);

  return (
    <div className="px-4 py-16 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">Recent Orders</h2>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full shadow rounded-xl">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Estimated Delivery</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.trackingId} className="hover:bg-gray-50">
                <td className="py-3 px-4">{item.productName}</td>
                <td className="py-3 px-4">{item.status}</td>
                <td className="py-3 px-4">{item.estimatedDelivery}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/Product-status/${item.trackingId}`}
                    className="btn btn-sm btn-primary">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {products.map((item) => (
          <div
            key={item.trackingId}
            className="bg-white rounded-xl shadow p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{item.productName}</h3>
              <span className="text-sm text-gray-500">{item.status}</span>
            </div>
            <p className="text-sm">
              <span className="font-medium">Estimated:</span>{" "}
              {item.estimatedDelivery}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Last Updated:</span>{" "}
              {item.lastUpdated}
            </p>
            <Link
              to={`/Product-status/${item.trackingId}`}
              className="inline-block mt-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTracking;
