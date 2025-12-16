"use client";
import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaGoogle } from 'react-icons/fa';

interface LoginPageProps {
    onLoginSuccess: () => void; // thêm prop này
}

interface InputProps {
    type: string;
    placeholder: string;
    icon: React.ReactNode;
}

const CustomInput: React.FC<InputProps> = ({ type, placeholder, icon }) => (
    <div className="flex items-center bg-gray-100 p-3 rounded-md mb-4">
        <div className="text-gray-400 mr-3">{icon}</div>
        <input
            className="bg-transparent outline-none flex-grow text-gray-700"
            type={type}
            placeholder={placeholder}
        />
    </div>
);

const SocialIcon: React.FC<{ icon: React.ReactNode; onClick: () => void }> = ({ icon, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center w-10 h-10 border border-gray-300 text-gray-500 rounded-full hover:bg-gray-100 transition duration-300"
    >
        {icon}
    </button>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const primaryColor = 'bg-[#38A169]';

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="flex w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden bg-white">

                {/* LEFT PANEL: Sign In */}
                <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
                    <div className="text-gray-700 text-lg font-semibold mb-8">CompanyName</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign in to Account</h2>

                    <div className="flex space-x-4 mb-8">
                        <SocialIcon icon={<FaFacebookF />} onClick={onLoginSuccess} />
                        <SocialIcon icon={<FaLinkedinIn />} onClick={onLoginSuccess} />
                        <SocialIcon icon={<FaGoogle />} onClick={onLoginSuccess} />
                    </div>

                    <p className="text-gray-500 mb-4 text-center">or use your email account</p>

                    <form className="w-full" onSubmit={e => { e.preventDefault(); onLoginSuccess(); }}>
                        <CustomInput type="email" placeholder="Email" icon={<FaGoogle />} />
                        <CustomInput type="password" placeholder="Password" icon={<FaGoogle />} />
                        <div className="flex justify-between items-center text-sm mb-6">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-gray-600">Remember me</label>
                            </div>
                            <a href="#" className="text-gray-500 hover:text-green-600 font-semibold">Forgot Password?</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-6 py-3 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                {/* RIGHT PANEL */}
                <div className={`hidden lg:flex lg:w-1/2 p-12 ${primaryColor} text-white flex-col justify-center items-center text-center`}>
                    <h2 className="text-4xl font-extrabold mb-4">Hello, Friend!</h2>
                    <p className="text-lg mb-8 max-w-xs">
                        Fill up personal information and start journey with us.
                    </p>
                    <button className="px-10 py-3 font-semibold text-white border-2 border-white rounded-full hover:bg-white hover:text-green-600 transition duration-300">
                        Sign Up
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
