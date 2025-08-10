import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "./../../../Hooks/useAxios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaBox, FaCheckCircle, FaMoneyBillWave, FaPaperPlane, FaTruck } from "react-icons/fa";
import { FaBagShopping, FaShop } from "react-icons/fa6";
const salesChartData = [
  { name: "01 May", sales: 78, orders: 60 },
  { name: "02 May", sales: 75, orders: 65 },
  { name: "03 May", sales: 73, orders: 69 },
  { name: "04 May", sales: 78, orders: 72 },
  { name: "05 May", sales: 74, orders: 70 },
  { name: "06 May", sales: 76, orders: 65 },
  { name: "07 May", sales: 75, orders: 67 },
  { name: "08 May", sales: 77, orders: 68 },
  { name: "09 May", sales: 72, orders: 60 },
  { name: "10 May", sales: 76, orders: 62 },
  { name: "11 May", sales: 71, orders: 59 },
  { name: "12 May", sales: 74, orders: 64 },
];

const channelsData = [
  { name: "Social Media", value: 48 },
  { name: "Google", value: 30 },
  { name: "Email", value: 22 },
];
const CHANNEL_COLORS = ["#F85606", "#25B1D2", "#42A0D8", "#8974D0"];

const AdminOverview = () => {
  const axiosInstance = useAxios();
  const { data } = useQuery({
    queryKey: ["adminOverview"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin-dashboard");
      return res.data;
    },
  });
  const {
    totalOrders,
    totalSales,
    productSoldCount,
    topWishlistProducts,
    orderStatusCounts,
    recentProducts,
  } = data || {};
  const getStatusCount = (status) => {
    return orderStatusCounts?.find((s) => s.status === status)?.count || 0;
  };
  return (
    <div className="bg-[#F1F2F7] min-h-screen p-4 font-['Inter'] text-[#1B2544]">
      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sales Chart</h2>
              <div className="flex items-center space-x-2 text-sm text-[#8B8B8B]">
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#11B981] mr-1"></div>
                  Sales
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#E04040] mr-1"></div>
                  Order
                </span>
              </div>
            </div>

            <div className="flex items-center mb-4 space-x-4">
              <div className="flex items-center text-xl font-bold">
                <span className="p-2 bg-[#F1F2F7] rounded-lg mr-2 text-primary text-2xl"><FaShop /></span>
                <div>
                  <p className="text-sm font-normal text-[#8B8B8B]">Orders</p>
                  <p>${totalSales?.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center text-sm font-semibold text-[#11B981]">
                <span className="mr-1">▲</span>
                <span>8.32%</span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[55, 80]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2DCC70"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#F58742"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Channels Pie Chart */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Channels</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {channelsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-[#8B8B8B]">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4">
              <button className="flex items-center text-[#F85606] border border-[#F85606] px-4 py-2 rounded-lg text-sm">
                <span className="mr-2">Download Report</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Metrics and Reviews Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Orders Metric Card */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-4xl text-blue-500"><FaBagShopping /></span>
              <span className="text-[#8B8B8B]">...</span>
            </div>
            <h3 className="text-xl font-bold">Orders</h3>
            <p className="text-2xl font-bold mt-2">{totalOrders}</p>
            <p className="text-xs text-[#11B981] mt-1">Over last month 14% ↑</p>
          </div>
          {/* Sales Metric Card */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-4xl text-yellow-500"><FaMoneyBillWave /></span>
              <span className="text-[#8B8B8B]">...</span>
            </div>
            <h3 className="text-xl font-bold">Sales</h3>
            <p className="text-2xl font-bold mt-2">${totalSales?.toFixed(2)}</p>
            <p className="text-xs text-[#E04040] mt-1">
              Over last month 2.4% ↓
            </p>
          </div>
          {/* Customer Rating Card */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Customer Rating</h3>
              <span className="text-[#8B8B8B]">...</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-4xl font-bold">3.0</p>
              <p className="text-xl text-[#FFD700]">⭐⭐⭐</p>
              <p className="text-[#8B8B8B]">(318)</p>
            </div>
            <p className="text-xs text-[#11B981] mt-1">
              ↑ +35 Point from last month
            </p>
            <div className="flex justify-between mt-4 items-end">
              <svg className="w-24 h-8" viewBox="0 0 100 30">
                <path
                  d="M0,25 Q25,5 50,15 T100,5"
                  fill="none"
                  stroke="#2DCC70"
                  strokeWidth="2"
                />
              </svg>
              <button className="text-[#F85606] text-xs">
                Download Report
              </button>
            </div>
          </div>
          {/* Recent Reviews Card */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Reviews</h2>
              <a href="#" className="text-[#F85606] text-sm font-semibold">
                View All
              </a>
            </div>
            <div className="flex items-start">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F1F2F7] text-[#9660ff] font-bold mr-4">
                J
              </span>
              <div>
                <p className="font-semibold">Johnath Siddeley</p>
                <p className="text-sm text-[#FFD700]">
                  ⭐⭐⭐⭐⭐ <span className="text-[#8B8B8B] text-xs">(5)</span>
                </p>
                <p className="text-sm mt-1">
                  Very nice glasses. I ordered for my friend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Section of the dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products Sold Bar Chart */}
          <div className="bg-[#9660ff] p-6 rounded-[20px] shadow-sm text-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#8B8B8B] text-sm">...</span>
            </div>
            <h2 className="text-xl font-bold">Top 10 Trending Products</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productSoldCount}
                  barSize={20}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    stroke="#FFFFFF33"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="productName"
                    stroke="#FFFFFF"
                    tick={{ fill: "#FFFFFF", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Legend
                    wrapperStyle={{ top: 0, right: 0 }}
                    verticalAlign="top"
                    align="right"
                    // This is the key change: explicitly set the legend text color
                    formatter={(value) => (
                      <span style={{ color: "#FFFFFF" }}>{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="totalSold"
                    name="Sold"
                    fill="#FFFFFF"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Top Wishlist Products */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Top Wishlist Products</h2>
              <a href="#" className="text-[#F85606] text-sm font-semibold">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {topWishlistProducts?.map((product, idx) => (
                <div key={idx} className="flex justify-between mx-2">
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg mr-4"
                    />
                    <div className="">
                      <p className="font-semibold">{product.productName}</p>
                      <p className="text-sm">Wish Count</p>
                    </div>
                  </div>
                  <p className="font-bold">{product.wishCount} times</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Overview and Recent Products Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <h2 className="text-xl font-bold sm:col-span-2">
              Activity Overview
            </h2>
            <div className="bg-white p-6 rounded-[20px] shadow-sm">
              <span className="text-3xl text-[#9660ff]">
                <FaBox />
              </span>
              <h3 className="text-lg font-semibold my-2">Order Placed</h3>
              <p className="text-sm text-[#8B8B8B]">
                {getStatusCount("Order Placed")} New Packages
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] shadow-sm">
              <span className="text-3xl text-[#F85606]">
                <FaCheckCircle />
              </span>
              <h3 className="text-lg font-semibold my-2">Confirmed</h3>
              <p className="text-sm text-[#8B8B8B]">
                {getStatusCount("Confirmed")} New Items
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] shadow-sm">
              <span className="text-3xl text-[#00C49F]">
                <FaPaperPlane />
              </span>
              <h3 className="text-lg font-semibold my-2">Shipped</h3>
              <p className="text-sm text-[#8B8B8B]">
                {getStatusCount("Shipped")} Support New Cases
              </p>
            </div>
            <div className="bg-white p-6 rounded-[20px] shadow-sm">
              <span className="text-3xl text-[#F58742]">
                <FaTruck />
              </span>
              <h3 className="text-lg font-semibold my-2">Delivery</h3>
              <p className="text-sm text-[#8B8B8B]">
                {getStatusCount("Delivery")} Upgraded Boxed
              </p>
            </div>
          </div>
          {/* Recent Products Table */}
          <div className="bg-white p-6 rounded-[20px] shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Products</h2>
            <p className="text-sm text-[#8B8B8B] mb-4">
              Products added today. Click{" "}
              <span className="text-[#F85606]">here</span> for more details
            </p>
            <table className="min-w-full text-left table-fixed">
              <thead>
                <tr className="text-sm text-[#8B8B8B]">
                  <th className="w-1/12 p-2"></th>
                  <th className="w-4/12 p-2">NAME</th>
                  <th className="w-3/12 p-2">STOCK</th>
                  <th className="w-2/12 p-2">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts?.map((product, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-2 text-2xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg"
                      />
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          product.inventory != 0
                            ? "bg-[#E1F3E1] text-[#11B981]"
                            : "bg-[#F9E2E2] text-[#E04040]"
                        }`}
                      >
                        {product.inventory > 0
                          ? product.inventory
                          : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-2">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
