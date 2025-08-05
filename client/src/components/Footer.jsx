import React from 'react';
import MainLogo from '../shared/MainLogo';
import { Link } from 'react-router';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#181e28] text-[#b0bac3] px-6 md:px-8 leading-16 xl:px-20 py-10">

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 py-6">

                <div className="space-y-4">
                    <MainLogo />
                    <p className="text-sm leading-relaxed text-[#8996a5]">
                        The BuyNex is the biggest market of grocery products. Get your daily needs from our store.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-semibold text-gray-300 border-b border-dashed border-gray-600 pb-2 mb-4">
                        Category
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="#">Fashion</Link></li>
                        <li><Link to="#">Cosmetics</Link></li>
                        <li><Link to="#">Bags & Purse</Link></li>
                        <li><Link to="#">Shoes</Link></li>
                        <li><Link to="#">Belts</Link></li>
                        <li><Link to="#">Perfumes</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-semibold text-gray-300 border-b border-dashed border-gray-600 pb-2 mb-4">
                        Company
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="#">About us</Link></li>
                        <li><Link to="#">Delivery</Link></li>
                        <li><Link to="#">Secure payment</Link></li>
                        <li><Link to="#">Terms of use</Link></li>
                        <li><Link to="#">Legal Notice</Link></li>
                        <li><Link to="#">Contact us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-semibold text-gray-300 border-b border-dashed border-gray-600 pb-2 mb-4">
                        Account
                    </h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="#">Sign In</Link></li>
                        <li><Link to="#">View Cart</Link></li>
                        <li><Link to="#">Return Policy</Link></li>
                        <li><Link to="#">Become a Vendor</Link></li>
                        <li><Link to="#">Affiliate Program</Link></li>
                        <li><Link to="#">Payments</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-xl font-semibold text-gray-300 border-b border-dashed border-gray-600 pb-2 mb-4">
                        Contact
                    </h4>
                    <ul className="space-y-4 text-sm text-[#b0bac3]">
                        <li className="flex gap-3 items-start">
                            <FaMapMarkerAlt className="text-lg mt-1 text-gray-400" />
                            <span>1234 Elm Street, Springfield, IL 62704 USA</span>
                        </li>
                        <li className="flex gap-3 items-center">
                            <FaPhoneAlt className="text-lg text-gray-400" />
                            <a href="tel:+009876543210" className="hover:text-white transition">
                                +00 9876543210
                            </a>
                        </li>
                        <li className="flex gap-3 items-center">
                            <FaEnvelope className="text-lg text-gray-400" />
                            <a href="mailto:example@email.com" className="hover:text-white transition">
                                example@email.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between border-t border-gray-700 pt-4 gap-4">
                <span className="text-sm text-gray-400">
                    © {new Date().getFullYear()} The BuyNex. All rights reserved.
                </span>
                <div className="flex flex-wrap items-center gap-3">
                    {[
                        'visa', 'mastercard', 'amex', 'discover', 'jcb', 'unionpay', 'maestro'
                    ].map(method => (
                        <img
                            key={method}
                            src={`https://img.icons8.com/color/48/000000/${method}.png`}
                            alt={method}
                            className="w-10 h-auto"
                        />
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
