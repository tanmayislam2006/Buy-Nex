import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
import { BsThreeDotsVertical } from "react-icons/bs";
import { TrendingUp, TrendingDown } from "lucide-react";

// Helper: Generate random pastel color
const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)`;

// Helper: BarChart for Monthly Sales Trend
const MonthlySalesBarChart = ({ data }) => {
  // Generate a color for each month
  const barColors = data.map(() => getRandomColor());
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales">
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={barColors[idx]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Helper: PieChart for User Segments
const UserSegmentsPieChart = ({ data, title }) => {
  const pieColors = data.map(() => getRandomColor());
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={pieColors[idx]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Helper: BarChart for Top Seller Performance
const TopSellerBarChart = ({ data }) => {
  const barColors = data.map(() => getRandomColor());
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Top Seller Performance
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar dataKey="orders">
            {data.map((entry, idx) => (
              <Cell key={`cell-seller-${idx}`} fill={barColors[idx]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// The primary color used in the design
const primaryColor = "#4F46E5";

// Data for the summary cards at the top
const summaryCards = [
  {
    icon: <FaDollarSign />,
    title: "Today's Sales",
    value: "$12,426",
    trend: "8.2% from yesterday",
    trendIcon: <TrendingUp size={16} />,
    trendColor: "text-green-500",
  },
  {
    icon: <FaShoppingCart />,
    title: "Total Orders",
    value: "246",
    trend: "4.7% from last week",
    trendIcon: <TrendingUp size={16} />,
    trendColor: "text-green-500",
  },
  {
    icon: <FaUsers />,
    title: "Active Users",
    value: "1,893",
    trend: "12.3% from last month",
    trendIcon: <TrendingUp size={16} />,
    trendColor: "text-green-500",
  },
  {
    icon: <FaBoxOpen />,
    title: "Average Order Value",
    value: "$58.42",
    trend: "2.1% from last week",
    trendIcon: <TrendingDown size={16} />,
    trendColor: "text-red-500",
  },
];

// Data for the monthly sales bar chart (12 months)
const monthlySalesData = [
  { name: "Jan", sales: 25000 },
  { name: "Feb", sales: 30000 },
  { name: "Mar", sales: 35000 },
  { name: "Apr", sales: 40000 },
  { name: "May", sales: 50000 },
  { name: "Jun", sales: 55000 },
  { name: "Jul", sales: 60000 },
  { name: "Aug", sales: 62000 },
  { name: "Sep", sales: 58000 },
  { name: "Oct", sales: 55000 },
  { name: "Nov", sales: 65000 },
  { name: "Dec", sales: 70000 },
];

// Data for the order status (now as pie chart segments)
const orderStatusData = [
  { name: "Delivered", value: 45 },
  { name: "Shipped", value: 25 },
  { name: "Processing", value: 15 },
  { name: "Pending", value: 15 },
];

// Data for the user activity pie chart
const userActivityData = [
  { name: "Active Users", value: 65 },
  { name: "New Users", value: 25 },
  { name: "Inactive Users", value: 10 },
];

// Data for the top seller performance bar chart
const sellerPerformanceData = [
  { name: "TechHub", orders: 120 },
  { name: "FashionX", orders: 98 },
  { name: "HomeDecor", orders: 80 },
  { name: "SportGear", orders: 130 },
  { name: "BookWorld", orders: 110 },
];

// Data for the recent orders table
const recentOrders = [
  {
    id: "#ORD-5292",
    customer: "Alex Johnson",
    seller: "TechHub",
    amount: "$129.99",
    status: "Delivered",
    date: "Aug 09, 2025",
  },
  {
    id: "#ORD-5292",
    customer: "Sarah Miller",
    seller: "FashionX",
    amount: "$89.50",
    status: "Shipped",
    date: "Aug 08, 2025",
  },
  {
    id: "#ORD-5291",
    customer: "Michael Chen",
    seller: "HomeDecor",
    amount: "$215.75",
    status: "Processing",
    date: "Aug 08, 2025",
  },
  {
    id: "#ORD-5290",
    customer: "Emily Wilson",
    seller: "SportGear",
    amount: "$78.25",
    status: "Pending",
    date: "Aug 07, 2025",
  },
  {
    id: "#ORD-5289",
    customer: "David Parker",
    seller: "BookWorld",
    amount: "$35.00",
    status: "Delivered",
    date: "Aug 07, 2025",
  },
];

// Helper function to get status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "Pending":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AdminOverview = () => {
  return (
    <div className="p-6 md:p-10 space-y-8 bg-gray-100 font-sans min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">
        E-Commerce Dashboard
      </h2>
      <p className="text-gray-500 mb-6">
        Comprehensive overview of sales, orders, and customer activity
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className={`flex items-center p-6 rounded-xl shadow-lg bg-white gap-4`}
          >
            <div className={`text-3xl p-3 rounded-full ${index === 0 ? "bg-indigo-100 text-indigo-700" : index === 1 ? "bg-emerald-100 text-emerald-700" : index === 2 ? "bg-yellow-100 text-yellow-700" : "bg-purple-100 text-purple-700"}`}>
              {card.icon}
            </div>
            <div>
              <h4 className="text-gray-500 font-medium text-sm">
                {card.title}
              </h4>
              <p className="text-2xl font-bold text-gray-800">
                {card.value}
              </p>
              <div className="flex items-center gap-1 text-sm font-semibold mt-1">
                <span className={card.trendColor}>{card.trendIcon}</span>
                <span className={card.trendColor}>{card.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Sales Trend */}
      <div className="bg-white shadow-lg p-6 rounded-xl relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Monthly Sales Trend
            </h3>
            <p className="text-gray-500 text-sm">
              Revenue and sales over the last 12 months
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
              Export
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <BsThreeDotsVertical />
            </button>
          </div>
        </div>
        <MonthlySalesBarChart data={monthlySalesData} />
      </div>

      {/* Pie & Bar Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Order Status Segments (as Pie) */}
        <UserSegmentsPieChart data={orderStatusData} title="Order Status Segments" />
        {/* User Activity Segments */}
        <UserSegmentsPieChart data={userActivityData} title="User Activity Segments" />
        {/* Top Seller Performance */}
        <TopSellerBarChart data={sellerPerformanceData} />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow-lg p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Recent Orders
          </h3>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                <th className="p-4 rounded-tl-lg">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Seller</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-700">
                    {order.id}
                  </td>
                  <td className="p-4 text-gray-600">{order.customer}</td>
                  <td className="p-4 text-gray-600">{order.seller}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {order.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{order.date}</td>
                  <td className="p-4">
                    <button className="text-gray-500 hover:text-gray-700">
                      <BsThreeDotsVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
