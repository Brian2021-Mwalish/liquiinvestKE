import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, useParams, useNavigate } from "react-router-dom";
// Referral redirect component
const ReferralRedirect = () => {
  const { referral_code } = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(`/register?referral_code=${referral_code}`);
  }, [referral_code, navigate]);
  return null;
};

// Lazy load components for better performance
const LandingPage = lazy(() => import("../pages/LandingPage"));
const About = lazy(() => import("../pages/About"));
const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../features/auth/Login"));
const Register = lazy(() => import("../features/auth/Register"));
const KYCForm = lazy(() => import("../features/auth/KYCForm"));
const ForgotPassword = lazy(() => import("../features/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../features/auth/ResetPassword"));
const ClientDashboard = lazy(() => import("../features/dashboard/ClientDashboard"));
const AdminDashboard = lazy(() => import("../features/dashboard/AdminDashboard"));
const WithdrawalForm = lazy(() => import("../features/transactions/Withdraw"));
const ReferralPage = lazy(() => import("../features/referral/ReferralPage"));
import RequireAuth from "./RequireAuth";

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-600 text-lg">
            Something went wrong. Please try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}



const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/home" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/kyc" element={<KYCForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
      {/* Referral link support: /referral/:referral_code redirects to /register?referral_code=... */}
      <Route path="/referral/:referral_code" element={<ReferralRedirect />} />

      {/* Dashboards & Protected Routes */}
      <Route
        path="/client-dashboard"
        element={
          <RequireAuth>
            <ClientDashboard />
          </RequireAuth>
        }
      />
      <Route path="/withdraw" element={<WithdrawalForm />} />

      {/* ✅ Referral Page (Protected) */}
      <Route
        path="/referrals"
        element={
          <RequireAuth>
            <ReferralPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <RequireAuth>
            <ErrorBoundary>
              <AdminDashboard />
            </ErrorBoundary>
          </RequireAuth>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
