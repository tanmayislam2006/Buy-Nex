import React, { useState, useEffect } from "react";
import ComingSoon from "../../../components/ComingSoon";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaEye, FaTrash } from "react-icons/fa";
import DataTable from "../../../shared/DataTable";

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
          <button
            className="btn btn-sm btn-error"
            onClick={() => handleDelete(row.original.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-r px-4 py-20 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">
          Order History
        </h1>
        <div className="max-w-6xl mx-auto card bg-base-100 shadow-xl p-4">
          <DataTable columns={columns} data={staticOrders} />
          {/* Modal */}
          {selectedOrder && (
            <dialog open className="modal modal-open">
              <div className="modal-box w-full max-w-2xl">
                <h3 className="font-bold text-lg text-orange-600 mb-2">
                  Order Details
                </h3>
                <div className="py-2 text-sm max-h-[70vh] overflow-y-auto space-y-3">
                  <div>
                    <strong>Order Number:</strong> {selectedOrder.orderNumber}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedOrder.userEmail}
                  </div>
                  <div>
                    <strong>Total:</strong> {selectedOrder.totalAmount}{" "}
                    {selectedOrder.currency}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedOrder.status}
                  </div>
                  <div>
                    <strong>Payment Status:</strong>{" "}
                    {selectedOrder.paymentStatus}
                  </div>
                  <div>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </div>

                  {/* Responsive Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded shadow">
                      <h4 className="font-semibold mb-1">
                        Shipping Address
                      </h4>
                      <p>{selectedOrder.shippingAddress.name}</p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state}{" "}
                        {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      <p>{selectedOrder.shippingAddress.phone}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded shadow">
                      <h4 className="font-semibold mb-1">Billing Address</h4>
                      <p>{selectedOrder.billingAddress.name}</p>
                      <p>{selectedOrder.billingAddress.street}</p>
                      <p>
                        {selectedOrder.billingAddress.city},{" "}
                        {selectedOrder.billingAddress.state}{" "}
                        {selectedOrder.billingAddress.zipCode}
                      </p>
                      <p>{selectedOrder.billingAddress.country}</p>
                      <p>{selectedOrder.billingAddress.phone}</p>
                    </div>
                  </div>

                  <div>
                    <strong>Notes:</strong> {selectedOrder.notes}
                  </div>
                  <div>
                    <strong>Discount:</strong>{" "}
                    {selectedOrder.discountCode
                      ? `${selectedOrder.discountCode} ($${selectedOrder.discountAmount})`
                      : "None"}
                  </div>
                  <div>
                    <strong>Shipping Cost:</strong> ${selectedOrder.shippingCost}
                  </div>
                  <div>
                    <strong>Tax:</strong> ${selectedOrder.taxAmount}
                  </div>
                  <div>
                    <strong>Tracking:</strong>{" "}
                    {selectedOrder.trackingNumber || "N/A"}
                  </div>
                  {selectedOrder.trackingUrl && (
                    <div>
                      <a
                        href={selectedOrder.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Track Order
                      </a>
                    </div>
                  )}
                </div>
                <div className="modal-action">
                  <button
                    className="btn"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
