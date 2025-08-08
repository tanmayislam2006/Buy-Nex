import React, { useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import DataTable from "../../../shared/DataTable";
import DataCardGrid from "../../../shared/DataCardGrid";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import Loading from "../../../components/Loading";

const PendingSellers = () => {
  const axiosInstance = useAxios();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Fetch seller applications
  const {
    data: appliedSellerData = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["appliedSeller", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const res = await axiosInstance.get("/seller-application", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const appliedSeller = appliedSellerData?.data || [];
  const pageCount = appliedSellerData?.totalPages || 1;

  // Unified handler for approve/reject
  const handleStatusChange = async (seller, newStatus) => {
    const actionText = newStatus === "approved" ? "Approve" : "Reject";
    const actionIcon = newStatus === "approved" ? "question" : "warning";
    const confirm = await Swal.fire({
      title: `${actionText} Seller?`,
      text: `${actionText} ${seller.name}${
        newStatus === "approved" ? " as a seller?" : "'s application?"
      }`,
      icon: actionIcon,
      showCancelButton: true,
      confirmButtonText: actionText,
    });
    if (confirm.isConfirmed) {
      try {
        await axiosInstance.put(`/seller-application/${seller._id}`, {
          status: newStatus,
        });
        Swal.fire(
          `${actionText}d!`,
          `Seller has been ${
            newStatus === "approved" ? "approved" : "rejected"
          }.`,
          "success"
        );
        refetch();
      } catch {
        Swal.fire(
          "Error",
          `Failed to ${actionText.toLowerCase()} seller.`,
          "error"
        );
      }
    }
  };

  // Delete seller application
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the seller application permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/seller-application/${id}`);
        Swal.fire("Deleted!", "Application has been deleted.", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Failed to delete the application.", "error");
      }
    }
  };

  // Table columns
  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "sellerEmail" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Age", accessorKey: "age" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const seller = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange(seller, "approved")}
              className={`p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Approve"
              disabled={seller.status !== "pending"}
            >
              <FaCheckCircle size={20} />
            </button>
            <button
              onClick={() => handleStatusChange(seller, "rejected")}
              className={`p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 shadow transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Reject"
              disabled={seller.status !== "pending"}
            >
              <FaTimesCircle size={20} />
            </button>
            <button
              onClick={() => handleDelete(seller._id)}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 shadow transition cursor-pointer"
              title="Delete"
            >
              <FaTrash size={20} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Pending Seller Applications</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable
              data={appliedSeller}
              columns={columns}
              pageCount={pageCount}
              pagination={pagination}
              onPaginationChange={setPagination}
            />
          </div>
          <div className="block lg:hidden">
            <DataCardGrid data={appliedSeller} columns={columns} />
          </div>
        </>
      )}
    </div>
  );
};

export default PendingSellers;
