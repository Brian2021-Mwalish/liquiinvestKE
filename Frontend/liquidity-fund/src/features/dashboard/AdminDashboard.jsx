import React, { useState, useEffect } from 'react';
import {
  Search, Menu, X, BarChart3, Users, Home, CreditCard,
  FileCheck, MessageSquare, Settings, Shield, Activity, LogOut, UserX,
  CheckCircle, Eye, Filter, MoreHorizontal, DollarSign, Clock, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { API_BASE_URL } from '../../lib/api';
import Contact from '../../components/Contact';


const AdminDashboard = () => {
  // Particles component for floating background animation (disabled on mobile for performance)
  const Particles = () => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null; // Disable particles on mobile
    
    const particles = Array.from({ length: 10 }, (_, i) => i); // Reduced from 20 to 10

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: 0,
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Waves component for animated wave background (disabled on mobile for performance)
  const Waves = () => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) return null; // Disable waves on mobile

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-64"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="rgba(255, 255, 255, 0.1)"
            d="M0,160 Q360,200 720,160 T1440,160 V320 H0 Z"
            animate={{
              d: [
                "M0,160 Q360,200 720,160 T1440,160 V320 H0 Z",
                "M0,180 Q360,140 720,180 T1440,180 V320 H0 Z",
                "M0,160 Q360,200 720,160 T1440,160 V320 H0 Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            fill="rgba(255, 255, 255, 0.05)"
            d="M0,200 Q360,240 720,200 T1440,200 V320 H0 Z"
            animate={{
              d: [
                "M0,200 Q360,240 720,200 T1440,200 V320 H0 Z",
                "M0,220 Q360,180 720,220 T1440,220 V320 H0 Z",
                "M0,200 Q360,240 720,200 T1440,200 V320 H0 Z"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.path
            fill="rgba(255, 255, 255, 0.03)"
            d="M0,240 Q360,280 720,240 T1440,240 V320 H0 Z"
            animate={{
              d: [
                "M0,240 Q360,280 720,240 T1440,240 V320 H0 Z",
                "M0,260 Q360,220 720,260 T1440,260 V320 H0 Z",
                "M0,240 Q360,280 720,240 T1440,240 V320 H0 Z"
              ]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </svg>
      </div>
    );
  };

  // State and constants
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState({ username: 'Admin', email: 'admin@example.com', is_superuser: true });
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '0', change: '+12%', positive: true },
    { title: 'Pending Withdrawals', value: '0', change: '+5%', positive: true },
    { title: 'Total Withdrawals', value: '0', change: '+0%', positive: true },
    { title: 'Total Wallet Balance', value: 'Ksh 0', change: '+10%', positive: true },
    { title: 'Monthly Revenue', value: '$0', change: '+18%', positive: true },
    { title: 'Pending KYC', value: '0', change: '-3%', positive: false },
    { title: 'Total Referrals', value: '0', change: '+0%', positive: true }
  ]);
  const [kycForms, setKycForms] = useState([]);
  const [kycLoading, setKycLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [withdrawalsViewMode, setWithdrawalsViewMode] = useState('list'); // 'list' or 'detail'
  const [revealedReferrers, setRevealedReferrers] = useState(new Set());
  const [userProfileModal, setUserProfileModal] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemStatus, setSystemStatus] = useState('online');
  const [settingsLoading, setSettingsLoading] = useState(false);

  const [rentals, setRentals] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [activeRentalsSummary, setActiveRentalsSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);


  const [menuItems, setMenuItems] = useState([
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'withdrawals', label: 'Withdrawals', icon: DollarSign },
    { id: 'referrals', label: 'Referrals', icon: CheckCircle },
    { id: 'rentals', label: 'Rentals', icon: Home },
    { id: 'kyc', label: 'KYC Verifications', icon: FileCheck },
    { id: 'support', label: 'Support', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: Shield }
  ]);

  // API and handler functions
  const handleApiError = (error, operation) => {
    console.error(`Error ${operation}:`, error);
    if (error.message.includes('401') || error.message.includes('403')) {
      alert('Session expired. Please login again.');
      localStorage.removeItem("access");
      window.location.href = '/login';
    } else {
      alert(`Failed to ${operation}. Please try again.`);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const usersRes = await fetch(`${API_BASE_URL}/api/auth/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const usersArray = Array.isArray(usersData) ? usersData : usersData.results || [];
        setUsers(usersArray);
        const totalWalletBalance = usersArray.reduce((sum, user) => sum + parseFloat(user.wallet_balance || 0), 0);
        setStats(prev => prev.map(stat =>
          stat.title === 'Total Users'
            ? { ...stat, value: usersArray.length.toString() }
            : stat.title === 'Total Wallet Balance'
            ? { ...stat, value: `Ksh ${totalWalletBalance.toFixed(2)}` }
            : stat
        ));
      } else if (usersRes.status === 401 || usersRes.status === 403) {
        localStorage.removeItem("access");
        window.location.href = '/login';
        return;
      } else {
        throw new Error(`Failed to fetch users: ${usersRes.status}`);
      }
      const profileRes = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setAdminData({
          username: profileData.full_name || profileData.username || 'Admin',
          email: profileData.email,
          is_superuser: profileData.is_superuser || true
        });
      }
    } catch (error) {
      handleApiError(error, 'fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/withdraw/pending/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        const allWithdrawalsRes = await fetch(`${API_BASE_URL}/api/withdraw/all/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        let allWithdrawals = data;
        if (allWithdrawalsRes.ok) {
          allWithdrawals = await allWithdrawalsRes.json();
        }
        // Enrich withdrawals with user data from users array to avoid individual fetches
        const withdrawalsWithUser = allWithdrawals.map(withdrawal => {
          if (
            withdrawal.user &&
            (withdrawal.user.first_name || withdrawal.user.last_name || withdrawal.user.email || withdrawal.user.phone_number)
          ) {
            return withdrawal;
          }
          if (withdrawal.user && withdrawal.user.id) {
            const userData = users.find(u => u.id === withdrawal.user.id);
            if (userData) {
              return { ...withdrawal, user: userData };
            }
          }
          return withdrawal;
        });
        setWithdrawals(withdrawalsWithUser);
        setStats(prev => prev.map(stat =>
          stat.title === 'Pending Withdrawals'
            ? { ...stat, value: withdrawalsWithUser.filter(w => w.status === 'pending').length.toString() }
            : stat.title === 'Total Withdrawals'
            ? { ...stat, value: withdrawalsWithUser.length.toString() }
            : stat
        ));
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("access");
        window.location.href = '/login';
      } else if (res.status === 404) {
        setWithdrawals([]);
      } else {
        throw new Error(`Failed to fetch withdrawals: ${res.status}`);
      }
    } catch (error) {
      handleApiError(error, 'fetch withdrawals');
    }
  };

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/auth/referrals/admin/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReferrals(data.referral_relationships || []);
        setStats(prev => prev.map(stat =>
          stat.title === 'Total Referrals'
            ? { ...stat, value: (data.total_referrals || 0).toString() }
            : stat
        ));
      }
    } catch (error) {
      handleApiError(error, 'fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch KYC forms for admin verification
  const fetchKycForms = async () => {
    setKycLoading(true);
    const token = localStorage.getItem('access');
    const res = await fetch(`${API_BASE_URL}/api/auth/kyc/all/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      setKycForms(data.kyc_forms || []);
    }
    setKycLoading(false);
  };

  // Verify KYC form
  const handleVerifyKyc = async (kycId) => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = '/login';
      return;
    }
    const res = await fetch(`${API_BASE_URL}/api/auth/kyc/${kycId}/verify/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      setKycForms(forms =>
        forms.map(f => f.id === kycId ? { ...f, status: "verified" } : f)
      );
      alert("KYC verified!");
    } else {
      alert("Failed to verify KYC.");
    }
  };

  const handleBlockUser = async (userId, shouldBlock) => {
    const action = shouldBlock ? 'block' : 'unblock';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    const token = localStorage.getItem('access');
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = '/login';
      return;
    }
    try {
      setLoading(true);
      const endpoint = shouldBlock ? 'block' : 'unblock';
      const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, is_active: !shouldBlock }
              : user
          )
        );
        alert(`User ${action}ed successfully`);
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("access");
        window.location.href = '/login';
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to ${action} user: ${res.status}`);
      }
    } catch (error) {
      handleApiError(error, `${action} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalAction = async (withdrawalId, action) => {
    if (!confirm(`Are you sure you want to ${action} this withdrawal?`)) return;
    const token = localStorage.getItem('access');
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = '/login';
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/withdraw/${action}/${withdrawalId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        await fetchWithdrawals();
        alert(`Withdrawal ${action}d successfully`);
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("access");
        window.location.href = '/login';
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to ${action} withdrawal: ${res.status}`);
      }
    } catch (error) {
      handleApiError(error, `${action} withdrawal`);
    } finally {
      setLoading(false);
    }
  };

  const handleAwardWallet = async (userId) => {
    if (!window.confirm('Award Ksh50 and verify KYC for this user?')) return;
    const token = localStorage.getItem('access');
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = '/login';
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/award-wallet/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 50 })
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Awarded Ksh50 and KYC verified!');
        // Update user's wallet_balance locally immediately
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, wallet_balance: (parseFloat(user.wallet_balance) || 0) + 50 }
              : user
          )
        );
        // Update total wallet balance stat
        setStats(prevStats => {
          const totalWalletStat = prevStats.find(stat => stat.title === 'Total Wallet Balance');
          const totalWalletValue = totalWalletStat ? parseFloat(totalWalletStat.value.replace(/[^\d.-]/g, '')) : 0;
          const newTotal = totalWalletValue + 50;
          return prevStats.map(stat =>
            stat.title === 'Total Wallet Balance'
              ? { ...stat, value: `Ksh ${newTotal.toFixed(2)}` }
              : stat
          );
        });
        // Refresh KYC forms to update the count
        fetchKycForms();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.detail || 'Failed to award wallet.';
        alert(`Failed to award wallet: ${errorMessage}`);
      }
    } catch (e) {
      console.error('Error awarding wallet:', e);
      alert(`Error awarding wallet: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access');
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setProfileOpen(false);
      window.location.href = '/login';
    }
  };


  // Fetch active rentals for admin monitoring
  const fetchActiveRentals = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('Error fetching active rentals: token is not defined');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/rentals/admin/active/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveRentals(data.active_rentals || []);
        setActiveRentalsSummary(data.summary || {});
      } else if (res.status === 403) {
        console.error('Access denied: Admin privileges required');
      }
    } catch (error) {
      console.error('Error fetching active rentals:', error);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('Error fetching settings: token is not defined');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/support/settings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMode(data.maintenance_mode || false);
        setEmailNotifications(data.email_notifications || true);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Update settings
  const updateSettings = async (key, value) => {
    // Optimistically update state
    if (key === 'maintenance_mode') setMaintenanceMode(value);
    if (key === 'email_notifications') setEmailNotifications(value);
    try {
      setSettingsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/support/settings/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) {
        alert('Failed to update settings');
        // Revert the change
        if (key === 'maintenance_mode') setMaintenanceMode(!value);
        if (key === 'email_notifications') setEmailNotifications(!value);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
      // Revert the change
      if (key === 'maintenance_mode') setMaintenanceMode(!value);
      if (key === 'email_notifications') setEmailNotifications(!value);
    } finally {
      setSettingsLoading(false);
    }
  };


  useEffect(() => {
    const initializeData = async () => {
      await fetchUsers();
      await fetchWithdrawals();
      fetchReferrals();
      fetchKycForms();
      fetchActiveRentals();
      fetchSettings();
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (activeSection === 'withdrawals') {
      setFilterStatus('pending');
    } else if (activeSection === 'users') {
      setFilterStatus('all');
    }
  }, [activeSection]);

  // Referrals Management Section
  const ReferralsManagement = () => {
    // Group referrals by referrer
    const groupedReferrals = referrals.reduce((acc, ref) => {
      const referrerKey = ref.referrer_email || ref.referrer_full_name || ref.referrer_id || 'unknown';
      if (!acc[referrerKey]) {
        acc[referrerKey] = {
          referrer: ref.referrer_email || ref.referrer_full_name || ref.referrer_id || 'Unknown',
          referrerEmail: ref.referrer_email,
          referrals: []
        };
      }
      acc[referrerKey].referrals.push(ref);
      return acc;
    }, {});

    // Convert to array for rendering
    const referrerGroups = Object.values(groupedReferrals);

    // Filter groups based on search term
    const filteredGroups = referrerGroups.filter(group =>
      group.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.referrals.some(ref =>
        (ref.referred_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ref.referred_full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const showReferrerDetails = (group) => {
      setSelectedReferrer(group);
    };

    const showUserProfile = (user) => {
      setSelectedUser(user);
      setUserProfileModal(true);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0F5D4E]">Referrals by Referrer</h2>
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search referrers or referred users..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {filteredGroups.length === 0 && (
              <div className="text-center py-8 text-[#0F5D4E]">No referral records found</div>
            )}
            {filteredGroups.map((group, idx) => {
              const referrerUser = users.find(u => u.email === group.referrerEmail);
              return (
                <div key={idx} className="bg-[#0F5D4E]/10 rounded-lg p-4 border border-[#0F5D4E]/20">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#0F5D4E] text-xs">Referrer</span>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => showReferrerDetails(group)}
                          className="text-[#0A3D32] font-bold text-lg underline hover:text-[#0F5D4E] transition-colors"
                        >
                          {group.referrerEmail || group.referrer} ({group.referrals.length} referrals)
                        </button>
                        {referrerUser && (
                          <button
                            onClick={() => handleAwardWallet(referrerUser.id)}
                            disabled={loading}
                            className="px-3 py-1 text-xs font-medium rounded-md bg-[#0F5D4E] text-white hover:bg-[#0A3D32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Award 50
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F5D4E]/10 border-b border-[#0F5D4E]/20">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-[#0A3D32]">Referrer</th>
                  <th className="text-left py-4 px-6 font-medium text-[#0A3D32]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F5D4E]/20">
                {filteredGroups.length === 0 && (
                  <tr><td colSpan={2} className="text-center py-8 text-[#0F5D4E]">No referral records found</td></tr>
                )}
                {filteredGroups.map((group, idx) => {
                  const referrerUser = users.find(u => u.email === group.referrerEmail);
                  return (
                    <tr key={idx} className="hover:bg-[#0F5D4E]/5 transition-colors">
                      <td className="py-4 px-6">
                        <button
                          onClick={() => showReferrerDetails(group)}
                          className="font-medium text-[#0A3D32] underline hover:text-[#0F5D4E] transition-colors"
                        >
                          {group.referrerEmail || group.referrer} ({group.referrals.length} referrals)
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        {referrerUser && (
                          <button
                            onClick={() => handleAwardWallet(referrerUser.id)}
                            disabled={loading}
                            className="px-3 py-1 text-xs font-medium rounded-md bg-[#0F5D4E] text-white hover:bg-[#0A3D32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Award 50
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let filtered = activeSection === 'withdrawals' ? withdrawals : users;
    if (searchTerm) {
      filtered = filtered.filter(item => {
        if (activeSection === 'withdrawals') {
          return item.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.amount?.toString().includes(searchTerm.toLowerCase());
        }
        return item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.email.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => {
        if (activeSection === 'withdrawals') {
          return item.status === filterStatus;
        }
        return filterStatus === 'active' ? item.is_active : !item.is_active;
      });
    }
    if (activeSection === 'withdrawals') {
      setFilteredWithdrawals(filtered);
    } else {
      setFilteredUsers(filtered);
    }
  }, [users, withdrawals, searchTerm, filterStatus, activeSection]);


  const WithdrawalsManagement = () => {
    // Group withdrawals by user id
    const withdrawalsByUser = withdrawals.reduce((acc, withdrawal) => {
      const userId = withdrawal.user?.id || withdrawal.user_id || 'unknown';
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(withdrawal);
      return acc;
    }, {});

    // Get unique users with withdrawals
    const usersWithWithdrawals = Object.keys(withdrawalsByUser).map(userId => {
      const userWithdrawals = withdrawalsByUser[userId];
      const user = userWithdrawals[0].user || {};
      return {
        id: userId,
        email: userWithdrawals[0].user_email || user.email || 'N/A',
        phone: userWithdrawals[0].user_phone_number || user.phone_number || 'N/A',
        withdrawals: userWithdrawals
      };
    });

    // Filter users by search term
    const filteredUsersWithWithdrawals = usersWithWithdrawals.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter withdrawals by status filter in detail view
    const filteredUserWithdrawals = selectedUser
      ? withdrawalsByUser[selectedUser.id]?.filter(w => filterStatus === 'all' || w.status === filterStatus) || []
      : [];

    // Handler to select user for detail view
    const handleSelectUser = (user) => {
      setSelectedUser(user);
      setWithdrawalsViewMode('detail');
      setFilterStatus('all');
      setSearchTerm('');
    };

    // Handler to go back to user list view
    const handleBackToList = () => {
      setSelectedUser(null);
      setWithdrawalsViewMode('list');
      setFilterStatus('all');
      setSearchTerm('');
    };

    if (withdrawalsViewMode === 'list') {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by email or phone..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative">

            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F5D4E]"></div>
              </div>
            )}
            <div className="overflow-x-auto">
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {filteredUsersWithWithdrawals.length === 0 && !loading && (
                  <div className="text-center py-8 text-[#0F5D4E]">No users with withdrawals found</div>
                )}
                {filteredUsersWithWithdrawals.map(user => (
                  <div key={user.id} className="bg-[#0F5D4E]/10 rounded-lg p-4 border border-[#0F5D4E]/20">
                    <div className="space-y-2">
                      <div>
                        <span className="text-[#0F5D4E] text-xs">Email</span>
                        <div className="text-[#0A3D32] font-medium">{user.email}</div>
                      </div>
                      <div>
                        <span className="text-[#0F5D4E] text-xs">Phone</span>
                        <div className="text-[#0A3D32]">{user.phone}</div>
                      </div>
                      <div>
                        <span className="text-[#0F5D4E] text-xs">Withdrawals</span>
                        <div className="text-[#0A3D32]">{user.withdrawals.length}</div>
                      </div>
                      <button
                        onClick={() => handleSelectUser(user)}
                        className="text-[#0F5D4E] hover:text-[#0A3D32] text-sm font-medium underline"
                      >
                        View Withdrawals →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop Table Layout */}
              <table className="w-full hidden md:table">
                <thead className="bg-[#0F5D4E]/10 border-b border-[#0F5D4E]/20">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-[#0A3D32]">Email</th>
                    <th className="text-left py-4 px-6 font-medium text-[#0A3D32]">Phone Number</th>
                    <th className="text-left py-4 px-6 font-medium text-[#0A3D32]">Number of Withdrawals</th>
                    <th className="text-left py-4 px-6 font-medium text-[#0A3D32]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F5D4E]/20">
                  {filteredUsersWithWithdrawals.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-[#0F5D4E]">No users with withdrawals found</td>
                    </tr>
                  ) : (
                    filteredUsersWithWithdrawals.map(user => (
                      <tr key={user.id} className="hover:bg-[#0F5D4E]/5 cursor-pointer" onClick={() => handleSelectUser(user)}>
                        <td className="py-4 px-6 text-[#0A3D32]">{user.email}</td>
                        <td className="py-4 px-6 text-[#0A3D32]">{user.phone}</td>
                        <td className="py-4 px-6 text-[#0A3D32]">{user.withdrawals.length}</td>
                        <td className="py-4 px-6 text-[#0A3D32] text-sm font-medium text-[#0F5D4E] underline">View Withdrawals</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (withdrawalsViewMode === 'detail' && selectedUser) {
      return (
        <div className="space-y-6">
          <button
            onClick={handleBackToList}
            className="text-green-600 hover:text-green-800 text-sm font-medium mb-4"
          >
            &larr; Back to Users List
          </button>
          <h2 className="text-xl font-bold text-green-700 mb-4">Withdrawals for {selectedUser.email}</h2>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <Filter size={20} className="text-gray-400" />
              <select
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={loading}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            )}

            {!loading && filteredUserWithdrawals.length === 0 && (
              <div className="text-center py-12 text-green-600">No withdrawals found for this user.</div>
            )}

            {!loading && filteredUserWithdrawals.length > 0 && (
              <div className="space-y-4">
                {filteredUserWithdrawals.map(withdrawal => (
                  <div key={withdrawal.id} className="bg-white rounded-xl shadow-md border border-green-200 p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <span className="text-green-500 text-xs">Email</span>
                        <div className="text-green-900 text-sm md:text-base">{withdrawal.user_email || selectedUser.email}</div>
                      </div>
                      <div>
                        <span className="text-green-500 text-xs">Phone Number</span>
                        <div className="text-green-900 text-sm md:text-base">{withdrawal.user_phone_number || selectedUser.phone}</div>
                      </div>
                      <div>
                        <span className="text-green-500 text-xs">Amount</span>
                        <div className="text-lg md:text-xl font-bold text-green-900">Ksh {withdrawal.amount}</div>
                      </div>
                      <div>
                        <span className="text-green-500 text-xs">Status</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' :
                          withdrawal.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                          withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {withdrawal.status === 'approved' ? <><CheckCircle size={12} className="mr-1" />Approved</> :
                           withdrawal.status === 'paid' ? <><CheckCircle size={12} className="mr-1" />Paid</> :
                           withdrawal.status === 'rejected' ? <><XCircle size={12} className="mr-1" />Rejected</> :
                           <><Clock size={12} className="mr-1" />Pending</>}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-500 text-xs">Created</span>
                        <div className="text-sm text-green-700">{new Date(withdrawal.created_at).toLocaleDateString()}</div>
                      </div>
                      {withdrawal.processed_at && (
                        <div>
                          <span className="text-green-500 text-xs">Processed</span>
                          <div className="text-sm text-green-700">{new Date(withdrawal.processed_at).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>

                    {withdrawal.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-[#0F5D4E]/20">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleWithdrawalAction(withdrawal.id, 'paid')}
                            disabled={loading}
                            className="flex-1 px-4 py-3 text-sm font-medium rounded-md bg-[#0F5D4E] text-white hover:bg-[#0A3D32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                          >
                            Mark as Paid
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const UsersManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                disabled={loading}
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <span className="text-sm text-gray-600">{filteredUsers.length} of {users.length} users</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {(
                          user.first_name?.[0] ||
                          user.last_name?.[0] ||
                          user.username?.[0] ||
                          'U'
                        ).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-900">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.first_name
                            ? user.first_name
                            : user.last_name
                              ? user.last_name
                              : user.username
                                ? user.username
                                : 'Unknown User'}
                      </p>
                      <p className="text-sm text-green-700">@{user.username || 'unknown'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-green-500 text-xs">Email</span>
                      <div className="text-green-900 truncate">{user.email}</div>
                    </div>
                    <div>
                      <span className="text-green-500 text-xs">Wallet</span>
                      <div className="text-green-900 font-bold">Ksh {user.wallet_balance}</div>
                    </div>
                    <div>
                      <span className="text-green-500 text-xs">Status</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-500 text-xs">Joined</span>
                      <div className="text-green-900">{new Date(user.date_joined).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-green-200">
                    <button
                      onClick={() => handleBlockUser(user.id, user.is_active)}
                      disabled={loading}
                      className={`px-3 py-2 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] ${
                        user.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.is_active ? 'Block' : 'Unblock'}
                    </button>
                      <button
                        onClick={() => handleBlockUser(user.id, user.is_active)}
                        disabled={loading}
                        className={`px-3 py-2 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] ${
                          user.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.is_active ? 'Block' : 'Unblock'}
                      </button>
                    <button 
                      className="px-3 py-2 text-xs text-green-600 hover:text-green-800 rounded-md disabled:opacity-50 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      disabled={loading}
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      className="px-3 py-2 text-xs text-green-600 hover:text-green-800 rounded-md disabled:opacity-50 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      disabled={loading}
                      onClick={() => {
                        setSelectedUser(user);
                        // Add user detail view logic here
                      }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop Table Layout */}
          <table className="w-full hidden md:table table-fixed">
            <thead className="bg-green-50 border-b border-green-200">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-green-900 w-1/4">User</th>
                <th className="text-left py-2 px-3 font-medium text-green-900 w-1/4">Email</th>
                <th className="text-left py-2 px-3 font-medium text-green-900 w-1/6">Wallet</th>
                <th className="text-left py-2 px-3 font-medium text-green-900 w-1/6">Status</th>
                <th className="text-left py-2 px-3 font-medium text-green-900 w-1/6">Joined</th>
                <th className="text-left py-2 px-3 font-medium text-green-900 w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-green-50 transition-colors">
                  <td className="py-2 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {(
                            user.first_name?.[0] ||
                            user.last_name?.[0] ||
                            user.username?.[0] ||
                            'U'
                          ).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-green-900 text-sm truncate">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.first_name
                              ? user.first_name
                              : user.last_name
                                ? user.last_name
                                : user.username
                                  ? user.username
                                  : 'Unknown User'}
                        </p>
                        <p className="text-xs text-green-700 truncate">@{user.username || 'unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-green-900 text-sm truncate">{user.email}</td>
                  <td className="py-2 px-3 text-green-900 font-bold text-sm">Ksh {user.wallet_balance}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-green-700 text-sm">{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleBlockUser(user.id, user.is_active)}
                        disabled={loading}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          user.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.is_active ? 'Block' : 'Unblock'}
                      </button>
                      <button
                        className="p-1 text-green-400 hover:text-green-600 rounded-md disabled:opacity-50 min-h-[32px] min-w-[32px] flex items-center justify-center"
                        disabled={loading}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="p-1 text-green-400 hover:text-green-600 rounded-md disabled:opacity-50 min-h-[32px] min-w-[32px] flex items-center justify-center"
                        disabled={loading}
                        onClick={() => {
                          setSelectedUser(user);
                          // Add user detail view logic here
                        }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-green-300 mb-4" />
            <p className="text-green-600 text-lg">No users found</p>
          </div>
        )}


        </div>
      </div>
    );


  // KYC Management Section
  const KycManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">KYC Verification</h2>
      {kycLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kycForms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Shield size={48} className="mx-auto text-green-300 mb-4" />
              <p className="text-green-600 text-lg">No KYC forms found</p>
            </div>
          )}
          {kycForms.map(form => (
            <div
              key={form.id}
              className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-2xl shadow-lg border border-green-200 p-6 flex flex-col space-y-4"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {(form.full_name?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-green-900 text-lg">{form.full_name}</p>
                  <p className="text-sm text-green-700">{form.email}</p>
                  <p className="text-sm text-green-700">Mobile: {form.mobile}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-green-500 text-xs">National ID</span>
                <span className="font-medium text-green-800">{form.national_id}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-green-500 text-xs">Address</span>
                <span className="font-medium text-green-800">{form.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  form.status === "verified"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}>
                  {form.status === "verified" ? <CheckCircle size={14} className="mr-1" /> : <Shield size={14} className="mr-1" />}
                  {form.status}
                </span>
                <span className="text-xs text-green-700 ml-2">
                  {form.date_submitted ? new Date(form.date_submitted).toLocaleDateString() : ""}
                </span>
              </div>
              {form.status !== "verified" && (
                <button
                  className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:from-green-600 hover:to-emerald-600 transition"
                  onClick={() => handleVerifyKyc(form.id)}
                >
                  Verify
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Rentals Management Section
  const RentalsManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Active Rentals</h2>
          <p className="text-green-600">Monitor all active rental investments</p>
        </div>
        <button
          onClick={fetchActiveRentals}
          disabled={loading}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Active Rentals</p>
              <p className="text-2xl font-bold text-green-700">{activeRentalsSummary.total_active_rentals || 0}</p>
            </div>
            <Home size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Locked Amount</p>
              <p className="text-2xl font-bold text-green-700">Ksh {activeRentalsSummary.total_locked_amount?.toFixed(2) || '0.00'}</p>
            </div>
            <DollarSign size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expected Returns</p>
              <p className="text-2xl font-bold text-green-700">Ksh {activeRentalsSummary.total_expected_returns?.toFixed(2) || '0.00'}</p>
            </div>
            <BarChart3 size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mature Rentals</p>
              <p className="text-2xl font-bold text-red-600">{activeRentalsSummary.total_mature_rentals || 0}</p>
            </div>
            <Clock size={24} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Active Rentals List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {activeRentals.length === 0 && !loading && (
              <div className="text-center py-8 text-green-600">No active rentals found</div>
            )}
            {activeRentals.map(rental => (
              <div key={rental.id} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {rental.user_email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-900">{rental.user_full_name}</p>
                      <p className="text-sm text-green-700">{rental.user_email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-green-500 text-xs">Amount</span>
                      <div className="text-green-900 font-bold">Ksh {rental.amount}</div>
                    </div>
                    <div>
                      <span className="text-green-500 text-xs">Expected Return</span>
                      <div className="text-green-900 font-bold">Ksh {rental.expected_return}</div>
                    </div>
                    <div>
                      <span className="text-green-500 text-xs">Duration</span>
                      <div className="text-green-900">{rental.duration_days} days</div>
                    </div>
                    <div>
                      <span className="text-green-500 text-xs">Time Remaining</span>
                      <div className={`font-bold ${rental.is_mature ? 'text-red-600' : 'text-green-900'}`}>
                        {rental.is_mature ? 'Mature' : rental.time_remaining || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-green-200">
                    <span className="text-xs text-green-700">
                      Started: {new Date(rental.created_at).toLocaleDateString()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rental.is_mature ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {rental.is_mature ? 'Ready to Complete' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Table Layout */}
          <table className="w-full hidden md:table">
            <thead className="bg-green-50 border-b border-green-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-green-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-green-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-green-900">Expected Return</th>
                <th className="text-left py-3 px-4 font-medium text-green-900">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-green-900">Time Remaining</th>
                <th className="text-left py-3 px-4 font-medium text-green-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-green-900">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-200">
              {activeRentals.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-green-600">No active rentals found</td>
                </tr>
              ) : (
                activeRentals.map(rental => (
                  <tr key={rental.id} className="hover:bg-green-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {rental.user_email?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-green-900 text-sm">{rental.user_full_name}</p>
                          <p className="text-xs text-green-700">{rental.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-green-900 font-bold">Ksh {rental.amount}</td>
                    <td className="py-3 px-4 text-green-900 font-bold">Ksh {rental.expected_return}</td>
                    <td className="py-3 px-4 text-green-900">{rental.duration_days} days</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${rental.is_mature ? 'text-red-600' : 'text-green-900'}`}>
                        {rental.is_mature ? 'Mature' : rental.time_remaining || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        rental.is_mature ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {rental.is_mature ? 'Ready to Complete' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-green-700 text-sm">
                      {new Date(rental.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Settings Management Section
  const SettingsManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">System Settings</h2>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-green-700 mb-4">System Status</h3>
        <div className="flex items-center space-x-4">
          <Activity size={24} className={systemStatus === 'online' ? 'text-green-500' : 'text-red-500'} />
          <span className={`text-lg font-medium ${systemStatus === 'online' ? 'text-green-700' : 'text-red-700'}`}>
            System is {systemStatus}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Last checked: {new Date().toLocaleString()}</p>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-green-700 mb-4">Maintenance Mode</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => updateSettings('maintenance_mode', e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              disabled={settingsLoading}
            />
            <span className="text-sm font-medium text-gray-900">Enable Maintenance Mode</span>
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">When enabled, users will see a maintenance page.</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-green-700 mb-4">Email Notifications</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => updateSettings('email_notifications', e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              disabled={settingsLoading}
            />
            <span className="text-sm font-medium text-gray-900">Enable Email Notifications</span>
          </label>
        </div>
        <p className="text-sm text-gray-600 mt-2">Send email notifications for important events.</p>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-green-700 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-green-500 text-xs">Version</span>
            <div className="text-green-900 font-medium">1.0.0</div>
          </div>
          <div>
            <span className="text-green-500 text-xs">Environment</span>
            <div className="text-green-900 font-medium">Production</div>
          </div>
          <div>
            <span className="text-green-500 text-xs">Uptime</span>
            <div className="text-green-900 font-medium">24h 30m</div>
          </div>
          <div>
            <span className="text-green-500 text-xs">Database</span>
            <div className="text-green-900 font-medium">PostgreSQL</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-green-700 mb-4">System Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
            onClick={() => alert('Refreshing system data...')}
          >
            Refresh Data
          </button>
          <button
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            onClick={() => alert('Clearing cache...')}
          >
            Clear Cache
          </button>
          <button
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
            onClick={() => alert('Backing up data...')}
          >
            Backup Data
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-[#0F5D4E] flex relative">
      <Particles />
      <Waves />
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}

      <aside className={`bg-[#0A3D32] shadow-lg w-64 min-h-screen p-4 md:p-6 transition-all duration-300 fixed md:relative z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-bold text-white">Admin</span>

          <button className="md:hidden text-white hover:text-[#A8E6CF]" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="space-y-2">

          {menuItems.map(item => (
            <button
              key={item.id}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-white hover:bg-[#0F5D4E] transition-colors font-medium ${activeSection === item.id ? 'bg-[#0F5D4E]' : ''}`}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 safe-area-inset-top safe-area-inset-bottom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">

            <button className="md:hidden text-white hover:text-[#A8E6CF] mr-4" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-[#A8E6CF]">Welcome, {adminData.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">

            <button className="bg-[#0F5D4E] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0A3D32]" onClick={handleLogout}><LogOut size={18} className="inline mr-2" />Logout</button>
          </div>
        </div>

        {/* Section Content */}

        {activeSection === 'overview' && (
          <>
            {/* Stats Overview with Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Users Stats Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-[#0F5D4E] mb-4 text-center">Users Overview</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active Users', value: parseInt(stats.find(s => s.title === 'Total Users')?.value || '0'), fill: '#0F5D4E' },
                        { name: 'Pending KYC', value: parseInt(stats.find(s => s.title === 'Pending KYC')?.value || '0'), fill: '#A8E6CF' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#0F5D4E" />
                      <Cell fill="#A8E6CF" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-[#0F5D4E]">Total: {stats.find(s => s.title === 'Total Users')?.value || '0'}</p>
                </div>
              </div>

              {/* Withdrawals Stats Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-[#0F5D4E] mb-4 text-center">Withdrawals Overview</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: parseInt(stats.find(s => s.title === 'Pending Withdrawals')?.value || '0'), fill: '#FFD700' },
                        { name: 'Total', value: parseInt(stats.find(s => s.title === 'Total Withdrawals')?.value || '0'), fill: '#FF6B6B' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#FFD700" />
                      <Cell fill="#FF6B6B" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-[#0F5D4E]">Pending: {stats.find(s => s.title === 'Pending Withdrawals')?.value || '0'}</p>
                </div>
              </div>

              {/* Financial Stats Pie Chart */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-[#0F5D4E] mb-4 text-center">Financial Overview</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Wallet Balance', value: parseFloat(stats.find(s => s.title === 'Total Wallet Balance')?.value?.replace(/[^\d.-]/g, '') || '0'), fill: '#4ECDC4' },
                        { name: 'Revenue', value: parseFloat(stats.find(s => s.title === 'Monthly Revenue')?.value?.replace(/[^\d.-]/g, '') || '0'), fill: '#45B7D1' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#4ECDC4" />
                      <Cell fill="#45B7D1" />
                    </Pie>
                    <Tooltip formatter={(value) => [`Ksh ${value}`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-sm text-[#0F5D4E]">Balance: {stats.find(s => s.title === 'Total Wallet Balance')?.value || 'Ksh 0'}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards for Mobile Visibility */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-4 border border-gray-200 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#0F5D4E]">{stat.value}</div>
                  <div className="text-sm text-[#0F5D4E] mt-1">{stat.title}</div>
                  <div className={`text-xs mt-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
              <h2 className="text-lg md:text-xl font-bold text-[#0F5D4E] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveSection('users')}
                  className="flex flex-col items-center p-4 bg-[#0F5D4E]/10 rounded-lg hover:bg-[#0F5D4E]/20 transition-colors"
                >
                  <Users size={24} className="text-[#0F5D4E] mb-2" />
                  <span className="text-sm font-medium text-[#0F5D4E]">Users</span>
                </button>
                <button
                  onClick={() => setActiveSection('withdrawals')}
                  className="flex flex-col items-center p-4 bg-[#0F5D4E]/10 rounded-lg hover:bg-[#0F5D4E]/20 transition-colors"
                >
                  <DollarSign size={24} className="text-[#0F5D4E] mb-2" />
                  <span className="text-sm font-medium text-[#0F5D4E]">Withdrawals</span>
                </button>
                <button
                  onClick={() => setActiveSection('kyc')}
                  className="flex flex-col items-center p-4 bg-[#0F5D4E]/10 rounded-lg hover:bg-[#0F5D4E]/20 transition-colors"
                >
                  <FileCheck size={24} className="text-[#0F5D4E] mb-2" />
                  <span className="text-sm font-medium text-[#0F5D4E]">KYC</span>
                </button>
                <button
                  onClick={() => setActiveSection('referrals')}
                  className="flex flex-col items-center p-4 bg-[#0F5D4E]/10 rounded-lg hover:bg-[#0F5D4E]/20 transition-colors"
                >
                  <CheckCircle size={24} className="text-[#0F5D4E] mb-2" />
                  <span className="text-sm font-medium text-[#0F5D4E]">Referrals</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeSection === 'users' && <UsersManagement />}
        {activeSection === 'withdrawals' && <WithdrawalsManagement />}
        {activeSection === 'rentals' && <RentalsManagement />}
        {activeSection === 'referrals' && <ReferralsManagement />}
        {activeSection === 'kyc' && <KycManagement />}
        {activeSection === 'settings' && <SettingsManagement />}
        {activeSection === 'support' && <Contact isAdmin={true} />}

        {/* User Profile Modal */}
        {userProfileModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#0F5D4E]">User Profile</h3>
                  <button
                    onClick={() => setUserProfileModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#0F5D4E] to-[#0A3D32] rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xl">
                        {(selectedUser.first_name?.[0] || selectedUser.last_name?.[0] || selectedUser.username?.[0] || 'U').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#0A3D32]">
                        {selectedUser.first_name && selectedUser.last_name
                          ? `${selectedUser.first_name} ${selectedUser.last_name}`
                          : selectedUser.first_name || selectedUser.last_name || selectedUser.username || 'Unknown User'}
                      </h4>
                      <p className="text-[#0F5D4E]">@{selectedUser.username || 'unknown'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#0F5D4E]/5 rounded-lg p-4">
                      <span className="text-[#0F5D4E] text-xs font-medium">Email</span>
                      <div className="text-[#0A3D32] font-medium">{selectedUser.email}</div>
                    </div>

                    <div className="bg-[#0F5D4E]/5 rounded-lg p-4">
                      <span className="text-[#0F5D4E] text-xs font-medium">Phone Number</span>
                      <div className="text-[#0A3D32] font-medium">{selectedUser.phone_number || 'Not provided'}</div>
                    </div>

                    <div className="bg-[#0F5D4E]/5 rounded-lg p-4">
                      <span className="text-[#0F5D4E] text-xs font-medium">Wallet Balance</span>
                      <div className="text-[#0A3D32] font-bold text-lg">Ksh {selectedUser.wallet_balance || '0'}</div>
                    </div>

                    <div className="bg-[#0F5D4E]/5 rounded-lg p-4">
                      <span className="text-[#0F5D4E] text-xs font-medium">Status</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                        selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </div>

                    <div className="bg-[#0F5D4E]/5 rounded-lg p-4">
                      <span className="text-[#0F5D4E] text-xs font-medium">Joined</span>
                      <div className="text-[#0A3D32] font-medium">
                        {new Date(selectedUser.date_joined).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Referrer Details Modal */}
        {selectedReferrer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#0F5D4E]">Referred Users by {selectedReferrer.referrerEmail || selectedReferrer.referrer}</h3>
                  <button
                    onClick={() => setSelectedReferrer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedReferrer.referrals.map((ref, refIdx) => {
                    const referredUser = users.find(u => u.email === ref.referred_email);
                    return (
                      <div key={refIdx} className="bg-[#0F5D4E]/5 rounded-lg p-4 border border-[#0F5D4E]/20">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <button
                              onClick={() => referredUser && showUserProfile(referredUser)}
                              className="text-[#0A3D32] font-medium hover:text-[#0F5D4E] transition-colors text-left"
                              disabled={!referredUser}
                            >
                              {ref.referred_email || ref.referred_full_name || 'Unknown'}
                              {referredUser && <Eye size={14} className="inline ml-1" />}
                            </button>
                            <div className="text-[#0A3D32] text-sm">
                              {ref.created_at ? new Date(ref.created_at).toLocaleDateString() : '-'}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            ref.completed ? 'bg-[#0F5D4E]/20 text-[#0A3D32]' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ref.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
