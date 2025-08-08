import React from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../../shared/DataTable";
import DataCardGrid from "../../../shared/DataCardGrid.jsx";
import { FaUsers } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import useAxios from "../../../Hooks/useAxios.jsx";


const AllUser = () => {
  const axiosInstance = useAxios()
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      return res.data;
    },
  });

  const customerUsers = users.filter((user) => user.role === "customer");

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => info.getValue(),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info) => info.getValue(),
    },
    {
      header: "Verified",
      accessorKey: "isVerified",
      cell: (info) =>
        info.getValue() ? (
          <span className="badge badge-success text-white">Yes</span>
        ) : (
          <span className="badge badge-error text-white">No</span>
        ),
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ImSpinner2 className="text-primary animate-spin text-4xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-error">
        <MdError className="text-4xl" />
        <p className="mt-2 font-semibold">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center gap-3 mt-15 md:mt-2 text-primary text-2xl font-bold">
        <FaUsers className="text-3xl" />
        <h2>All Customers ({customerUsers.length})</h2>
      </div>

      {/* Table view for large screens */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={customerUsers} />
      </div>

      {/* Card view for small screens */}
      <div className="block md:hidden">
        <DataCardGrid columns={columns} data={customerUsers} />
      </div>
    </div>
  );
};

export default AllUser;
