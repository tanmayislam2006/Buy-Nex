import React, { useState } from "react";
import ProfileUpdateModal from "../../../components/User/ProfileUpdateModal";
import { MdVerifiedUser } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";

const UserProfile = () => {
    const { user } = useAuth();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "N/A";

    const lastLogin = user?.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "N/A";

    return (
        <section className="flex flex-col items-center justify-center py-16 md:py-0">
            <h1 className="text-4xl font-bold pb-2 text-primary">My Profile</h1>
            <p className="text-gray-500 text-md pb-4 text-center">Manage account information and preferences</p>
            <div className="max-w-4xl w-full bg-white rounded-2xl  overflow-hidden">
                {/* Banner */}
                <div className="bg-gradient-to-r from-primary to-orange-400 p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                            src={user?.profileImage || "https://i.ibb.co/hFx3tmn/download.png"}
                            alt={user?.name || "Profile"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white text-center md:text-left">
                        <h2 className="text-xl md:text-4xl font-bold flex items-center gap-2">
                            {user?.name || "N/A"}
                            {user?.isVerified && <MdVerifiedUser className="text-green-200" />}
                        </h2>
                        <p className="text-sm md:text-base">{user?.role || "N/A"}</p>
                        <p className="text-sm md:text-base">Member since {memberSince}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-8 space-y-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">📌 Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Email Address</p>
                                <p className="font-semibold">{user?.email || "N/A"}</p>
                            </div>
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Full Name</p>
                                <p className="font-semibold">{user?.name || "N/A"}</p>
                            </div>
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                                <p className="font-semibold">{user?.phone || "N/A"}</p>
                            </div>
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Address</p>
                                <p className="font-semibold">
                                    {user?.address
                                        ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""} ${user.address.zipCode || ""}, ${user.address.country || ""}`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">⏰ Account Activity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Last Login</p>
                                <p className="font-semibold">{lastLogin}</p>
                            </div>
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Account Created</p>
                                <p className="font-semibold">{memberSince}</p>
                            </div>
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Account Type</p>
                                <p className="font-semibold">{user?.role || "N/A"}</p>
                            </div>
                            <div className="bg-gray-100 p-5 rounded-xl shadow-sm">
                                <p className="text-gray-500 text-sm mb-1">Member For</p>
                                <p className="font-semibold">
                                    {user?.createdAt
                                        ? `${Math.floor(
                                            (new Date() - new Date(user.createdAt)) /
                                            (1000 * 60 * 60 * 24)
                                        )} days`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => setIsUpdateOpen(true)}
                            className="btn btn-primary w-full py-3 text-lg shadow-md"
                        >
                            ✏️ Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {isUpdateOpen && (
                <ProfileUpdateModal
                    user={user}
                    onClose={() => setIsUpdateOpen(false)}
                />
            )}
        </section>
    );
};

export default UserProfile;
