import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";

const Login = () => {
  const { loginUser, googleLogin, refetchUserData } = useAuth();
  const axiosInstance = useAxios();
  const [showPass, setShowPass] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      const result = await loginUser(email, password);
      if (result.user) {
        toast.success("User logged in successfully");
        navigate(location?.state || "/");
      }
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();
      if (res?.user) {
        const profileInfo = {
          name: res.user.displayName,
          email: res.user.email,
          createdAt: new Date(),
          lastLogin: new Date(),
          isVerified: false,
          role: "user",
          address: {
            street: "string",
            city: "string",
            state: "string",
            zipCode: "string",
            country: "string",
          },
          phone: "string",
        };
        console.log(profileInfo);
        // await axiosInstance.post("/register", profileInfo);
        // await refetchUserData();
        toast.success("Logged in with Google");
        navigate(location?.state || "/");
      }
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="relative max-w-md w-full mx-auto border-2 border-primary/20 rounded-2xl shadow-lg p-8 flex flex-col items-center my-3">
      {/* Cross (×) Button to go back to home */}
      <Link
        to="/"
        className="absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl font-bold"
        aria-label="Close and go to home"
      >
        &times;
      </Link>

      <h2 className="text-2xl font-bold text-primary mb-6">Login to Buy Nex</h2>

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
          required
        />

        <div className="mb-4 relative">
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 bottom-3 cursor-pointer text-gray-500"
          >
            {showPass ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            name="password"
            defaultValue={"123456Aa@"}
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary cursor-pointer text-white font-bold py-3 rounded-lg mt-2"
        >
          Login
        </button>
      </form>

      <div className="my-4 w-full flex items-center">
        <div className="flex-1 h-px bg-primary/20"></div>
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-primary/20"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full cursor-pointer flex items-center justify-center gap-3 border border-primary/30 py-3 rounded-lg font-semibold text-primary"
      >
        <FcGoogle className="text-2xl" />
        Continue with Google
      </button>

      <p className="mt-6 text-sm">
        Don't have an account?{" "}
        <Link
          state={location.state}
          to="/auth/register"
          className="text-primary font-semibold"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
