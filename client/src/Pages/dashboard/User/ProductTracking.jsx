// ProductTracking.jsx
import React from "react";
import { Link } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import useAxios from "../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const ProductTracking = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tracking", user.email],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tracking?email=${user.email}`);
      return response.data; // Axios throws if error
    },
    enabled: !!user?.email, // only run if email is available
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-16">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div className="px-4 py-16 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
      <div className="overflow-x-auto">
        {products?.length > 0 ? (
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Tracking ID</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.trackingId} className="bg-gray-100">
                  <td>{item.orderId}</td>
                  <td>{item.trackingId}</td>
                  <td>{item.status}</td>
                  <td>
                    <Link
                      to={`/Product-status/${item.trackingId}`}
                      className="btn bg-primary cursor-pointer text-white"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTracking;
