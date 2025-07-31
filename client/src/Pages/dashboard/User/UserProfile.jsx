import React, { useState } from "react";
import ProfileUpdateModal from "../../../components/User/ProfileUpdateModal";


// Example static user data
const user = {
    name: "Teegan Emerson",
    profileImage: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
    email: "1234@56.com",
    createdAt: "2025-07-30T03:10:00Z",
    lastLogin: "2025-07-30T03:10:00Z",
    isVerified: true,
    role: "Standard User",
    address: {
        street: "123 Main St",
        city: "Dhaka",
        state: "BD",
        zipCode: "1207",
        country: "Bangladesh",
    },
    phone: "+8801XXXXXXXXX",
};


// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// const fetchUserProfile = async () => {
//   const res = await axios.get("/api/user/profile"); // Your real API
//   return res.data;
// };

const UserProfile = () => {
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    console.log("user profile");
    //   const { data: user, isLoading, error } = useQuery({
    //     queryKey: ["userProfile"],
    //     queryFn: fetchUserProfile,
    //   });

    //   if (isLoading) return <div className="text-center p-10">Loading...</div>;
    //   if (error) return <div className="text-center p-10 text-red-500">Error loading profile.</div>;

    const memberSince = new Date(user.createdAt).toLocaleDateString();
    const lastLogin = new Date(user.lastLogin).toLocaleString();

    return (
        <div className="flex flex-col items-center justify-center  px-4 py-16 md:py-0">
            <h1 className="text-4xl font-bold pb-2 text-primary">My Profile</h1>
            <p className="text-gray-500 text-md pb-4">Manage account information and preferences</p>
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Top Banner */}
                <div className="bg-gradient-to-r from-orange-400 bg-primary p-6 flex items-center gap-4">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={user.profileImage || "https://via.placeholder.com/150"}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-white">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p>{user.role}</p>
                        <p className="text-sm">Member since {memberSince}</p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-6 gap-6">
                    {/* Left Column */}
                    <h3 className="font-bold mb-2">📌 Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Email Address</p>
                            <p>{user.email}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Full Name</p>
                            <p>{user.name}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Phone Number</p>
                            <p>{user.phone}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded mb-">
                            <p className="font-medium">Address</p>
                            <p>
                                {user.address.street}, {user.address.city}, {user.address.state}{" "}
                                {user.address.zipCode}, {user.address.country}
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <h3 className="font-bold my-2 mt-2">⏰ Account Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="bg-gray-100 p-4 rounded mb-2">
                            <p className="font-medium">Last Login</p>
                            <p>{lastLogin}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <p className="font-medium">Account Created</p>
                            <p>{new Date(user.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl shadow ">
                            <p className="font-semibold">Account Type</p>
                            <p>{user.role}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl shadow ">
                            <p className="font-semibold">Member For</p>
                            <p>
                                {Math.floor(
                                    (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
                                )}{" "}
                                days
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl shadow ">
                            <p className="font-semibold">Status</p>
                            <p>{user.isVerified ? "Verified" : "Not Verified"}</p>
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

            {/* Bottom Info Cards */}
            {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <p className="font-semibold">Account Type</p>
                    <p>{user.role}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <p className="font-semibold">Member For</p>
                    <p>
                        {Math.floor(
                            (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <p className="font-semibold">Status</p>
                    <p>{user.isVerified ? "Verified" : "Not Verified"}</p>
                </div>
            </div> */}
        </div>
    );
};

export default UserProfile;

