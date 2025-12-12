import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";

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
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    if (!password) return { strength: 0, label: "Enter password", color: "bg-gray-300" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    const levels = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-green-400" },
      { label: "Strong", color: "bg-green-700" }
    ];
    return { strength, ...levels[Math.min(strength, 4)] };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const onSubmit = async (formData) => {
    setLoading(true);
    toast.loading("Creating your account, please wait...", { id: "register" });
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
            id: "register",
            duration: 4000
          });
        }
        toast.dismiss("register");
        setLoading(false);
        return;
      } else {
        // Success
        toast.dismiss("register");
        setSuccessMessage("Registration Successful! Please Login");
        setShowSuccessModal(true);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = error.message || "We're experiencing technical difficulties. Please try again.";
      toast.error(errorMessage, {
        id: "register",
        duration: 5000,
        icon: <AlertCircle className="text-red-500" />
      });
      toast.dismiss("register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex p-2 sm:p-4 md:p-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e6f4ea 0%, #b7e4c7 50%, #1b4332 100%)",
      }}
    >
      {/* Uniquely styled, bold, and highly visible Back Arrow */}
      <Link
        to="/"
        className="fixed top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-2xl z-50 font-bold text-sm sm:text-base"
        style={{
          background: "linear-gradient(90deg, #1b4332 70%, #b7e4c7 100%)",
          color: "#fff",
          border: "2px solid #14532d",
          boxShadow: "0 4px 24px 0 #14532d55",
          letterSpacing: "0.03em"
        }}
      >
        <ArrowLeft size={18} className="sm:w-6 sm:h-6" style={{ strokeWidth: 3 }} />
        <span style={{ fontWeight: 700, textShadow: "0 2px 8px #14532d55" }}>Back to Home</span>
      </Link>

      {/* Two-column layout */}
      <div className="flex h-full w-full">
        {/* Left Side: Descriptive Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6">
          <div className="text-center animate-fade-in max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <User className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-green-900 mb-3 animate-slide-up">
                Join LiquiInvest KE
              </h1>
              <p className="text-lg text-green-700 mb-4 animate-slide-up-delayed">
                Start Your Investment Journey
              </p>
            </div>

            <div className="space-y-4 text-left max-w-sm mx-auto">
              <div className="flex items-start space-x-3 animate-slide-in-left">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1 text-sm">100% Returns Guaranteed</h3>
                  <p className="text-green-700 text-xs">Double your investment in just 20 days.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 animate-slide-in-left-delayed">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1 text-sm">M-Pesa Integration</h3>
                  <p className="text-green-700 text-xs">Easy deposits and withdrawals.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 animate-slide-in-left-delayed-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1 text-sm">Bank-Level Security</h3>
                  <p className="text-green-700 text-xs">Your investments are fully protected.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 animate-slide-in-left-delayed-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1 text-sm">Referral Bonuses</h3>
                  <p className="text-green-700 text-xs">Earn by inviting friends.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                <span className="text-green-800 font-semibold text-sm">Join 10,000+ Investors</span>
                <span className="text-lg">🇰🇪</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md animate-fade-in p-2">


        {/* Header */}
        <div className="text-center transform transition-all duration-300 hover:scale-105">
          <h1 className="text-xl md:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
            Join Liquidity Investments
          </h1>
          <p className="mt-2 sm:mt-3 text-xs md:text-sm sm:text-base text-green-700 transition-colors duration-300 hover:text-green-900 max-w-md mx-auto">
            Create your account and start your investment journey with us today
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-green-200 p-3 transform transition-all duration-300 hover:shadow-2xl mx-auto max-w-md">

          {/* Welcome Message */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-2">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-base font-semibold text-green-900 mb-1">Create Your Account</h2>
            <p className="text-xs text-green-700">Please fill in your details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 mb-2 font-semibold text-green-700 text-sm sm:text-base">
                <User className="w-4 h-4 text-green-600" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("full_name")}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-opacity-30 text-sm sm:text-base transition-all duration-300 ${
                    errors.full_name
                      ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50 shake"
                      : "border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50 hover:bg-white hover:border-green-400"
                  }`}
                  placeholder="Enter your full name"
                />
                {!errors.full_name && watch("full_name") && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.full_name && (
                <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 mb-2 font-semibold text-green-700 text-sm sm:text-base">
                <Mail className="w-4 h-4 text-green-600" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-opacity-30 text-sm sm:text-base transition-all duration-300 ${
                    errors.email
                      ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50 shake"
                      : "border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50 hover:bg-white hover:border-green-400"
                  }`}
                  placeholder="Enter your email address"
                />
                {!errors.email && watch("email") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watch("email")) && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 mb-2 font-semibold text-green-700 text-sm sm:text-base">
                  <Lock className="w-4 h-4 text-green-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-opacity-30 text-sm sm:text-base transition-all duration-300 ${
                      errors.password
                        ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50 shake"
                        : "border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50 hover:bg-white hover:border-green-400"
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-green-500 hover:text-green-700 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {watchedPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-green-700">Password Strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.strength <= 1 ? 'text-red-500' :
                        passwordStrength.strength <= 2 ? 'text-orange-500' :
                        passwordStrength.strength <= 3 ? 'text-yellow-600' :
                        passwordStrength.strength <= 4 ? 'text-green-400' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 mb-2 font-semibold text-green-700 text-sm sm:text-base">
                  <Lock className="w-4 h-4 text-green-600" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border-2 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-opacity-30 text-sm sm:text-base transition-all duration-300 ${
                      errors.confirmPassword
                        ? "border-red-400 focus:ring-red-200 focus:border-red-500 bg-red-50 shake"
                        : "border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50 hover:bg-white hover:border-green-400"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-green-500 hover:text-green-700 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {!errors.confirmPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword && (
                    <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || isSubmitting || !isValid}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg font-semibold text-xs transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
              >
                <div className="flex items-center justify-center gap-1">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-2">
          <p className="text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-all duration-200 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg mx-4 transform transition-all duration-500 scale-100 hover:scale-105 border-4 border-gray-300">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{successMessage}</h2>
              <p className="text-gray-800 mb-8 text-lg font-medium">Please Login to continue your investment journey.</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .shake {
          animation: shake 0.5s ease-in-out;
        }

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

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Register;
