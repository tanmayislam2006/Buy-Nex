import React from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaPaperPlane,
  FaShippingFast,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    date: "2025-08-01",
    status: "Delivered",
    total: 149.99,
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    date: "2025-08-02",
    status: "OrderPlaced",
    total: 89.5,
  },
  {
    id: "ORD003",
    customer: "Alice Johnson",
    date: "2025-08-03",
    status: "Shipped",
    total: 129.75,
  },
  {
    id: "ORD004",
    customer: "Bob Williams",
    date: "2025-08-04",
    status: "Cancelled",
    total: 79.99,
  },
  {
    id: "ORD005",
    customer: "Kevin Park",
    date: "2025-08-05",
    status: "OutForDelivery",
    total: 199.99,
  },
  {
    id: "ORD006",
    customer: "Lina Rose",
    date: "2025-08-06",
    status: "Confirmed",
    total: 59.99,
  },
];

const statusStyles = {
  OrderPlaced: {
    label: "Order Placed",
    color: "text-orange-500",
    icon: <FaBoxOpen />,
  },
  Confirmed: {
    label: "Confirmed",
    color: "text-orange-500",
    icon: <FaCheckCircle />,
  },
  Shipped: {
    label: "Shipped",
    color: "text-orange-500",
    icon: <FaPaperPlane />,
  },
  OutForDelivery: {
    label: "Out for Delivery",
    color: "text-gray-400",
    icon: <FaShippingFast />,
  },
  Delivered: {
    label: "Delivered",
    color: "text-green-600",
    icon: <FaTruck />,
  },
  Cancelled: {
    label: "Cancelled",
    color: "text-red-500",
    icon: <FaTimesCircle />,
  },
};

const TotalOrders = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Total Orders</h2>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusStyles[order.status];
                return (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td
                      className={`px-6 py-4 flex items-center gap-2 ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => {
          const status = statusStyles[order.status];
          return (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow-md space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{order.id}</h3>
                <span className={`flex items-center gap-1 ${status.color}`}>
                  {status.icon}
                  <span className="text-sm font-medium">{status.label}</span>
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {order.customer}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {order.date}
                </p>
                <p>
                  <span className="font-medium">Total:</span> $
                  {order.total.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalOrders;
