import React, { useState } from "react";
import ProfileUpdateModal from "../../../components/User/ProfileUpdateModal";
import { MdVerifiedUser } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";

const UserProfile = () => {
    const { user } = useAuth();
    console.log("user profile", user);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "N/A";

    const lastLogin = user?.lastLogin
        ? new Date(user.lastLogin).toLocaleDateString()
        : "N/A";

    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 md:py-0">
            <h1 className="text-4xl font-bold pb-2 text-primary">My Profile</h1>
            <p className="text-gray-500 text-md pb-4">Manage account information and preferences</p>
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Top Banner */}
                <div className="bg-gradient-to-r from-orange-400 bg-primary p-6 flex items-center gap-4">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={user?.profileImage || "https://i.ibb.co/hFx3tmn9/download.png"}
                            alt={user?.name || "N/A"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white">
                        <h2 className="text-4xl font-bold flex items-center gap-2 mb-1">
                            {user?.name || "N/A"}
                            {user?.isVerified && <MdVerifiedUser />}
                        </h2>
                        <p>{user?.role || "N/A"}</p>
                        <p className="text-lg">Member since {memberSince}</p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-6 gap-6">
                    <h3 className="font-bold mb-2">📌 Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Email Address</p>
                            <p>{user?.email || "N/A"}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Full Name</p>
                            <p>{user?.name || "N/A"}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Phone Number</p>
                            <p>{user?.phone || "N/A"}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded mb-">
                            <p className="font-medium">Address</p>
                            <p>
                                {user?.address
                                    ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""} ${user.address.zipCode || ""}, ${user.address.country || ""}`
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    <h3 className="font-bold my-2 mt-2">⏰ Account Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Last Login</p>
                            <p>{lastLogin}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <p className="font-medium">Account Created</p>
                            <p>{memberSince}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl shadow ">
                            <p className="font-semibold">Account Type</p>
                            <p>{user?.role || "N/A"}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl shadow ">
                            <p className="font-semibold">Member For</p>
                            <p>
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

                <div className="px-6 pb-6">
                    <button
                        className="btn btn-primary w-full"
                        onClick={() => setIsUpdateOpen(true)}
                    >
                        ✏️ Edit Profile
                    </button>
                </div>

                {isUpdateOpen && (
                    <ProfileUpdateModal
                        user={user}
                        onClose={() => setIsUpdateOpen(false)}
                        onSave={(updatedData) => {
                            console.log("Save to backend:", updatedData);
                            // TODO: Call API mutation here!
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default UserProfile;
