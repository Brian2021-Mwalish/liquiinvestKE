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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleLoginNavigation = async (access, refresh) => {
    try {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

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
          console.warn("Profile fetch failed, proceeding with navigation");
          toast.error("Login successful but profile loading failed. Please refresh the page.");
          navigate("/client-dashboard");
          return;
        }

        const user = await res.json();
        localStorage.setItem("profile", JSON.stringify(user));

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
        navigate("/client-dashboard");
      }
    } catch (err) {
      console.error("Login navigation error:", err);
      toast.error("Login failed: " + err.message);
    }
  };

  const onSubmit = async (data) => {
    if (!isOnline) {
      toast.error("You are offline. Please check your connection.");
      return;
    }

    const loaderTimeout = setTimeout(() => setIsLoggingIn(true), 500);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      clearTimeout(loaderTimeout);
      setIsLoggingIn(false);

      if (!res.ok) {
        if (result.errors) {
          const messages = Object.values(result.errors).flat().join(", ");
          toast.error(messages);
        } else if (result.detail) {
          toast.error(result.detail);
        } else if (result.message) {
          toast.error(result.message);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
        return;
      }

      toast.success("Login successful! Redirecting...");
      await handleLoginNavigation(result.access, result.refresh);
    } catch (err) {
      clearTimeout(loaderTimeout);
      setIsLoggingIn(false);
      toast.error("Connection error. Please try again.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const loaderTimeout = setTimeout(() => setIsGoogleLoggingIn(true), 500);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const result = await res.json();
      
      clearTimeout(loaderTimeout);
      setIsGoogleLoggingIn(false);

      if (!res.ok) {
        if (result.errors) {
          const messages = Object.values(result.errors).flat().join(", ");
          toast.error(messages);
        } else if (result.detail) {
          toast.error(result.detail);
        } else if (result.message) {
          toast.error(result.message);
        } else {
          toast.error("Google login failed. Please try again.");
        }
        return;
      }

      toast.success("Google login successful! Redirecting...");
      await handleLoginNavigation(result.access, result.refresh);
    } catch (err) {
      clearTimeout(loaderTimeout);
      setIsGoogleLoggingIn(false);
      toast.error("Connection error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F5D4E] p-3 sm:p-4 md:p-6 page-transition">
      {/* Back Arrow */}
      <Link
        to="/"
        className="fixed top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 flex items-center gap-1.5 sm:gap-2 bg-[#0A3D32] text-white px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full shadow-lg hover:bg-[#083028] transition z-50 text-xs sm:text-sm md:text-base"
        style={{ textDecoration: "none" }}
      >
        <ArrowLeft size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <span className="font-semibold hidden xs:inline">Back to Home</span>
        <span className="font-semibold xs:hidden">Back</span>
      </Link>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] gap-4 md:gap-6">
        {/* Left Side: Descriptive Content */}
        <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="text-center w-full max-w-lg animate-fade-in">
            <div className="mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0A3D32] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce shadow-lg">
                <Sparkles className="text-white w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 animate-slide-up">
                Welcome to LiquiInvest KE
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#A8E6CF] mb-4 sm:mb-6 animate-slide-up-delayed">
                Kenya's Premier Investment Revolution
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3 sm:space-x-4 animate-slide-in-left bg-[#0A3D32]/30 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0A3D32] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Guaranteed 100% Returns</h3>
                  <p className="text-[#A8E6CF] text-xs sm:text-sm">Double your money in just 20 days with our revolutionary investment model.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 animate-slide-in-left-delayed bg-[#0A3D32]/30 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0A3D32] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm sm:text-base">M-Pesa Instant Deposits</h3>
                  <p className="text-[#A8E6CF] text-xs sm:text-sm">Seamless mobile money integration - deposit and withdraw with ease.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 animate-slide-in-left-delayed-2 bg-[#0A3D32]/30 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0A3D32] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <Lock className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Bank-Level Security</h3>
                  <p className="text-[#A8E6CF] text-xs sm:text-sm">256-bit encryption and CBK regulation ensure your investments are safe.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4 animate-slide-in-left-delayed-3 bg-[#0A3D32]/30 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0A3D32] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mail className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 text-sm sm:text-base">Earn by Referring</h3>
                  <p className="text-[#A8E6CF] text-xs sm:text-sm">Share with friends and earn 50% commission on their investments.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-[#0A3D32] px-3 py-2 sm:px-4 sm:py-2 rounded-full animate-pulse shadow-lg">
                <span className="text-white font-semibold text-xs sm:text-sm md:text-base">10,000+ Happy Investors</span>
                <span className="text-xl sm:text-2xl">🇰🇪</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 border-4 border-[#0F5D4E] relative animate-fade-in">
            {/* Header */}
            <div className="text-center pt-2 sm:pt-4">
              <div className="flex justify-center items-center gap-2">
                <Shield className="text-[#0F5D4E] animate-pulse w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F5D4E]">Sign In</h2>
                <Sparkles className="text-[#0F5D4E] animate-bounce w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-[#0F5D4E] text-xs sm:text-sm mt-1">Access your investment account</p>
            </div>

            {/* Google Login */}
            <div className="relative">
              {isGoogleLoggingIn && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0F5D4E] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#0F5D4E] text-sm font-medium">Signing in...</span>
                  </div>
                </div>
              )}
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
                useOneTap
                size="large"
                width="100%"
              />
            </div>

            <div className="flex items-center">
              <div className="flex-grow border-t border-[#0F5D4E]/30"></div>
              <span className="px-2 text-xs text-[#0F5D4E]">or</span>
              <div className="flex-grow border-t border-[#0F5D4E]/30"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#0F5D4E] flex items-center gap-1 mb-1">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  className={`w-full px-3 py-2 sm:py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#0F5D4E] focus:outline-none text-sm ${
                    errors.email ? "border-red-400 bg-red-50" : "border-[#0F5D4E]/40 bg-white"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#0F5D4E] flex items-center gap-1 mb-1">
                  <Lock size={14} /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className={`w-full px-3 py-2 sm:py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#0F5D4E] focus:outline-none text-sm pr-10 ${
                      errors.password ? "border-red-400 bg-red-50" : "border-[#0F5D4E]/40 bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-[#0F5D4E] hover:text-[#0A3D32]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-xs text-[#0F5D4E] hover:text-[#0A3D32] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn || !isOnline}
                className="w-full bg-[#0F5D4E] text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A3D32] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : !isOnline ? (
                  <>
                    <WifiOff size={16} />
                    <span>You're Offline</span>
                  </>
                ) : (
                  <>
                    <User size={16} />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-xs sm:text-sm text-[#0F5D4E]">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0F5D4E] hover:text-[#0A3D32] hover:underline font-semibold">
                Create Account
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

        .page-transition {
          animation: fade-in 0.3s ease-in;
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