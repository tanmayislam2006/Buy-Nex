import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageProducts = () => {
  const axios = useAxios();

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get("/all-product-data");
      return data.products;
    },
  });

  const columns = [
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
      accessorKey: "stock",
      header: "Stock",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-2 bg-blue-500 text-white rounded"
          >
            <FaEdit />
          </button>
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: [],
    },
  });

  const handleEdit = (product) => {
    // Implement your edit logic here
    console.log("Editing product:", product);
  };

  const handleDelete = (product) => {
    // Implement your delete logic here
    console.log("Deleting product:", product);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-2 px-4 border-b border-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          className="p-2 bg-gray-200 rounded"
        >
          Previous
        </button>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageProducts;