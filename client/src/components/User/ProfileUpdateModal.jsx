import React, { useState } from "react";

const ProfileUpdateModal = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [profileImage, setProfileImage] = useState(user.profileImage);
    const [phone, setPhone] = useState(user.phone || "");
    const [address, setAddress] = useState(user.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [phoneError, setPhoneError] = useState("");

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setProfileImage(previewURL);
            setHasChanges(true);
        }
    };

    const handleSave = () => {
        // ✅ Simple BD phone validation: +8801XXXXXXXXX or 01XXXXXXXXX
        const bdPhoneRegex = /^(?:\+8801|01)[0-9]{9}$/;
        if (!bdPhoneRegex.test(phone)) {
            setPhoneError("Invalid BD phone number. Must start with +8801 or 01 and have 11 digits.");
            return;
        }
        setPhoneError("");

        onSave({
            name,
            profileImage,
            phone,
            address,
        });
        setHasChanges(false);
        onClose();
    };

    const handleReset = () => {
        setName(user.name);
        setProfileImage(user.profileImage);
        setPhone(user.phone || "");
        setAddress(user.address || {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        });
        setHasChanges(false);
        setPhoneError("");
    };

    return (
        <dialog open className="modal modal-open">
            <div className="modal-box w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-1">Update Profile</h3>
                <p className="text-sm mb-4 text-gray-500">Modify your account information</p>

                {/* Banner */}
                <div className="bg-gradient-to-r from-orange-400 to-primary text-white p-4 rounded-lg mb-6 text-center">
                    <p className="font-semibold">{user.role}</p>
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white mt-4">
                        <img
                            src={profileImage || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <label className="btn btn-sm btn-info mt-2 cursor-pointer">
                        📷 Change Photo
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setHasChanges(true); }}
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="label">
                            <span className="label-text">Email Address</span>
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setHasChanges(true); }}
                            className="input input-bordered w-full"
                            placeholder="+8801XXXXXXXXX"
                        />
                        {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="label">
                            <span className="label-text">Street</span>
                        </label>
                        <input
                            type="text"
                            value={address.street}
                            onChange={(e) => { setAddress({ ...address, street: e.target.value }); setHasChanges(true); }}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">City</span>
                            </label>
                            <input
                                type="text"
                                value={address.city}
                                onChange={(e) => { setAddress({ ...address, city: e.target.value }); setHasChanges(true); }}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">State</span>
                            </label>
                            <input
                                type="text"
                                value={address.state}
                                onChange={(e) => { setAddress({ ...address, state: e.target.value }); setHasChanges(true); }}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Zip Code</span>
                            </label>
                            <input
                                type="text"
                                value={address.zipCode}
                                onChange={(e) => { setAddress({ ...address, zipCode: e.target.value }); setHasChanges(true); }}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Country</span>
                            </label>
                            <input
                                type="text"
                                value={address.country}
                                onChange={(e) => { setAddress({ ...address, country: e.target.value }); setHasChanges(true); }}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    {/* Unsaved */}
                    {hasChanges && (
                        <div className="alert alert-info shadow-sm text-xs">
                            You have unsaved changes
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                    <button onClick={handleSave} className="btn btn-primary flex-1">
                        ✔ Save Changes
                    </button>
                    <button onClick={handleReset} className="btn flex-1">
                        ✖ Reset
                    </button>
                </div>

                <p className="text-center text-xs mt-4 underline cursor-pointer" onClick={onClose}>
                    Cancel and go back to profile
                </p>

                {/* Guidelines */}
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
