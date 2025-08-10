import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router";
import axios from "axios";
import { IoNotifications, IoSettings } from "react-icons/io5";

// Helper component for summary cards
function SummaryCard({ title, value, change, icon, chartColor, chartData }) {
  // Ensure chartData is not null or undefined before rendering the chart
  if (!chartData) {
    return null;
  }

  return (
    <div className="card bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-lg font-semibold">{title}</span>
        </div>
      </div>
      {/* Display value directly from API, as it's already a formatted string */}
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="flex items-center gap-2">
        <span
          className={`${
            change.includes("-") ? "text-red-500" : "text-green-500"
          } font-semibold`}
        >
          {change}
        </span>
        <div className="w-24 h-10">
          <ResponsiveContainer width="100%" height={32}>
            <LineChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="orders" // Changed from 'value' to 'orders' based on summaryChart data
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const SellerOverview = () => {
  const { user } = useAuth();
  const sellerEmail = user?.email;

  // Use Tanstack Query to fetch all dashboard data with a single API call
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sellerDashboardData", sellerEmail],
    queryFn: async () => {
      if (!sellerEmail) return null;
      const response = await axios.get(
        `http://localhost:5000/seller-dashboard-data/${sellerEmail}`
      );
      return response.data;
    },
    enabled: !!sellerEmail, // Only run the query if sellerEmail exists
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching dashboard data:", error);
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  // Use a default avatar if the user has no photo
  const defaultAvtar =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${
      user?.displayName || "User"
    }&background=random&color=fff&bold=true`;

  const {
    summary,
    recentOrdersChart,
    topProducts,
    topCountries,
    productOverview,
    recentOrders,
    earnings,
    newComments,
  } = data || {};

  const summaryChart = summary?.summaryChart || [];

  const currentMonthIndex = new Date().getMonth();

  const currentValue = summaryChart[currentMonthIndex]?.orders || 0;
  const previousValue = summaryChart[currentMonthIndex - 1]?.orders || 0;

  let changePercentage = "0.00%";

  if (previousValue !== 0) {
    const change = ((currentValue - previousValue) / previousValue) * 100;
    changePercentage = `${change.toFixed(2)}%`;
  } else if (currentValue > 0) {
    changePercentage = "100%";
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1/3 max-w-md">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="bg-gray-200 p-2 rounded-full relative">
              <IoNotifications className="text-xl text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </span>
            <span className="bg-gray-200 p-2 rounded-full">
              <IoSettings className="text-xl text-gray-600" />
            </span>
          </div>
          <Link to="/profile" className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img referrerPolicy="no-referrer" src={defaultAvtar} alt="User" />
            </div>
          </Link>
          <div>
            <div className="font-bold">{user?.name || "N/A"}</div>
            <div className="text-xs text-gray-500">
              {user?.role || "Seller"}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <SummaryCard
            title="Total Sales"
            value={summary.totalSales}
            change={changePercentage}
            icon="💵"
            chartColor="#34d399"
            chartData={summary.summaryChart}
          />
          <SummaryCard
            title="Total Income"
            value={summary.totalIncome}
            change={changePercentage}
            icon="💰"
            chartColor="#fb923c"
            chartData={summary.summaryChart}
          />
          <SummaryCard
            title="Orders Paid"
            value={summary.totalOrders}
            change={changePercentage}
            icon="🧾"
            chartColor="#60a5fa"
            chartData={summary.summaryChart}
          />
          <SummaryCard
            title="Total Visitors"
            value={summary.totalVisitors}
            change={changePercentage}
            icon="👥"
            chartColor="#6366f1"
            chartData={summary.summaryChart}
          />
          <SummaryCard
            title="Total Visits"
            value={summary.totalVisits}
            change={changePercentage}
            icon="👣"
            chartColor="#8b5cf6"
            chartData={summary.summaryChart}
          />
        </div>
      )}

      {/* Main Grid: Recent Orders, Top Products, Top Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-4">
        <div className="lg:col-span-7 xl:col-end-3 card bg-white shadow-md rounded-lg p-4">
          <h3 className="font-bold mb-2">Recent Order</h3>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart
              data={recentOrdersChart}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-4 xl:col-span-3 card bg-white shadow-md rounded-lg p-4">
          <h3 className="font-bold mb-2">Top Products</h3>
          <ul className="text-sm">
            {topProducts?.map((p, i) => (
              <li
                key={i}
                className="flex items-center justify-between mb-2 p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-sm">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <span>{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="badge badge-outline">
                    {p.soldCount} items
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{`$${p.price}`}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3 xl:col-span-2 card bg-white shadow-md rounded-lg p-4">
          <h3 className="font-bold mb-2">Top Countries By Sales</h3>
          <ul className="text-sm">
            {topCountries?.map((c, i) => (
              <li
                key={i}
                className="flex items-center justify-between mb-2 p-2 hover:bg-gray-50 rounded"
              >
                <span>{c._id}</span>
                <div className="text-right">
                  <span className="text-green-500 font-semibold">
                    ${c.totalSales?.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product Overview, Orders, Earnings, Comments */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Product Overview */}
        <div className="card bg-white shadow-md rounded-lg p-4 col-span-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Product Overview</h3>
            {/* Added a Link to the manage products page */}
            <Link to="/manage-products" className="btn btn-sm btn-outline">
              See All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Sale</th>
                  <th>Revenue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {productOverview?.products.slice(0, 12).map((p, i) => (
                  <tr key={i}>
                    <td className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded overflow-hidden">
                        {/* Check if p.images is an array and has elements before rendering */}
                        {p.images && p.images.length > 0 ? (
                          <img
                            referrerPolicy="no-referrer"
                            src={p.images[0]}
                            alt={p.name}
                          />
                        ) : (
                          <img
                            referrerPolicy="no-referrer"
                            src="https://placehold.co/100x100" // Fallback placeholder
                            alt={p.name}
                          />
                        )}
                      </div>
                      <span>{p.name}</span>
                    </td>
                    <td>{p._id}</td>
                    <td>${p.price}</td>
                    <td>{p.inventory}</td>{" "}
                    {/* Corrected from stockQuantity to inventory */}
                    <td>{p.oldPrice ? "On sale" : "--.--"}</td>{" "}
                    {/* Corrected from salePrice to oldPrice */}
                    <td>${p.revenue?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.inventory > 0 ? "badge-success" : "badge-error"
                        }`} // Corrected from stockQuantity to inventory
                      >
                        {p.inventory > 0 ? "Available" : "Not Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Removed Pagination */}
        </div>
        {/* New Comments */}
        <div className="card w-full bg-white shadow-md rounded-lg p-4">
          <h3 className="font-bold mb-2">New Comments</h3>
          <ul className="text-sm">
            {newComments?.map((c, i) => (
              <li
                key={i}
                className="mb-4 border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="avatar">
                    <div className="w-8 rounded-full overflow-hidden">
                      <img
                        referrerPolicy="no-referrer"
                        src={c.avatar}
                        alt={c.author}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">{c.author}</span>
                    <span className="text-warning text-sm">
                      {"★".repeat(c.stars)}
                      {"☆".repeat(5 - c.stars)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{c.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Orders */}
        <div className="card bg-white shadow-md rounded-lg p-6">
          <h3 className="font-bold mb-2">Orders</h3>
          <ul className="text-sm">
            {recentOrders?.slice(0, 5).map((o, i) => (
              <li key={i} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      src={o.products.image} // Corrected from o.products[0].image to o.products.image
                      alt={o.products.name} // Corrected from o.products[0].name to o.products.name
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>{o.products.name}</span>
                    <span className="text-xs text-gray-500">
                      ${o.products.price}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {/* Corrected from o.orderDate to o.createdAt */}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Earnings */}
        <div className="card bg-white shadow-md rounded-lg p-4">
          <h3 className="font-bold mb-2">Earnings</h3>
          <div className="flex gap-8 mb-2">
            <div>
              <div className="text-2xl font-bold">
                ${earnings?.totalRevenue?.toFixed(2) || "0.00"}
              </div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                ${earnings?.totalProfit?.toFixed(2) || "0.00"}
              </div>
              <div className="text-xs text-gray-500">Profit</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={earnings?.chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#34d399" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#fb923c" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;
