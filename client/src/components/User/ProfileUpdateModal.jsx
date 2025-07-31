import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast } from "react-hot-toast";
import useAxios from "../../Hooks/useAxios";

const ProfileUpdateModal = ({ user, onClose }) => {
    const axiosInstance = useAxios();

    const [name, setName] = useState(user.name || "");
    const [profileImage, setProfileImage] = useState(user.profileImage || "");
    const [newPhotoFile, setNewPhotoFile] = useState(null);
    const [phone, setPhone] = useState(user.phone || "");
    const [address, setAddress] = useState(
        user.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        }
    );

    const [hasChanges, setHasChanges] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Clean up preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (newPhotoFile && profileImage) {
                URL.revokeObjectURL(profileImage);
            }
        };
    }, [newPhotoFile, profileImage]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (newPhotoFile && profileImage) {
                URL.revokeObjectURL(profileImage);
            }
            const previewURL = URL.createObjectURL(file);
            setProfileImage(previewURL);
            setNewPhotoFile(file);
            setHasChanges(true);
        }
    };

    const handlePhotoCancel = () => {
        if (newPhotoFile && profileImage) {
            URL.revokeObjectURL(profileImage);
        }
        setProfileImage(user.profileImage || "");
        setNewPhotoFile(null);
        setHasChanges(true);
    };

    const handleSave = async () => {
        // ✅ Validate BD phone number
        const bdPhoneRegex = /^(?:\+8801|01)[0-9]{9}$/;
        if (!bdPhoneRegex.test(phone.trim())) {
            setPhoneError(
                "Invalid BD phone number. Must start with +8801 or 01 and have 11 digits."
            );
            return;
        }
        setPhoneError("");
        setIsSaving(true);

        let finalProfileImage = profileImage;

        // ✅ Upload image if changed
        if (newPhotoFile) {
            const formData = new FormData();
            formData.append("image", newPhotoFile);
            try {
                const res = await axiosInstance.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMMGBB_API_KEY}`,
                    formData
                );
                finalProfileImage = res.data.data.url;
            } catch (err) {
                console.error("Image upload error:", err);
                toast.error("Image upload failed");
                setIsSaving(false);
                return;
            }
        }

        // ✅ Send PUT request to update user
        try {
            const res = await axiosInstance.put(`/user/${user.email}`, {
                name: name.trim(),
                profileImage: finalProfileImage,
                phone: phone.trim(),
                address,
            });

            if (res.data.modifiedCount > 0 || res.data.upsertedCount > 0) {
                toast.success("Profile updated!");
                setHasChanges(false);
                onClose();
            } else {
                toast.error("Nothing was updated. Try changing some info first.");
            }
        } catch (err) {
            console.error("Update error:", err);
            toast.error("Update failed. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (newPhotoFile && profileImage) {
            URL.revokeObjectURL(profileImage);
        }
        setName(user.name || "");
        setProfileImage(user.profileImage || "");
        setNewPhotoFile(null);
        setPhone(user.phone || "");
        setAddress(
            user.address || {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
            }
        );
        setHasChanges(false);
        setPhoneError("");
    };

    return (
        <dialog open className="modal modal-open">
            <div className="modal-box w-full max-w-2xl">
                <div className="flex items-center mb-4 gap-4">
                    <button className="btn p-2" onClick={onClose} disabled={isSaving}>
                        <IoMdArrowRoundBack className="w-6 h-6" />
                    </button>
                    <div>
                        <h3 className="text-xl font-bold">Update Profile</h3>
                        <p className="text-sm text-gray-500">
                            Modify your account information
                        </p>
                    </div>
                </div>

                {/* Image */}
                <div className="bg-gradient-to-r from-orange-400 to-primary text-white p-4 rounded-lg mb-6 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white mt-4 relative">
                        <img
                            src={profileImage || "https://i.ibb.co/hFx3tmn/download.png"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex justify-center gap-4 items-center">
                        <label className="btn btn-sm btn-info mt-2 cursor-pointer">
                            📷 Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                                disabled={isSaving}
                            />
                        </label>
                        {newPhotoFile && (
                            <button
                                onClick={handlePhotoCancel}
                                className="btn btn-sm btn-outline mt-2"
                                disabled={isSaving}
                            >
                                ✖ Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-semibold">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setHasChanges(true);
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F85606]"
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setHasChanges(true);
                            }}
                            placeholder="+8801XXXXXXXXX"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F85606]"
                            disabled={isSaving}
                        />
                        {phoneError && (
                            <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold">Street</label>
                        <input
                            type="text"
                            value={address.street}
                            onChange={(e) => {
                                setAddress({ ...address, street: e.target.value });
                                setHasChanges(true);
                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F85606]"
                            disabled={isSaving}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-semibold">City</label>
                            <input
                                type="text"
                                value={address.city}
                                onChange={(e) => {
                                    setAddress({ ...address, city: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F85606]"
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-semibold">State</label>
                            <input
                                type="text"
                                value={address.state}
                                onChange={(e) => {
                                    setAddress({ ...address, state: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F85606]"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-semibold">
                                Zip Code
                            </label>
                            <input
                                type="text"
                                value={address.zipCode}
                                onChange={(e) => {
                                    setAddress({ ...address, zipCode: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F85606]"
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-semibold">
                                Country
                            </label>
                            <input
                                type="text"
                                value={address.country}
                                onChange={(e) => {
                                    setAddress({ ...address, country: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#F85606]"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    {hasChanges && (
                        <div className="alert alert-info shadow-sm text-xs">
                            You have unsaved changes
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`btn btn-primary flex-1 ${isSaving ? "loading" : ""}`}
                    >
                        ✔ Save Changes
                    </button>
                    <button
                        onClick={handleReset}
                        className="btn flex-1"
                        disabled={isSaving}
                    >
                        ✖ Reset
                    </button>
                </div>

                <p
                    className="text-center text-xs mt-4 underline cursor-pointer"
                    onClick={onClose}
                >
                    Cancel and go back to profile
                </p>

                <div className="bg-white p-4 rounded-lg shadow mt-4 text-sm">
                    <h4 className="font-semibold mb-2">Profile Image Guidelines</h4>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Supported formats: JPG, PNG, GIF, WebP</li>
                        <li>Maximum file size: 5MB</li>
                        <li>Recommended dimensions: 400x400 pixels</li>
                        <li>Square images work best for profile pictures</li>
                    </ul>
                </div>
            </div>
        </dialog>
    );
};

export default ProfileUpdateModal;
