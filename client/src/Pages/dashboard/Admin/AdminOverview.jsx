import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaBoxOpen,
} from "react-icons/fa";

// const primaryColor = "#4F46E5";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4000 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 7000 },
];

const userActivityData = [
  { name: "Active", value: 240 },
  { name: "Inactive", value: 100 },
  { name: "New", value: 160 },
];

const sellerPerformanceData = [
  { name: "Seller A", orders: 120 },
  { name: "Seller B", orders: 98 },
  { name: "Seller C", orders: 80 },
  { name: "Seller D", orders: 130 },
];

const COLORS = ["#4F46E5", "#00C49F", "#FFBB28", "#FF8042"];

const summaryCards = [
  {
    icon: <FaDollarSign />,
    title: "Today’s Sales",
    value: "$1,200",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: <FaShoppingCart />,
    title: "Total Orders",
    value: "4,600",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: <FaUsers />,
    title: "Active Users",
    value: "3,240",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: <FaBoxOpen />,
    title: "Products Listed",
    value: "890",
    color: "bg-pink-100 text-pink-700",
  },
];

const AdminOverview = () => {
  return (
    <div className="p-6 md:p-10 space-y-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        📊 Admin Dashboard Overview
      </h2>
      <p className="text-gray-500 mb-6">
        Insights into your platform's performance
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`flex items-center p-5 rounded-xl shadow bg-white gap-4 border-l-2 border-primary/50`}>
            <div className={`text-3xl p-3 rounded-full ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <h4 className="text-gray-600 font-medium">{card.title}</h4>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Line Chart */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Monthly Sales
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={"#4F46E5"}
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie & Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart - User Activity */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            User Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userActivityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label>
                {userActivityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Seller Performance */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Top Seller Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sellerPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill={"#4F46E5"} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
