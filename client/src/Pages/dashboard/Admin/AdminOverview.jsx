import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  FaFacebook,
  FaLinkedinIn,
  FaInstagram,
  FaSnapchatGhost,
  FaGoogle,
} from "react-icons/fa";
import { SiSpotify } from "react-icons/si";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  MdOutlineEmail,
  MdOutlineDrafts,
  MdOutlineCampaign,
  MdCalendarMonth,
  MdOutlineVisibility,
  MdStar,
  MdStarOutline,
  MdSearch,
  MdMenu,
  MdClose,
  MdShare,
  MdArchive,
} from "react-icons/md";
import { AiFillClockCircle } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";

// Mock data for the dashboard
const monthlyRevenueData = [
  { name: "Jan", revenue: 12000 },
  { name: "Feb", revenue: 41000 },
  { name: "Mar", revenue: 32000 },
  { name: "Apr", revenue: 52000 },
  { name: "May", revenue: 25000 },
  { name: "Jun", revenue: 19000 },
  { name: "Jul", revenue: 21000 },
  { name: "Aug", revenue: 35000 },
  { name: "Sep", revenue: 15000 },
];

const deviceTypeData = [
  { name: "Desktop", value: 35 },
  { name: "Tablet", value: 48 },
  { name: "Mobile", value: 27 },
];
const pieChartColors = ["#4f46e5", "#33a35b", "#e26b47"];

const totalClicksData = [
  { name: "Jan", count: 20 },
  { name: "Feb", count: 25 },
  { name: "Mar", count: 35 },
  { name: "Apr", count: 40 },
  { name: "May", count: 50 },
  { name: "Jun", count: 55 },
  { name: "Jul", count: 60 },
  { name: "Aug", count: 65 },
];

const totalUsersData = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 150 },
  { name: "Mar", value: 120 },
  { name: "Apr", value: 180 },
  { name: "May", value: 250 },
  { name: "Jun", value: 200 },
  { name: "Jul", value: 280 },
  { name: "Aug", value: 350 },
];

const totalViewsData = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 120 },
  { name: "Mar", value: 150 },
  { name: "Apr", value: 180 },
  { name: "May", value: 200 },
  { name: "Jun", value: 170 },
  { name: "Jul", value: 220 },
  { name: "Aug", value: 250 },
];

const totalAccountsData = [
  { name: "A", value: 100 },
  { name: "B", value: 150 },
  { name: "C", value: 120 },
  { name: "D", value: 180 },
  { name: "E", value: 250 },
  { name: "F", value: 200 },
  { name: "G", value: 280 },
  { name: "H", value: 350 },
  { name: "I", value: 400 },
  { name: "J", value: 320 },
  { name: "K", value: 380 },
];

const campaignStatsData = [
  {
    label: "Campaigns",
    value: 54,
    trend: "28%",
    icon: <MdOutlineCampaign />,
    color: "bg-purple-500",
  },
  {
    label: "Emailed",
    value: 245,
    trend: "15%",
    icon: <MdOutlineEmail />,
    color: "bg-green-500",
  },
  {
    label: "Opened",
    value: 54,
    trend: "30.5%",
    icon: <MdOutlineDrafts />,
    color: "bg-blue-500",
  },
  {
    label: "Clicked",
    value: 859,
    trend: "34.6%",
    icon: <AiFillClockCircle />,
    color: "bg-orange-500",
  },
  {
    label: "Subscribed",
    value: 24758,
    trend: "53%",
    icon: <MdOutlineEmail />,
    color: "bg-indigo-500",
  },
  {
    label: "Spam Message",
    value: 548,
    trend: "47%",
    icon: <MdCalendarMonth />,
    color: "bg-red-500",
  },
  {
    label: "Views Mails",
    value: 9845,
    trend: "68%",
    icon: <MdOutlineVisibility />,
    color: "bg-blue-500",
  },
];

const newUsersData = [
  {
    name: "Elon Jonado",
    handle: "elon_deo",
    avatar: "https://placehold.co/40x40/E5E7EB/1F2937?text=EJ",
  },
  {
    name: "Alexzender Clito",
    handle: "zli_alexzender",
    avatar: "https://placehold.co/40x40/E5E7EB/1F2937?text=AC",
  },
  {
    name: "Michle Tinko",
    handle: "tinko_michle",
    avatar: "https://placehold.co/40x40/E5E7EB/1F2937?text=MT",
  },
  {
    name: "KailWemba",
    handle: "wemba_ki",
    avatar: "https://placehold.co/40x40/E5E7EB/1F2937?text=KW",
  },
  {
    name: "Henhico Tino",
    handle: "henhiico_tino",
    avatar: "https://placehold.co/40x40/E5E7EB/1F2937?text=HT",
  },
  {
    name: "Gonjiko Fernando",
    handle: "gonjiko_fernando",
    avatar: "https://placehold.co/40x40/E5E7EB/1F2937?text=GF",
  },
  {
    name: "Specer Kilo",
    handle: "specer_kilo",
    avatar: "https://placehold.co/40x40/E5E7EB/1F2937?text=SK",
  },
];

const recentOrdersData = [
  {
    item: "Sports Shoes",
    amount: "$149",
    vendor: "Julia Sunota",
    status: "Completed",
    rating: 5.0,
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Shoe",
  },
  {
    item: "Goldan Watch",
    amount: "$168",
    vendor: "Julia Sunota",
    status: "Completed",
    rating: 5.0,
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Watch",
  },
  {
    item: "Men Polo Tshirt",
    amount: "$124",
    vendor: "Henhiico Tino",
    status: "Pending",
    rating: 4.0,
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Shirt",
  },
  {
    item: "Blue Jeans Casual",
    amount: "$289",
    vendor: "Gonjiko Fernando",
    status: "Completed",
    rating: 3.0,
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Jeans",
  },
  {
    item: "Fancy Shirts",
    amount: "$389",
    vendor: "Specer Kilo",
    status: "Canceled",
    rating: 2.0,
    image: "https://placehold.co/40x40/E5E7EB/1F2937?text=Shirt",
  },
];

const socialLeadsData = [
  {
    platform: "Facebook",
    icon: <FaFacebook className="text-blue-600" />,
    value: 55,
    trend: "53%",
  },
  {
    platform: "LinkedIn",
    icon: <FaLinkedinIn className="text-blue-700" />,
    value: 67,
    trend: "67%",
  },
  {
    platform: "Instagram",
    icon: <FaInstagram className="text-pink-500" />,
    value: 78,
    trend: "78%",
  },
  {
    platform: "Snapchat",
    icon: <FaSnapchatGhost className="text-yellow-400" />,
    value: 46,
    trend: "49%",
  },
  {
    platform: "Google",
    icon: <FaGoogle className="text-red-500" />,
    value: 38,
    trend: "38%",
  },
  {
    platform: "Alibaba",
    icon: <FaFacebook className="text-orange-500" />,
    value: 15,
    trend: "15%",
  },
  {
    platform: "Spotify",
    icon: <SiSpotify className="text-green-500" />,
    value: 12,
    trend: "12%",
  },
];

// Helper component for Monthly Revenue Bar Chart
const MonthlyRevenueBarChart = ({ data }) => {
  const barColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#a4de6c",
    "#d0ed57",
    "#ff7300",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="revenue" barSize={20}>
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={barColors[idx % barColors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Helper component for Device Type Pie Chart
const DeviceTypePieChart = ({ data }) => {
  return (
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
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={pieChartColors[index % pieChartColors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Helper component for line charts
const CustomLineChart = ({ data, color, dataKey }) => {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Helper component for area chart
const CustomAreaChart = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fillOpacity={1}
          fill="url(#colorGradient)"
        />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AdminOverview = () => {
  const starRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        >
          <MdStar />
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6 md:p-10">
      {/* Top section with Welcome message, stats and hero image */}
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div className="flex-grow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src="https://placehold.co/48x48/E5E7EB/1F2937?text=JA"
                alt="Jhon Anderson"
              />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Welcome back</p>
              <h2 className="text-2xl font-bold text-gray-800">
                Jhon Anderson!
              </h2>
            </div>
          </div>
          <div className="flex space-x-6 md:space-x-12 mt-6">
            <div>
              <p className="text-gray-500">Today's Sales</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-3xl font-bold text-gray-800">$65.4k</p>
                <div className="text-green-500 text-xs font-semibold flex items-center">
                  <TrendingUp size={16} /> 8.2%
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-500">Growth Rate</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-3xl font-bold text-gray-800">78.4%</p>
                <div className="text-red-500 text-xs font-semibold flex items-center">
                  <TrendingDown size={16} /> 12.5%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-96 h-auto">
          <img
            src="https://placehold.co/400x200/F0F4F8/1F2937?text=Illustration+Placeholder"
            alt="Hero Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Monthly Revenue
                </h3>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <MonthlyRevenueBarChart data={monthlyRevenueData} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Device Type
                </h3>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <div className="relative flex justify-center items-center">
                <DeviceTypePieChart data={deviceTypeData} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-3xl font-bold text-gray-800">68%</p>
                  <p className="text-sm text-gray-500">Total Views</p>
                </div>
              </div>
              <div className="flex justify-around items-center mt-4">
                {deviceTypeData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: pieChartColors[index] }}
                    ></span>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Stats and Visitor Growth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Campaign Stats
                </h3>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <div className="space-y-4">
                {campaignStatsData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-1/2 flex items-center space-x-2 text-gray-600 font-medium">
                      <span
                        className={`p-2 rounded-md text-white ${item.color}`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <div className="w-1/2 flex items-center space-x-2 justify-end">
                      <span className="text-sm font-semibold text-gray-600">
                        {item.value}
                      </span>
                      <span className="text-sm font-semibold text-green-500">
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Visitors Growth
                </h3>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <CustomLineChart
                data={totalAccountsData}
                color="#33a35b"
                dataKey="value"
              />
              <div className="flex justify-between items-center mt-4">
                <div className="text-3xl font-bold text-gray-800">
                  36.7%{" "}
                  <span className="text-green-500 text-sm font-semibold">
                    34.5%
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-1/4">Clicks</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full w-[40%]"></div>
                  </div>
                  <span className="text-sm text-gray-600">2589</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-1/4">Likes</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full w-[60%]"></div>
                  </div>
                  <span className="text-sm text-gray-600">6748</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-1/4">Upvotes</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full w-[80%]"></div>
                  </div>
                  <span className="text-sm text-gray-600">9842</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Cards with charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-3xl font-bold text-gray-800">42.5k</h4>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <div className="relative w-24 h-24 mx-auto my-4">
                <svg viewBox="0 0 36 36" className="absolute top-0 left-0">
                  <path
                    className="stroke-current text-gray-200"
                    fill="none"
                    strokeWidth="3.8"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-current text-indigo-500"
                    fill="none"
                    strokeWidth="3.8"
                    strokeDasharray="78, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-800">
                  78%
                </div>
              </div>
              <p className="text-sm text-center text-gray-500 mt-2">
                24k users increased from last month
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-3xl font-bold text-gray-800">97.4k</h4>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <CustomLineChart
                data={totalUsersData}
                color="#33a35b"
                dataKey="value"
              />
              <p className="text-sm text-gray-500 mt-2">
                12.5% from last month
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-3xl font-bold text-gray-800">82.7k</h4>
                  <p className="text-sm text-gray-500">Total Clicks</p>
                </div>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={totalClicksData}>
                  <Bar dataKey="count" barSize={8} fill="#4f46e5" />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-500 mt-2">
                12.5% from last month
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-3xl font-bold text-gray-800">68.4k</h4>
                  <p className="text-sm text-gray-500">Total Views</p>
                </div>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
              <CustomLineChart
                data={totalViewsData}
                color="#e26b47"
                dataKey="value"
              />
              <p className="text-sm text-gray-500 mt-2">
                35k users increased from last month
              </p>
            </div>
          </div>
          {/* Total Accounts with Area Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-bold text-gray-800">85,247</h4>
                <p className="text-sm text-gray-500">Total Accounts</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500 text-sm font-semibold flex items-center">
                  <TrendingUp size={16} /> 23.7%
                </span>
                <button className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical />
                </button>
              </div>
            </div>
            <CustomAreaChart data={totalAccountsData} color="#ffc658" />
          </div>
          {/* Social Leads */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Social Leads
              </h3>
              <button className="text-gray-500 hover:text-gray-800">
                <BsThreeDotsVertical />
              </button>
            </div>
            <div className="space-y-4">
              {socialLeadsData.map((lead, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-1/4 flex items-center space-x-2">
                    <span className="text-gray-500">{lead.icon}</span>
                    <span className="text-sm text-gray-600">
                      {lead.platform}
                    </span>
                  </div>
                  <div className="w-3/4 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${lead.value}%`,
                          backgroundColor:
                            pieChartColors[index % pieChartColors.length],
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      {lead.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom section with new users and recent orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* New Users List */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">New Users</h3>
            <button className="text-gray-500 hover:text-gray-800">
              <BsThreeDotsVertical />
            </button>
          </div>
          <div className="space-y-4">
            {newUsersData.map((user, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.handle}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="form-checkbox text-indigo-600 rounded"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
              <MdShare size={20} />
            </button>
            <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
              <MdOutlineEmail size={20} />
            </button>
            <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
              <MdArchive size={20} />
            </button>
            <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
              <MdCalendarMonth size={20} />
            </button>
          </div>
        </div>
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Recent Orders
            </h3>
            <button className="text-gray-500 hover:text-gray-800">
              <BsThreeDotsVertical />
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 pl-10 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:border-indigo-500"
            />
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                  <th className="p-4 rounded-tl-lg">Item Name</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-tr-lg">Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersData.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-semibold text-gray-700 flex items-center space-x-2">
                      <img
                        src={order.image}
                        alt={order.item}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{order.item}</span>
                    </td>
                    <td className="p-4 text-gray-600">{order.amount}</td>
                    <td className="p-4 text-gray-600">{order.vendor}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center space-x-1 text-yellow-400">
                      {starRating(order.rating)}
                    </td>
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
