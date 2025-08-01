// TrackingTable.jsx
import React from "react";
import { Link } from "react-router";
// import { trackingData } from "./mockTrackingData";

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
  const userEmail = "user@example.com"; // mock user
  // const products = trackingData.filter(item => item.userEmail === userEmail);
  const products = [...trackingData];

  return (
    <div className="px-4 py-16 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Status</th>
              <th>Estimated Delivery</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.trackingId}>
                <td>{item.productName}</td>
                <td>{item.status}</td>
                <td>{item.estimatedDelivery}</td>
                <td>
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
    </div>
  );
};

export default ProductTracking;
