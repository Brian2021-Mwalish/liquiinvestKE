// src/features/auth/Login.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Shield, Sparkles, User, Lock, Mail, WifiOff, ArrowLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { API_BASE_URL } from "../../lib/api";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(8, "Min 8 characters").required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const handleLoginNavigation = async (access, refresh) => {
    try {
      // Store tokens immediately
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json"
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          // If profile fetch fails, still navigate but show warning
          console.warn("Profile fetch failed, proceeding with navigation");
          toast.error("Login successful but profile loading failed. Please refresh the page.");
          navigate("/client-dashboard");
          return;
        }

        const user = await res.json();
        localStorage.setItem("profile", JSON.stringify(user));

        // Navigate based on user role
        if (user.is_superuser) {
          navigate("/admin-dashboard");
        } else {
          navigate("/client-dashboard");
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.warn("Profile fetch timed out, proceeding with navigation");
          toast.error("Login successful but profile loading timed out. Please refresh the page.");
        } else {
          console.error("Profile fetch error:", fetchError);
          toast.error("Login successful but profile loading failed. Please refresh the page.");
        }
        // Still navigate even if profile fetch fails
        navigate("/client-dashboard");
      }
    } catch (err) {
      console.error("Login navigation error:", err);
      toast.error("Login failed: " + err.message);
    }
  };

  const onSubmit = async (data) => {
    if (!isOnline) {
      toast.error("You are offline");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        // Show all error messages if available, else fallback to detail or generic message
        if (result.errors) {
          const messages = Object.values(result.errors)
            .flat()
            .join(", ");
          toast.error(messages);
        } else if (result.detail) {
          toast.error(result.detail);
        } else if (result.message) {
          toast.error(result.message);
        } else {
          toast.error("Login failed");
        }
        return;
      }
      toast.success("Login successful ✅");
      await handleLoginNavigation(result.access, result.refresh);
    } catch (err) {
      toast.error("Server error: " + err.message);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const result = await res.json();
      if (!res.ok) {
        // Show all error messages if available, else fallback to detail or generic message
        if (result.errors) {
          const messages = Object.values(result.errors)
            .flat()
            .join(", ");
          toast.error(messages);
        } else if (result.detail) {
          toast.error(result.detail);
        } else if (result.message) {
          toast.error(result.message);
        } else {
          toast.error("Google login failed");
        }
        return;
      }
      toast.success("Google login successful ✅");
      await handleLoginNavigation(result.access, result.refresh);
    } catch (err) {
      toast.error("Server error: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-green-50 to-green-300 p-2 md:p-4">
      {/* Back Arrow at top left, outside the container */}
      <Link
        to="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-green-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-full shadow-lg hover:bg-green-600 transition z-50"
        style={{ textDecoration: "none" }}
      >
        <ArrowLeft size={20} className="md:w-6 md:h-6" />
        <span className="font-semibold text-sm md:text-base">Back to Home</span>
      </Link>

      {/* Two-column layout */}
      <div className="flex h-full">
        {/* Left Side: Descriptive Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <Sparkles className="text-white w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold text-green-900 mb-4 animate-slide-up">
                Welcome to LiquiInvest KE
              </h1>
              <p className="text-lg text-green-700 mb-6 animate-slide-up-delayed">
                Kenya's Premier Investment Revolution
              </p>
            </div>

            <div className="space-y-6 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-4 animate-slide-in-left">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Guaranteed 100% Returns</h3>
                  <p className="text-green-700 text-sm">Double your money in just 20 days with our revolutionary investment model.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 animate-slide-in-left-delayed">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1">M-Pesa Instant Deposits</h3>
                  <p className="text-green-700 text-sm">Seamless mobile money integration - deposit and withdraw with ease.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 animate-slide-in-left-delayed-2">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Bank-Level Security</h3>
                  <p className="text-green-700 text-sm">256-bit encryption and CBK regulation ensure your investments are safe.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 animate-slide-in-left-delayed-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Earn by Referring</h3>
                  <p className="text-green-700 text-sm">Share with friends and earn 50% commission on their investments.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full animate-pulse">
                <span className="text-green-800 font-semibold">10,000+ Happy Investors</span>
                <span className="text-2xl">🇰🇪</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-green-50 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-6 space-y-4 md:space-y-6 border-2 border-green-600 relative animate-fade-in">
        {/* Header */}
        <div className="text-center mt-6 md:mt-8">
          <div className="flex justify-center items-center gap-2">
            <Shield className="text-green-900 animate-pulse w-5 h-5 md:w-6 md:h-6" />
            <h2 className="text-xl md:text-2xl font-bold text-green-900">Sign In</h2>
            <Sparkles className="text-green-700 animate-bounce w-4 h-4 md:w-5 md:h-5" />
          </div>
          <p className="text-green-700 text-xs md:text-sm">Access your Liquidity account</p>
        </div>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error("Google login failed")}
          useOneTap
          size="large"
          width="100%"
        />
        <div className="flex items-center">
          <div className="flex-grow border-t border-green-300"></div>
          <span className="px-2 text-xs text-green-700">or</span>
          <div className="flex-grow border-t border-green-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-green-900 flex items-center gap-1">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter email"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 text-sm ${
                errors.email ? "border-red-400 bg-red-50" : "border-green-300 bg-green-50"
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-green-900 flex items-center gap-1">
              <Lock size={14} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 text-sm ${
                errors.password ? "border-red-400 bg-red-50" : "border-green-300 bg-green-50"
              }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-green-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-xs text-green-900 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isOnline}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-green-600 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {!isOnline ? <WifiOff size={16} /> : <User size={16} />}
            {isSubmitting ? "Signing in..." : !isOnline ? "Offline" : "Sign In"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-green-700">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-900 hover:underline font-medium">
            Register here
          </Link>
        </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        .animate-slide-up-delayed {
          animation: slide-up 1s ease-out 0.2s both;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        .animate-slide-in-left-delayed {
          animation: slide-in-left 0.8s ease-out 0.2s both;
        }
        .animate-slide-in-left-delayed-2 {
          animation: slide-in-left 0.8s ease-out 0.4s both;
        }
        .animate-slide-in-left-delayed-3 {
          animation: slide-in-left 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
};

export default Login;
