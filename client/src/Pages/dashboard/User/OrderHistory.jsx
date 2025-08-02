import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import DataTable from "../../../shared/DataTable";
import DataCardGrid from "../../../shared/DataCardGrid";
import OrderDetailsModal from "../../../components/User/OrderDetailsModal";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const OrderHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: orderHistory=[] } = useQuery({
    queryKey: ["order-history"],
    queryFn: async () => {
      const response = await axiosSecure.get(`/order-history/${user?.email}`);
      return response.data;
    },
  });
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
            <DataTable columns={columns} data={orderHistory} />
          </div>
          <div className=" lg:hidden">
            <DataCardGrid columns={columns} data={orderHistory} />
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
