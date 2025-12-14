import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Lock, ArrowLeft, Sparkles, Shield, TrendingUp, Gift } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object().shape({
  full_name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .required("Please enter your full name"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

const Register = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const referralCode = searchParams.get("referral_code");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "Enter password", color: "#d1d5db" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    const levels = [
      { label: "Very Weak", color: "#ef4444" },
      { label: "Weak", color: "#f97316" },
      { label: "Fair", color: "#eab308" },
      { label: "Good", color: "#10b981" },
      { label: "Strong", color: "#059669" }
    ];
    return { strength, ...levels[Math.min(strength, 4)] };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const onSubmit = async (formData) => {
    const { confirmPassword, ...payload } = formData;
    if (referralCode) {
      payload.referral_code = referralCode;
    }
    try {
      const res = await fetch("https://liquiinvestke.co.ke/backend/api/auth/register/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        let errorMessages = [];
        const fieldErrorMap = {
          full_name: "Full Name",
          email: "Email Address",
          password: "Password"
        };
        if (typeof data === "object") {
          for (const [key, value] of Object.entries(data)) {
            const fieldName = fieldErrorMap[key] || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (Array.isArray(value)) {
              value.forEach((msg) => {
                const userFriendlyMsg = `${fieldName}: ${msg}`;
                errorMessages.push(userFriendlyMsg);
                setError(key, { type: "server", message: msg });
              });
            } else if (typeof value === "string") {
              const userFriendlyMsg = `${fieldName}: ${value}`;
              errorMessages.push(userFriendlyMsg);
              setError(key, { type: "server", message: value });
            }
          }
        } else if (typeof data === "string") {
          errorMessages.push(data);
        }
        if (errorMessages.length > 0) {
          errorMessages.forEach((msg, i) => {
            toast.error(msg, {
              id: `register-error-${i}`,
              duration: 5000,
              icon: <AlertCircle className="text-red-500" />
            });
          });
        } else {
          toast.error("Registration failed. Please check your information and try again.", {
            duration: 4000
          });
        }
        return;
      } else {
        setShowSuccessModal(true);
      }
    } catch (error) {
      const errorMessage = error.message || "We're experiencing technical difficulties. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
        icon: <AlertCircle className="text-red-500" />
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row relative overflow-hidden" style={{ backgroundColor: "#0F5D4E" }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: "#dbeafe", filter: "blur(100px)" }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: "#93c5fd", filter: "blur(100px)" }}></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-2 left-2 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full z-50 font-bold text-xs sm:text-sm transition-all duration-300 hover:gap-2 sm:hover:gap-3"
        style={{
          backgroundColor: "#ffffff",
          color: "#0F5D4E",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}
      >
        <ArrowLeft size={16} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
        <span>Back</span>
      </Link>

      {/* Left Side: Benefits Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6 xl:p-8 relative z-10">
        <div className="max-w-lg space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2" style={{ backgroundColor: "#ffffff" }}>
              <Sparkles className="w-8 h-8" style={{ color: "#0F5D4E" }} />
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Start Growing<br />Your Wealth Today
            </h1>
            <p className="text-lg font-medium" style={{ color: "#bfdbfe" }}>
              Join thousands of smart investors across Kenya
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-3 mt-8">
            <div className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-300 hover:translate-x-2" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
                <TrendingUp className="w-6 h-6" style={{ color: "#0F5D4E" }} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-0.5">100% Returns</h3>
                <p className="text-sm" style={{ color: "#bfdbfe" }}>Double your money in just 20 days</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-300 hover:translate-x-2" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
                <Shield className="w-6 h-6" style={{ color: "#0F5D4E" }} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-0.5">Bank-Level Security</h3>
                <p className="text-sm" style={{ color: "#bfdbfe" }}>Protected with military-grade encryption</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl transition-all duration-300 hover:translate-x-2" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
                <Gift className="w-6 h-6" style={{ color: "#0F5D4E" }} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-0.5">Referral Rewards</h3>
                <p className="text-sm" style={{ color: "#bfdbfe" }}>Earn bonuses by inviting friends</p>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#3b82f6", borderColor: "#0F5D4E" }}>
                  {i === 4 ? "+" : ""}
                </div>
              ))}
            </div>
            <span className="text-white font-bold text-base">10,000+ Investors</span>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-4 lg:p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Hero */}
          <div className="lg:hidden text-center mb-3 sm:mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-2" style={{ backgroundColor: "#ffffff" }}>
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: "#0F5D4E" }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Join LiquiInvest</h1>
            <p className="text-sm font-medium" style={{ color: "#bfdbfe" }}>Start your investment journey</p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl" style={{ backgroundColor: "#ffffff" }}>
            {/* Form Header */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2" style={{ backgroundColor: "#0F5D4E" }}>
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-0.5" style={{ color: "#0F5D4E" }}>Create Account</h2>
              <p className="text-gray-600 text-xs sm:text-sm">Fill in your details to get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs sm:text-sm" style={{ color: "#0F5D4E" }}>
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("full_name")}
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 border-2 rounded-lg sm:rounded-xl focus:outline-none text-sm transition-all duration-200"
                    style={{
                      borderColor: errors.full_name ? "#ef4444" : "#d1d5db",
                      backgroundColor: errors.full_name ? "#fee2e2" : "#f9fafb"
                    }}
                    placeholder="Enter your full name"
                  />
                  {!errors.full_name && watch("full_name") && (
                    <CheckCircle className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#0F5D4E" }} />
                  )}
                </div>
                {errors.full_name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs sm:text-sm" style={{ color: "#0F5D4E" }}>
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 border-2 rounded-lg sm:rounded-xl focus:outline-none text-sm transition-all duration-200"
                    style={{
                      borderColor: errors.email ? "#ef4444" : "#d1d5db",
                      backgroundColor: errors.email ? "#fee2e2" : "#f9fafb"
                    }}
                    placeholder="Enter your email"
                  />
                  {!errors.email && watch("email") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watch("email")) && (
                    <CheckCircle className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#0F5D4E" }} />
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Fields in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Password */}
                <div>
                  <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs sm:text-sm" style={{ color: "#0F5D4E" }}>
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 pr-9 border-2 rounded-lg sm:rounded-xl focus:outline-none text-sm transition-all duration-200"
                      style={{
                        borderColor: errors.password ? "#ef4444" : "#d1d5db",
                        backgroundColor: errors.password ? "#fee2e2" : "#f9fafb"
                      }}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#0F5D4E" }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Too weak
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs sm:text-sm" style={{ color: "#0F5D4E" }}>
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Confirm
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 pr-9 border-2 rounded-lg sm:rounded-xl focus:outline-none text-sm transition-all duration-200"
                      style={{
                        borderColor: errors.confirmPassword ? "#ef4444" : "#d1d5db",
                        backgroundColor: errors.confirmPassword ? "#fee2e2" : "#f9fafb"
                      }}
                      placeholder="Confirm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#0F5D4E" }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {!errors.confirmPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword && (
                      <CheckCircle className="absolute right-9 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: "#0F5D4E" }} />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      No match
                    </p>
                  )}
                </div>
              </div>

              {/* Password Strength - Compact */}
              {watchedPassword && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "#e5e7eb" }}>
                    <div 
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold whitespace-nowrap" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl mt-1"
                style={{
                  backgroundColor: "#0F5D4E",
                  color: "#ffffff"
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Account
                </div>
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold transition-colors"
                  style={{ color: "#0F5D4E" }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl transform transition-all duration-500 scale-100" style={{ backgroundColor: "#ffffff" }}>
            <div className="text-center space-y-6">
              {/* Success Icon with Animation */}
              <div className="relative inline-flex">
                <div className="w-24 h-24 rounded-full flex items-center justify-center animate-bounce" style={{ backgroundColor: "#0F5D4E" }}>
                  <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: "#0F5D4E" }}></div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h2 className="text-3xl font-black" style={{ color: "#0F5D4E" }}>
                  Registration Successful!
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                  Welcome to LiquiInvest KE
                </p>
                <p className="text-gray-500 text-sm">
                  Your account has been created successfully. Please login to continue.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: "#0F5D4E",
                  color: "#ffffff"
                }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;