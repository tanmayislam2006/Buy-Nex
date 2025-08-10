import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const AdminOverview = () => {
    // Hardcoded mock data to replicate the visuals from the images
    const salesChartData = [
        { name: '01 May', sales: 78, orders: 60 },
        { name: '02 May', sales: 75, orders: 65 },
        { name: '03 May', sales: 73, orders: 69 },
        { name: '04 May', sales: 78, orders: 72 },
        { name: '05 May', sales: 74, orders: 70 },
        { name: '06 May', sales: 76, orders: 65 },
        { name: '07 May', sales: 75, orders: 67 },
        { name: '08 May', sales: 77, orders: 68 },
        { name: '09 May', sales: 72, orders: 60 },
        { name: '10 May', sales: 76, orders: 62 },
        { name: '11 May', sales: 71, orders: 59 },
        { name: '12 May', sales: 74, orders: 64 },
    ];

    const channelsData = [
        { name: 'Social Media', value: 48 },
        { name: 'Google', value: 30 },
        { name: 'Email', value: 22 },
    ];
    const CHANNEL_COLORS = ['#F85606', '#25B1D2', '#42A0D8', '#8974D0'];

    const productsSoldData = [
        { name: 'Mon', count: 35 },
        { name: 'Tue', count: 25 },
        { name: 'Wed', count: 28 },
        { name: 'Thu', count: 25 },
        { name: 'Fri', count: 35 },
        { name: 'Sat', count: 20 },
        { name: 'Sun', count: 30 },
    ];

    const topCountriesData = [
        { country: 'United States', value: 16710, flag: '🇺🇸' },
        { country: 'Venezuela', value: 109475, flag: '🇻🇪' },
        { country: 'Salvador', value: 105598, flag: '🇸🇻' },
        { country: 'Russia', value: 104200, flag: '🇷🇺' },
    ];

    const recentProductsData = [
        { photo: '📦', name: 'Cookie', stock: 'Out of Stock', price: '$10.50' },
        { photo: '📦', name: 'Glass', stock: 'In Stock', price: '$70.20' },
        { photo: '📦', name: 'Headphone', stock: 'In Stock', price: '$870.50' },
        { photo: '📦', name: 'Perfume', stock: 'In Stock', price: '$170.50' },
    ];

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
                                <select className="bg-gray-100 rounded-md p-1 border border-gray-300">
                                    <option>May</option>
                                    <option>June</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex items-center mb-4 space-x-4">
                            <div className="flex items-center text-xl font-bold">
                                <span className="p-2 bg-[#F1F2F7] rounded-lg mr-2">🛒</span>
                                <div>
                                    <p className="text-sm font-normal text-[#8B8B8B]">Orders</p>
                                    <p>$10.552,40</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-[#11B981]">
                                <span className="mr-1">▲</span>
                                <span>8.32%</span>
                            </div>
                        </div>
                        
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} domain={[55, 80]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sales" stroke="#2DCC70" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="orders" stroke="#F58742" strokeWidth={2} dot={false} />
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
                                            <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics and Reviews Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Orders Metric Card */}
                    <div className="bg-white p-6 rounded-[20px] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-3xl">🛍️</span>
                            <span className="text-[#8B8B8B]">...</span>
                        </div>
                        <h3 className="text-xl font-bold">Orders</h3>
                        <p className="text-2xl font-bold mt-2">310</p>
                        <p className="text-xs text-[#11B981] mt-1">Over last month 14% ↑</p>
                    </div>
                    {/* Sales Metric Card */}
                    <div className="bg-white p-6 rounded-[20px] shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-3xl">💰</span>
                            <span className="text-[#8B8B8B]">...</span>
                        </div>
                        <h3 className="text-xl font-bold">Sales</h3>
                        <p className="text-2xl font-bold mt-2">$3.759,00</p>
                        <p className="text-xs text-[#E04040] mt-1">Over last month 2.4% ↓</p>
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
                        <p className="text-xs text-[#11B981] mt-1">↑ +35 Point from last month</p>
                        <div className="flex justify-between mt-4 items-end">
                            <svg className="w-24 h-8" viewBox="0 0 100 30">
                                <path d="M0,25 Q25,5 50,15 T100,5" fill="none" stroke="#2DCC70" strokeWidth="2"/>
                            </svg>
                            <button className="text-[#F85606] text-xs">Download Report</button>
                        </div>
                    </div>
                    {/* Recent Reviews Card */}
                    <div className="bg-white p-6 rounded-[20px] shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Recent Reviews</h2>
                            <a href="#" className="text-[#F85606] text-sm font-semibold">View All</a>
                        </div>
                        <div className="flex items-start">
                            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F1F2F7] text-[#9660ff] font-bold mr-4">J</span>
                            <div>
                                <p className="font-semibold">Johnath Siddeley</p>
                                <p className="text-sm text-[#FFD700]">⭐⭐⭐⭐⭐ <span className="text-[#8B8B8B] text-xs">(5)</span></p>
                                <p className="text-sm mt-1">Very nice glasses. I ordered for my friend.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Section of the dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Products Sold Bar Chart */}
                    <div className="bg-[#9660ff] p-6 rounded-[20px] shadow-sm text-white">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-3xl">📦</span>
                            <span className="text-[#8B8B8B] text-sm">...</span>
                        </div>
                        <h2 className="text-xl font-bold">Products Sold</h2>
                        <p className="text-3xl font-bold mb-4">88 Sold</p>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productsSoldData} barSize={20} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid stroke="#FFFFFF33" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" stroke="#FFFFFF" tick={{ fill: '#FFFFFF' }} axisLine={false} tickLine={false} />
                                    <YAxis hide domain={[0, 40]} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#FFFFFF" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Your Top Countries */}
                    <div className="bg-white p-6 rounded-[20px] shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Top Countries</h2>
                            <a href="#" className="text-[#F85606] text-sm font-semibold">View All</a>
                        </div>
                        <div className="space-y-4">
                            {topCountriesData.map((country) => (
                                <div key={country.country} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-2">{country.flag}</span>
                                        <p>{country.country}</p>
                                    </div>
                                    <p className="font-bold">${country.value.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Overview and Recent Products Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <h2 className="text-xl font-bold sm:col-span-2">Activity Overview</h2>
                        <div className="bg-white p-6 rounded-[20px] shadow-sm">
                            <span className="text-3xl text-[#9660ff]">🚚</span>
                            <h3 className="text-lg font-semibold my-2">Delivered</h3>
                            <p className="text-sm text-[#8B8B8B]">15 New Packages</p>
                        </div>
                        <div className="bg-white p-6 rounded-[20px] shadow-sm">
                            <span className="text-3xl text-[#F85606]">📝</span>
                            <h3 className="text-lg font-semibold my-2">Ordered</h3>
                            <p className="text-sm text-[#8B8B8B]">72 New Items</p>
                        </div>
                        <div className="bg-white p-6 rounded-[20px] shadow-sm">
                            <span className="text-3xl text-[#00C49F]">📊</span>
                            <h3 className="text-lg font-semibold my-2">Reported</h3>
                            <p className="text-sm text-[#8B8B8B]">50 Support New Cases</p>
                        </div>
                        <div className="bg-white p-6 rounded-[20px] shadow-sm">
                            <span className="text-3xl text-[#F58742]">📦</span>
                            <h3 className="text-lg font-semibold my-2">Arrived</h3>
                            <p className="text-sm text-[#8B8B8B]">34 Upgraded Boxed</p>
                        </div>
                    </div>
                    {/* Recent Products Table */}
                    <div className="bg-white p-6 rounded-[20px] shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Recent Products</h2>
                        <p className="text-sm text-[#8B8B8B] mb-4">Products added today. Click <span className="text-[#F85606]">here</span> for more details</p>
                        <table className="min-w-full text-left table-fixed">
                            <thead>
                                <tr className="text-sm text-[#8B8B8B]">
                                    <th className="w-1/12 p-2"></th>
                                    <th className="w-4/12 p-2">NAME</th>
                                    <th className="w-3/12 p-2">STOCK</th>
                                    <th className="w-2/12 p-2">PRICE</th>
                                    <th className="w-2/12 p-2">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProductsData.map((product, index) => (
                                    <tr key={index} className="border-t border-gray-100">
                                        <td className="p-2 text-2xl">{product.photo}</td>
                                        <td className="p-2">{product.name}</td>
                                        <td className="p-2">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.stock === 'In Stock' ? 'bg-[#E1F3E1] text-[#11B981]' : 'bg-[#F9E2E2] text-[#E04040]'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-2">{product.price}</td>
                                        <td className="p-2 text-[#8B8B8B]">--</td>
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
