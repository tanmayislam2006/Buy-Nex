import React, { useState, useEffect } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import DataTable from "../../../shared/DataTable";
import DataCardGrid from "../../../shared/DataCardGrid";
import OrderDetailsModal from "../../../components/User/OrderDetailsModal";

const staticOrders = [
  {
    id: "1",
    userEmail: "alice@example.com",
    orderNumber: "ORD-001",
    totalAmount: 120.5,
    currency: "USD",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    shippingAddress: {
      street: "123 Maple St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "123-456-7890",
      name: "Alice Smith",
    },
    billingAddress: {
      street: "123 Maple St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "123-456-7890",
      name: "Alice Smith",
    },
    createdAt: "2025-07-29T10:00:00Z",
    updatedAt: "2025-07-29T12:00:00Z",
    notes: "Please deliver between 9 AM - 5 PM.",
    discountCode: "SUMMER15",
    discountAmount: 15.0,
    shippingCost: 10.0,
    taxAmount: 8.5,
    trackingNumber: "TRK123ABC",
    trackingUrl: "https://tracking.com/TRK123ABC",
    deliveryEstimated: "2025-07-31T10:00:00Z",
  },
  {
    id: "2",
    userEmail: "bob@example.com",
    orderNumber: "ORD-002",
    totalAmount: 75.0,
    currency: "USD",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    shippingAddress: {
      street: "456 Oak St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
      phone: "987-654-3210",
      name: "Bob Johnson",
    },
    billingAddress: {
      street: "456 Oak St",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
      phone: "987-654-3210",
      name: "Bob Johnson",
    },
    createdAt: "2025-07-28T14:00:00Z",
    updatedAt: "2025-07-28T15:00:00Z",
    notes: "Gift wrap this order.",
    discountCode: "",
    discountAmount: 0,
    shippingCost: 5.0,
    taxAmount: 6.0,
    trackingNumber: "",
    trackingUrl: "",
    deliveryEstimated: "2025-08-01T10:00:00Z",
  },
];


const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDelete = (id) => {
    // ✅ Replace with DELETE API later
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const columns = [
    {
      header: "Order",
      accessorKey: "orderNumber",
    },
    {
      header: "Email",
      accessorKey: "userEmail",
    },
    {
      header: "Total",
      accessorKey: "totalAmount",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Payment",
      accessorKey: "paymentStatus",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-info"
            onClick={() => setSelectedOrder(row.original)}
            title="View Details"
          >
            <FaEye />
          </button>
          {/* <button
            className="btn btn-sm btn-error"
            onClick={() => handleDelete(row.original.id)}
            title="Delete"
          >
            <FaTrash />
          </button> */}
        </div>
      ),
    },
  ];


  return (
    <div className="px-4 py-16 lg:py-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">
          Order History
        </h1>
        <div className="max-w-6xl mx-auto card bg-base-100 shadow-xl p-4">
          <div className="hidden lg:block">
            <DataTable columns={columns} data={staticOrders} />
          </div>
          <div className=" lg:hidden">
            <DataCardGrid columns={columns} data={staticOrders} />
          </div>
          {/* Modal */}
          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
