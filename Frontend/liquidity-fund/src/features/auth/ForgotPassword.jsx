// src/features/auth/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import NavigationArrow from "../../components/NavigationArrow";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { Mail, Send, CheckCircle, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

const ForgotPassword = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedEmail = watch("email");

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        showAllMessages(result, "error");
        return;
      }

      showAllMessages(result, "success");
      setSentEmail(data.email);
      setIsEmailSent(true);
    } catch (error) {
      toast.error("SERVER ERROR: " + error.message);
    }
  };

  const handleResendEmail = async () => {
    if (!sentEmail) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sentEmail }),
      });

      const result = await res.json();

      if (!res.ok) {
        showAllMessages(result, "error");
        return;
      }

      toast.success("Password reset email sent again!");
    } catch (error) {
      toast.error("SERVER ERROR: " + error.message);
    }
  };

  const resetForm = () => {
    setIsEmailSent(false);
    setSentEmail("");
  };

  if (isEmailSent) {
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
            <div className="w-16 h-16 bg-[#0A3D32] rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#0F5D4E] mb-4">
            Email Sent!
          </h2>

          <p className="text-[#0F5D4E] mb-4">
            We've sent a password reset link to:
          </p>

          <p className="font-semibold text-[#0F5D4E] bg-[#A8E6CF]/20 px-4 py-2 rounded-lg mb-6">
            {sentEmail}
          </p>

          <p className="text-sm text-[#0F5D4E] mb-6">
            Check your inbox and click the link to reset your password. The link will expire in 15 minutes.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              className="w-full bg-[#0F5D4E] text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#0A3D32] transition shadow-md"
            >
              Resend Email
            </button>

            <button
              onClick={resetForm}
              className="w-full bg-white text-[#0F5D4E] border-2 border-[#0F5D4E] py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#A8E6CF]/10 transition"
            >
              Try Different Email
            </button>

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
              <Mail className="text-[#0F5D4E] animate-pulse w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F5D4E]">Forgot Password</h2>
              <Send className="text-[#0F5D4E] animate-bounce w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-[#0F5D4E] text-xs sm:text-sm mt-1">Enter your email to reset your password</p>
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
              {watchedEmail && !errors.email && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle size={12} />
                  Valid email format
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
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Reset Link</span>
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

export default ForgotPassword;