import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../../../shared/DataTable";
import DataCardGrid from "../../../shared/DataCardGrid.jsx";
import { FaUsers, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useAxios from "../../../Hooks/useAxios.jsx";
import Loading from "../../../components/Loading.jsx";

const AllUser = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const { data: customerUsers = [], isLoading, isError, error } = useQuery({
    queryKey: ["users-customers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users?role=customer");
      return res.data;
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      await axiosInstance.patch(`/admin-update/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users-customers"]);
    },
  });

  const handleVerifyToggle = (id, currentStatus) => {
    updateUserMutation.mutate({ id, updates: { isVerified: !currentStatus } });
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Verified",
      accessorKey: "isVerified",
      cell: (info) => {
        const value = info.getValue();
        const row = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVerifyToggle(row._id, value)}
              className={`p-2 rounded-full ${
                value
                  ? "bg-green-100 hover:bg-green-200 text-green-700"
                  : "bg-red-100 hover:bg-red-200 text-red-500"
              } shadow transition cursor-pointer`}
              title={value ? "Mark as Unverified" : "Mark as Verified"}
            >
              {value ? <FaCheckCircle size={18} /> : <FaTimesCircle size={18} />}
            </button>
          </div>
        );
      },
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: "Last Login",
      accessorKey: "lastLogin",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-error">{error.message}</div>;

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center gap-3 mt-15 md:mt-2 text-primary text-2xl font-bold">
        <FaUsers className="text-3xl" />
        <h2>All Customers ({customerUsers.length})</h2>
      </div>
      <div className="hidden md:block">
        <DataTable columns={columns} data={customerUsers} />
      </div>
      <div className="block md:hidden">
        <DataCardGrid columns={columns} data={customerUsers} />
      </div>
    </div>
  );
};

export default AllUser;
