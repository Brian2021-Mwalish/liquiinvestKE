// src/features/auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavigationArrow from "../../components/NavigationArrow";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle, Key, ArrowLeft, Shield } from "lucide-react";
import { API_BASE_URL } from "../../lib/api";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .matches(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .matches(/(?=.*\d)/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPassword = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Validate token on component mount
    validateToken();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateToken = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${uidb64}/${token}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
        const result = await res.json();
        toast.error(result.error || "Invalid or expired reset link");
      }
    } catch (error) {
      setIsTokenValid(false);
      toast.error("Failed to validate reset link");
    }
  };

  const showAllMessages = (result, type = "success") => {
    if (typeof result === "string") {
      type === "success" ? toast.success(result) : toast.error(result);
      return;
    }
    if (typeof result === "object") {
      Object.entries(result).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((msg) =>
            type === "success" ? toast.success(`${key.toUpperCase()}: ${msg}`) : toast.error(`${key.toUpperCase()}: ${msg}`)
          );
        } else {
          type === "success"
            ? toast.success(`${key.toUpperCase()}: ${value}`)
            : toast.error(`${key.toUpperCase()}: ${value}`);
        }
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/${uidb64}/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: data.password,
          confirm_password: data.confirmPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        showAllMessages(result, "error");
        return;
      }

      showAllMessages(result, "success");
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error("SERVER ERROR: " + error.message);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    const strengthMap = {
      0: { label: "", color: "" },
      1: { label: "Very Weak", color: "text-red-500" },
      2: { label: "Weak", color: "text-orange-500" },
      3: { label: "Fair", color: "text-yellow-500" },
      4: { label: "Strong", color: "text-blue-500" },
      5: { label: "Very Strong", color: "text-green-500" },
    };
    
    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  // Success state
  if (isSuccess) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1) 0%, transparent 50%)`
          }}
        />
        
        <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-4 sm:space-y-6 lg:space-y-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mb-2">
            <NavigationArrow label="Back to Home" to="/" />
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 transform transition-all duration-500 hover:shadow-2xl text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Password Reset Successful!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You will be redirected to the sign in page in a few seconds.
            </p>
            
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-xl transform hover:scale-105"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-[#0F5D4E] p-3 sm:p-4 md:p-6 page-transition flex items-center justify-center">
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

        <div className={`w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 border-4 border-[#0F5D4E] relative animate-fade-in text-center`}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="text-red-600" size={32} />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#0F5D4E] mb-4">
            Invalid Reset Link
          </h2>

          <p className="text-[#0F5D4E] mb-6">
            This password reset link is invalid or has expired. Please request a new password reset.
          </p>

          <div className="space-y-3">
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center w-full bg-[#0F5D4E] text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#0A3D32] transition shadow-md"
            >
              Request New Reset Link
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full text-[#0F5D4E] hover:text-[#0A3D32] font-medium transition-colors duration-200 hover:underline text-sm sm:text-base py-2"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-[#0F5D4E] flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Validating reset link...</p>
        </div>
      </div>
    );
  }



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

      {/* Centered Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 border-4 border-[#0F5D4E] relative animate-fade-in">
          {/* Header */}
          <div className="text-center pt-2 sm:pt-4">
            <div className="flex justify-center items-center gap-2">
              <Shield className="text-[#0F5D4E] animate-pulse w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F5D4E]">Reset Password</h2>
              <Key className="text-[#0F5D4E] animate-bounce w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-[#0F5D4E] text-xs sm:text-sm mt-1">Enter your new secure password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            {/* New Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#0F5D4E] flex items-center gap-1 mb-1">
                <Lock size={14} /> New Password
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter new password"
                  className={`w-full px-3 py-2 sm:py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#0F5D4E] focus:outline-none text-sm pr-10 ${
                    errors.password ? "border-red-400 bg-red-50" : "border-[#0F5D4E]/40 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-2 flex items-center text-[#0F5D4E] hover:text-[#0A3D32]"
                >
                  {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {watchedPassword && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-[#0F5D4E]">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 1 ? 'bg-red-500' :
                        passwordStrength.strength <= 2 ? 'bg-orange-500' :
                        passwordStrength.strength <= 3 ? 'bg-yellow-500' :
                        passwordStrength.strength <= 4 ? 'bg-[#0F5D4E]' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#0F5D4E] flex items-center gap-1 mb-1">
                <Key size={14} /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm new password"
                  className={`w-full px-3 py-2 sm:py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-[#0F5D4E] focus:outline-none text-sm pr-10 ${
                    errors.confirmPassword ? "border-red-400 bg-red-50" : "border-[#0F5D4E]/40 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  className="absolute inset-y-0 right-2 flex items-center text-[#0F5D4E] hover:text-[#0A3D32]"
                >
                  {isConfirmPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              {watchedConfirmPassword && watchedPassword && watchedConfirmPassword === watchedPassword && !errors.confirmPassword && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0F5D4E] text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A3D32] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-xs sm:text-sm text-[#0F5D4E]">
            Remember your password?{" "}
            <Link to="/login" className="text-[#0F5D4E] hover:text-[#0A3D32] hover:underline font-semibold">
              Sign In
            </Link>
          </p>
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
      `}</style>
    </div>
  );
};

export default ResetPassword;