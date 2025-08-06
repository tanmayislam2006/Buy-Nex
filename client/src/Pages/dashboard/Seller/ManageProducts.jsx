import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { Link } from "react-router";

const ManageProducts = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", pagination.pageIndex, pagination.pageSize, user?.email],
    queryFn: async () => {
      const response = await axios.get("/products", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          sellerEmail: user?.email,
        },
      });
      return response.data;
    },
    enabled: !!user?.email, // Only run the query if the user's email is available
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      const response = await axios.delete(`/products/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Your Product has been deleted.", "success");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to delete product",
        "error"
      );
    },
  });

  const handleDelete = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert this! You want to delete ${product.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(product._id);
      }
    });
  };

  const products = data?.products || [];
  const totalPages = data?.totalPages || 0;

  const columns = [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={row.original.images[0]}
          alt={row.original.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "inventory",
      header: "Stock",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link to={`/update-product/${row.original._id}`}>
            <button className="p-2 bg-blue-500 text-white rounded">
              <FaEdit />
            </button>
          </Link>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-2 bg-red-500 text-white rounded"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    pageCount: totalPages,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      {products.length > 0 ? (
        <>
          <div className="overflow-x-auto w-full border border-base-300 rounded-xl shadow-sm">
            <table className="min-w-full text-sm text-base-content">
              <thead className="bg-primary text-white rounded-t-xl text-center">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-4 font-semibold tracking-wide text-left"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-base-200">
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`transition-all duration-200 hover:bg-base-200 ${
                      rowIndex % 2 === 0
                        ? "bg-base-100"
                        : "bg-base-200/40"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>
            <span>
              Page{" "}
              <strong>
                {pagination.pageIndex + 1} of {totalPages}
              </strong>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4 text-xl">No products available.</div>
      )}
    </div>
  );
};

export default ManageProducts;