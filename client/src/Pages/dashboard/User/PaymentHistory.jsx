import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import DataTable from "../../../shared/DataTable";
import DataCardGrid from "../../../shared/DataCardGrid";
import PaymentDetailsModal from "../../../components/User/PaymentDetailsModal";

const transactions = [
  {
    id: "txn-001",
    orderId: "ORD-001",
    userId: "user-001",
    gatewayTransactionId: "GW-123456",
    amount: 120.5,
    currency: "USD",
    paymentMethod: "Credit Card",
    type: "Charge",
    status: "Success",
    createdAt: "2025-07-29T10:00:00Z",
    updatedAt: "2025-07-29T12:00:00Z",
    gatewayResponse: {
      code: 200,
      message: "Payment processed successfully",
    },
    failureReason: "",
    payoutStatus: "Processed",
  },
  {
    id: "txn-002",
    orderId: "ORD-002",
    userId: "user-002",
    gatewayTransactionId: "GW-654321",
    amount: 75.0,
    currency: "USD",
    paymentMethod: "PayPal",
    type: "Charge",
    status: "Pending",
    createdAt: "2025-07-28T14:00:00Z",
    updatedAt: "2025-07-28T15:00:00Z",
    gatewayResponse: {
      code: 102,
      message: "Awaiting confirmation",
    },
    failureReason: "",
    payoutStatus: "Pending",
  },
];

const PaymentHistory = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);


  const columns = [
    {
      header: "Txn ID",
      accessorKey: "gatewayTransactionId",
    },
    {
      header: "Order",
      accessorKey: "orderId",
    },
    {
      header: "Amount",
      accessorKey: "amount",
    },
    {
      header: "Method",
      accessorKey: "paymentMethod",
    },
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Payout",
      accessorKey: "payoutStatus",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-info"
            onClick={() => setSelectedTransaction(row.original)}
            title="View Details"
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-16 md:py-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">
          Payment History
        </h1>
        <div className="card bg-base-100 shadow-xl p-4 overflow-x-auto">
          <div className="hidden lg:block">
            <DataTable columns={columns} data={transactions} />
          </div>
          <div className="lg:hidden">
            <DataCardGrid columns={columns} data={transactions} />
          </div>

          {/* Simple Details Modal */}
          {selectedTransaction && (
            <PaymentDetailsModal
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
