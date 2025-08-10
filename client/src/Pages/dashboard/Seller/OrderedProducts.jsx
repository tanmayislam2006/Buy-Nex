import React, { useState } from "react";
// Step 1: Import useMutation and useQueryClient
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import DataTable from "../../../shared/DataTable";
import Loading from "../../../components/Loading";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router"; // Corrected import path
import toast from "react-hot-toast";

const OrderedProducts = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get the query client instance
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetching data remains the same
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sellerOrders", pagination.pageIndex, pagination.pageSize, user?.email],
    queryFn: async () => {
      const response = await axios.get(`/seller-orders/${user.email}`, {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        },
      });
      return response.data;
    },
    enabled: !!user?.email,
  });

  // Step 2: Define the mutation for updating the status
  const { mutate: updateOrderStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ orderId, status, orderNumber }) => {
      return axios.patch(`/orders/${orderId}/status`, { status, orderNumber });
    },
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
    },
    onError: (err) => {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status.");
    },
  });

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 0;

  // Define the possible order statuses
  const ORDER_STATUSES = ["Order Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered",];
  const columns = [
    { header: "Order ID", accessorKey: "orderNumber" },
    { header: "Customer Email", accessorKey: "userEmail" },
    { header: "Total Amount", accessorKey: "totalAmount" },

    //Modify the "Order Status" column to be a dropdown
    {
      header: "Order Status",
      accessorKey: "status",
      cell: ({ row }) => {
        // Find the index of the order's current status
        const currentStatusIndex = ORDER_STATUSES.indexOf(row.original.status);

        return (
          <select
            value={row.original.status}
            onChange={(e) => {
              updateOrderStatus({ orderId: row.original._id, status: e.target.value, orderNumber: row.original.orderNumber });
            }}
            // The entire dropdown is disabled if an update is pending or status is Delivered
            disabled={isUpdating || row.original.status === "Delivered"}
            className="select select-bordered select-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-info"
          >
            {ORDER_STATUSES.map((status, index) => (
              <option
                key={status}
                value={status}
                // Disable this option if its index is less than the current status's index
                disabled={index < currentStatusIndex}
              >
                {status}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      header: "Order Date",
      accessorKey: "createdAt",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      header: "Products",
      accessorKey: "products",
      cell: ({ row }) => (
        <ul className="list-disc list-inside">
          {row.original.products.map((product, index) => (
            <li key={index}>
              {product.productName} ({product.quantity})
            </li>
          ))}
        </ul>
      ),
    },
    {
      header: "Details",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-info"
            onClick={() =>
              navigate('/ordered-product-details', { state: { order: row.original } })
            }
            title="View Details"
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="text-red-500 text-center">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ordered Products</h2>
      {isUpdating && <p className="text-center text-info">Updating status...</p>}
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No ordered products found.</p>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          pageCount={totalPages}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}
    </div>
  );
};

export default OrderedProducts;