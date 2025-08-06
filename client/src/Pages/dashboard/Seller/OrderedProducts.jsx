import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import DataTable from "../../../shared/DataTable";
import Loading from "../../../components/Loading";

const OrderedProducts = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 0;

  const columns = [
    { header: "Order ID", accessorKey: "orderNumber" },
    { header: "Customer Email", accessorKey: "userEmail" },
    { header: "Total Amount", accessorKey: "totalAmount" },
    { header: "Payment Status", accessorKey: "paymentStatus" },
    { header: "Order Status", accessorKey: "status" },
    { header: "Order Date", accessorKey: "createdAt", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() },
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
