import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../../../shared/DataTable";
import DataCardGrid from "../../../shared/DataCardGrid";
import { FaStore } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import useAxios from "../../../Hooks/useAxios";
import Loading from "../../../components/Loading";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AllSellers = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const {
    data: sellerUsers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users?role=seller");
      return res.data;
    },
  });

  // ✅ Mutation to update user
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      await axiosInstance.patch(`/admin-update/${id}`, updates);
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const handleFireSeller = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to fire this seller?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, fire seller!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserMutation.mutate({ id, updates: { role: "customer" } });
      }
    });
    return;
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Is Verified",
      accessorKey: "isVerified",
      cell: (info) =>
        info.getValue() ? (
          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
            Verified
          </span>
        ) : (
          <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
            Not Verified
          </span>
        ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (info) => {
        const row = info.row.original;
        return (
          <button
            className="btn btn-error btn-sm text-white"
            onClick={() => handleFireSeller(row._id)}
          >
            Fire Seller
          </button>
        );
      },
    },
  ];

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-error">{error.message}</div>;

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center gap-3 text-primary text-2xl font-bold">
        <FaStore className="text-3xl" />
        <h2>All Sellers ({sellerUsers.length})</h2>
      </div>
      <div className="hidden md:block">
        <DataTable columns={columns} data={sellerUsers} />
      </div>
      <div className="block md:hidden">
        <DataCardGrid columns={columns} data={sellerUsers} />
      </div>
    </div>
  );
};

export default AllSellers;
