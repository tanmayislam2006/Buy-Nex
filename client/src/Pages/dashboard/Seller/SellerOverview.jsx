import React, { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../components/Loading';

const SellerOverview = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [sellerStats, setSellerStats] = useState(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.email) {
            setIsLoadingStats(true);
            axiosSecure.get(`/seller-stats?email=${user.email}`)
                .then(res => {
                    setSellerStats(res.data);
                    setIsLoadingStats(false);
                })
                .catch(err => {
                    console.error("Error fetching seller stats:", err);
                    setError("Failed to load seller statistics.");
                    setIsLoadingStats(false);
                });
        }
    }, [user, axiosSecure]);

    if (loading || isLoadingStats) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-center text-red-500 text-xl mt-8">{error}</div>;
    }

    const cardData = [
        { title: 'Total Products', value: sellerStats?.totalProducts || 0, icon: '📦' },
        { title: 'Total Orders', value: sellerStats?.totalOrders || 0, icon: '🛒' },
        { title: 'Pending Orders', value: sellerStats?.pendingOrders || 0, icon: '⏳' },
        { title: 'Total Sales', value: `${sellerStats?.totalSales?.toFixed(2) || 0}`, icon: '💰' },
    ];

    return (
        <div>
            <h3 className="text-3xl font-semibold">
                Welcome Back, <span className="text-primary">{user?.displayName}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {cardData.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="text-4xl">{card.icon}</div>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-600">{card.title}</h4>
                            <p className="text-3xl font-bold text-primary mt-2">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerOverview;