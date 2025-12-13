import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Users, Zap, Award, CheckCircle, Menu, X, Phone, Mail, MapPin, Lock, Smartphone, BarChart3, Star, Sparkles, Gift, Timer, CircleDollarSign, Coins, ArrowUpRight, Percent, Clock, Target } from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState(1000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [liveCounter, setLiveCounter] = useState(2847563);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [floatingNum, setFloatingNum] = useState(0);
  const navigate = useNavigate();

  const colors = {
    primary: '#0F5D4E',
    primaryLight: '#1A7D6A',
    primaryDark: '#0A4539',
    accent: '#E5A500',
    accentLight: '#FFB81C',
    background: '#FFFFFF',
    foreground: '#0F3D35',
    muted: '#F0F5F4',
    mutedForeground: '#5A6F6A',
    border: '#D4E0DE',
    dark: '#0F3D35',
    white: '#FFFFFF',
  };

  // Animated counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 500) + 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation index
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % 6);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Floating numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingNum(prev => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    { icon: TrendingUp, title: 'Guaranteed 100% Returns', desc: 'Watch your money investments in just 20 days with guaranteed returns on every investment.' },
    { icon: Shield, title: 'Fully Licensed & Regulated', desc: 'Licensed by County Governments and regulated by Capital Markets Authority (CMA).' },
    { icon: Smartphone, title: 'M-Pesa Integration', desc: 'Deposit and withdraw instantly using M-Pesa. No bank visits, no paperwork.' },
    { icon: Lock, title: 'Bank-Level Security', desc: '256-bit SSL encryption protects all your data and transactions.' },
    { icon: Users, title: 'Earn by Referring', desc: 'Share with friends and earn 50% commission on their investments.' },
    { icon: BarChart3, title: 'Real-Time Tracking', desc: 'Monitor your investments 24/7 from anywhere with live updates.' },
  ];

  const investmentOptions = [
    { currency: 'Canadian Dollar', code: 'CAD', amount: 100, flag: '🇨🇦', returns: 200 },
    { currency: 'Australian Dollar', code: 'AUD', amount: 250, flag: '🇦🇺', returns: 500 },
    { currency: 'British Pound', code: 'GBP', amount: 500, flag: '🇬🇧', returns: 1000 },
    { currency: 'Japanese Yen', code: 'JPY', amount: 750, flag: '🇯🇵', returns: 1500 },
    { currency: 'Euro', code: 'EUR', amount: 1000, flag: '🇪🇺', returns: 2000 },
    { currency: 'US Dollar', code: 'USD', amount: 1200, flag: '🇺🇸', returns: 2400 },
  ];

  const howItWorks = [
    { step: '1', title: 'Sign Up in Minutes', description: 'Create your free account with just your phone number and email.', icon: Users },
    { step: '2', title: 'Choose Your Investment', description: 'Pick from 6 global currencies starting at just KES 100.', icon: TrendingUp },
    { step: '3', title: 'Watch It Grow', description: 'Track your investment in real-time. After 20 days, your money doubles.', icon: Award },
    { step: '4', title: 'Withdraw Anytime', description: 'Cash out your returns instantly to your M-Pesa.', icon: Zap }
  ];

  const faqs = [
    { question: 'How does LiquiInvest KE work?', answer: 'You invest in global currencies for 20 days and receive 100% returns at maturity.' },
    { question: 'Is my money safe?', answer: 'Absolutely! We are licensed by CBK and regulated by CMA with 256-bit encryption.' },
    { question: 'What is the minimum investment?', answer: 'You can start investing with as little as KES 100.' },
    { question: 'How do I withdraw my money?', answer: 'Withdrawals are processed instantly to your M-Pesa within 24 hours.' },
    { question: 'Can I invest multiple times?', answer: 'Yes! You can make unlimited investments across different currencies.' }
  ];

  const wheelPrizes = [
    { name: '500 Points', color: colors.primary },
    { name: '100 Points', color: colors.primaryLight },
    { name: '1000 Points', color: colors.primaryDark },
    { name: '250 Points', color: colors.primaryLight },
    { name: '750 Points', color: colors.primary },
    { name: '200 Points', color: colors.primaryLight },
  ];

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * wheelPrizes.length);
    setTimeout(() => {
      setWinner(wheelPrizes[randomIndex]);
      setIsSpinning(false);
      setHasSpun(true);
    }, 3000);
  };

  const graphicElements = [
    { icon: CircleDollarSign, value: '+100%', delay: 0 },
    { icon: TrendingUp, value: '20 Days', delay: 1 },
    { icon: Coins, value: '2X', delay: 2 },
    { icon: Target, value: 'Goal', delay: 3 },
    { icon: ArrowUpRight, value: 'Grow', delay: 4 },
    { icon: Percent, value: 'Profit', delay: 5 },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(1800deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 5px ${colors.accent}40; } 50% { box-shadow: 0 0 25px ${colors.accent}80; } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes countUp { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(80px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
        @keyframes morphBg { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
        .orbit-1 { animation: orbit 8s linear infinite; }
        .orbit-2 { animation: orbit 12s linear infinite reverse; }
        .orbit-3 { animation: orbit 10s linear infinite; }
        .morph-bg { animation: morphBg 8s ease-in-out infinite; }
        .float-anim { animation: float 3s ease-in-out infinite; }
        .glow-anim { animation: glow 2s ease-in-out infinite; }
        .ripple-anim { animation: ripple 2s ease-out infinite; }
        @media (min-width: 768px) {
          .hero-content { grid-template-columns: 1fr 1fr !important; }
          .hero-text { text-align: left !important; }
          .hero-title { font-size: 40px !important; }
          .hero-buttons { flex-direction: row !important; }
          .hero-checks { justify-content: flex-start !important; }
          .spin-content { grid-template-columns: 1fr 1fr !important; }
          .wheel { width: 320px !important; height: 320px !important; }
        }
        @media (min-width: 1024px) {
          .nav-links { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .hero-title { font-size: 48px !important; }
        }
        @media (max-width: 1023px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none; width: 28px; height: 28px; background: ${colors.primary}; border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px ${colors.primary}60;
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ backgroundColor: colors.background, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 50, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: colors.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: 'bold', fontSize: '20px' }}>L</div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: colors.foreground }}>LiquiInvest KE</span>
          </div>
          
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#benefits" style={{ color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none' }}>Benefits</a>
            <a href="#how-it-works" style={{ color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none' }}>How It Works</a>
            <a href="#investments" style={{ color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none' }}>Investments</a>
            <a href="#faq" style={{ color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none' }}>FAQ</a>
            <button onClick={() => navigate('/login')} style={{ padding: '8px 20px', color: colors.primary, border: `2px solid ${colors.primary}`, borderRadius: '8px', fontWeight: '600', backgroundColor: 'transparent', cursor: 'pointer' }}>Login</button>
            <button onClick={() => navigate('/register')} style={{ padding: '8px 20px', backgroundColor: colors.primary, color: colors.white, borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Get Started</button>
          </div>

          <button className="mobile-menu-btn" style={{ display: 'none', padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} color={colors.foreground} /> : <Menu size={24} color={colors.foreground} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{ backgroundColor: colors.background, borderTop: `1px solid ${colors.border}`, padding: '16px' }}>
            <a href="#benefits" style={{ display: 'block', color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none', padding: '12px 0' }}>Benefits</a>
            <a href="#how-it-works" style={{ display: 'block', color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none', padding: '12px 0' }}>How It Works</a>
            <a href="#investments" style={{ display: 'block', color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none', padding: '12px 0' }}>Investments</a>
            <a href="#faq" style={{ display: 'block', color: colors.mutedForeground, fontWeight: '500', textDecoration: 'none', padding: '12px 0' }}>FAQ</a>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '12px' }}>
              <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '12px', color: colors.primary, border: `2px solid ${colors.primary}`, borderRadius: '8px', fontWeight: '600', backgroundColor: 'transparent', cursor: 'pointer' }}>Login</button>
              <button onClick={() => navigate('/register')} style={{ width: '100%', padding: '12px', backgroundColor: colors.primary, color: colors.white, borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: colors.primary, color: colors.white, padding: '48px 16px' }}>
        <div className="hero-content" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '32px', alignItems: 'center' }}>
          
          {/* Graphical Calculator Card */}
          <div style={{ backgroundColor: colors.background, borderRadius: '24px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
            
            {/* Animated Background Shape */}
            <div className="morph-bg" style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', backgroundColor: `${colors.primary}10`, zIndex: 0 }}></div>
            <div className="morph-bg" style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', backgroundColor: `${colors.accent}15`, zIndex: 0, animationDelay: '2s' }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header with animated icons */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div className="float-anim" style={{ animationDelay: '0s' }}><Sparkles color={colors.accent} size={24} /></div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: colors.foreground, margin: 0, background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Calculate Your Returns</h3>
                  <div className="float-anim" style={{ animationDelay: '0.5s' }}><Sparkles color={colors.accent} size={24} /></div>
                </div>
                <p style={{ fontSize: '13px', color: colors.mutedForeground, margin: 0 }}>See the magic of compound growth</p>
              </div>

              {/* Orbiting Elements Display */}
              <div style={{ position: 'relative', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {/* Center Circle with Counter */}
                <div className="glow-anim" style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: colors.primary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, border: `4px solid ${colors.accent}` }}>
                  <div style={{ fontSize: '11px', color: colors.white, opacity: 0.8, marginBottom: '2px' }}>LIVE POOL</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: colors.accent, fontFamily: 'monospace', animation: 'countUp 2s infinite' }}>
                    KES {liveCounter.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '10px', color: colors.white, opacity: 0.7, marginTop: '2px' }}>& growing...</div>
                </div>

                {/* Ripple Effect */}
                <div className="ripple-anim" style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', border: `2px solid ${colors.primary}`, zIndex: 5 }}></div>
                <div className="ripple-anim" style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', border: `2px solid ${colors.accent}`, zIndex: 5, animationDelay: '1s' }}></div>

                {/* Orbiting Icons */}
                {graphicElements.map((el, idx) => (
                  <div key={idx} className={`orbit-${(idx % 3) + 1}`} style={{ position: 'absolute', width: '44px', height: '44px', borderRadius: '12px', backgroundColor: pulseIndex === idx ? colors.accent : colors.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: pulseIndex === idx ? `0 0 20px ${colors.accent}` : '0 4px 15px rgba(0,0,0,0.15)', transition: 'all 0.3s', border: `2px solid ${pulseIndex === idx ? colors.accent : colors.primary}20`, animationDelay: `${idx * 0.5}s` }}>
                    <el.icon size={16} color={pulseIndex === idx ? colors.white : colors.primary} />
                    <span style={{ fontSize: '8px', fontWeight: 'bold', color: pulseIndex === idx ? colors.white : colors.primary, marginTop: '2px' }}>{el.value}</span>
                  </div>
                ))}
              </div>

              {/* Mysterious Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
                {[
                  { label: '???', subLabel: 'Secret Rate', icon: Percent },
                  { label: '20', subLabel: 'Days Only', icon: Clock },
                  { label: '2X', subLabel: 'Your Money', icon: Target },
                ].map((stat, idx) => (
                  <div key={idx} style={{ backgroundColor: `${colors.primary}08`, borderRadius: '12px', padding: '12px 8px', textAlign: 'center', border: `1px dashed ${colors.primary}30`, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '40px', height: '40px', backgroundColor: `${colors.accent}20`, borderRadius: '50%' }}></div>
                    <stat.icon size={18} color={colors.primary} style={{ marginBottom: '4px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>{stat.label}</div>
                    <div style={{ fontSize: '10px', color: colors.mutedForeground }}>{stat.subLabel}</div>
                  </div>
                ))}
              </div>

              {/* Interactive Slider */}
              <div style={{ backgroundColor: `${colors.primary}05`, borderRadius: '16px', padding: '20px', border: `2px solid ${colors.primary}20`, marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: colors.foreground }}>Slide to discover...</span>
                  <span style={{ fontSize: '12px', color: colors.accent, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> Interactive
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(parseInt(e.target.value))}
                  style={{ width: '100%', height: '12px', borderRadius: '8px', backgroundColor: `${colors.primary}20`, appearance: 'none', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: colors.mutedForeground }}>
                  <span>KES 100</span>
                  <span style={{ color: colors.primary, fontWeight: 'bold' }}>KES {investAmount.toLocaleString()}</span>
                  <span>KES 10,000</span>
                </div>
              </div>

              {/* Results Display */}
              <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, borderRadius: '16px', padding: '20px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '0', right: '0', width: '100px', height: '100px', background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 70%)` }}></div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: colors.white, opacity: 0.8, marginBottom: '4px' }}>YOU PUT IN</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.white }}>KES {investAmount.toLocaleString()}</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="float-anim" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={20} color={colors.foreground} />
                    </div>
                    <span style={{ fontSize: '10px', color: colors.accent, fontWeight: 'bold', marginTop: '4px' }}>20 DAYS</span>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: colors.white, opacity: 0.8, marginBottom: '4px' }}>YOU GET BACK</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.accent }}>{(investAmount * 2).toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${colors.white}20`, textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: `${colors.white}20`, padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: colors.white }}>
                    <Gift size={16} color={colors.accent} />
                    Pure Profit: KES {investAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Mystery Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                {[
                  { icon: Shield, text: 'Protected' },
                  { icon: Lock, text: 'Encrypted' },
                  { icon: Star, text: 'Verified' },
                ].map((badge, idx) => (
                  <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: colors.mutedForeground, backgroundColor: `${colors.muted}`, padding: '6px 12px', borderRadius: '20px', border: `1px solid ${colors.border}` }}>
                    <badge.icon size={12} color={colors.primary} /> {badge.text}
                  </span>
                ))}
              </div>

              <button onClick={() => navigate('/register')} style={{ width: '100%', padding: '16px', backgroundColor: colors.primary, color: colors.white, borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 4px 20px ${colors.primary}40` }}>
                Unlock the Secret <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Hero Text */}
          <div className="hero-text" style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', backgroundColor: colors.primaryDark, padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>🇰🇪 Trusted across Kenya</div>
            <h1 className="hero-title" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.2' }}>Turn KES 100 Into KES 200 in Just 20 Days</h1>
            <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9, lineHeight: '1.6' }}>Join Kenya's most trusted investment platform. Safe, licensed, and ready to grow your wealth starting today.</p>
            <div className="hero-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => navigate('/register')} style={{ padding: '16px 32px', backgroundColor: colors.background, color: colors.primary, borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Start Investing Now <ArrowRight size={20} />
              </button>
              <a href="#how-it-works" style={{ padding: '16px 32px', backgroundColor: colors.primaryDark, color: colors.white, borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', textDecoration: 'none', textAlign: 'center' }}>See How It Works</a>
            </div>
            <div className="hero-checks" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '14px' }}><CheckCircle size={18} /> CBK Licensed</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '14px' }}><CheckCircle size={18} /> 100% Secure</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '14px' }}><CheckCircle size={18} /> Instant M-Pesa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{ padding: '48px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.foreground, marginBottom: '12px' }}>Why Thousands Choose LiquiInvest KE</h2>
            <p style={{ fontSize: '16px', color: colors.mutedForeground, maxWidth: '768px', margin: '0 auto' }}>Experience the safest, simplest, and most rewarding way to grow your money</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {benefits.map((benefit, index) => (
              <div key={index} style={{ backgroundColor: `${colors.muted}50`, padding: '32px', borderRadius: '12px', border: '2px solid transparent' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: colors.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <benefit.icon color={colors.white} size={28} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.foreground, marginBottom: '12px' }}>{benefit.title}</h3>
                <p style={{ fontSize: '14px', color: colors.mutedForeground, lineHeight: '1.6' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ backgroundColor: `${colors.primary}08`, padding: '48px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.foreground, marginBottom: '12px' }}>How LiquiInvest Works</h2>
            <p style={{ fontSize: '16px', color: colors.mutedForeground }}>From signup to payout in 4 simple steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {howItWorks.map((step, index) => (
              <div key={index} style={{ backgroundColor: colors.background, padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>{step.step}</div>
                <div style={{ width: '48px', height: '48px', backgroundColor: `${colors.primary}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <step.icon color={colors.primary} size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.foreground, marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: colors.mutedForeground, lineHeight: '1.6' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Currency Options */}
      <section id="investments" style={{ padding: '48px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.foreground, marginBottom: '12px' }}>Our Currency Options</h2>
            <p style={{ fontSize: '16px', color: colors.mutedForeground }}>Invest in 6 global currencies — All with guaranteed 100% returns</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', maxWidth: '960px', margin: '0 auto' }}>
            {investmentOptions.map((option, index) => (
              <div key={index} style={{ backgroundColor: `${colors.primary}08`, padding: '20px', borderRadius: '12px', border: `2px solid ${colors.primary}40` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{option.flag}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', color: colors.foreground }}>{option.code}</div>
                      <div style={{ fontSize: '11px', color: colors.mutedForeground }}>{option.currency}</div>
                    </div>
                  </div>
                  <span style={{ padding: '4px 8px', backgroundColor: colors.accent, color: colors.foreground, borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>+100%</span>
                </div>
                <div style={{ fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: colors.mutedForeground }}>Invest:</span>
                    <span style={{ fontWeight: 'bold', color: colors.foreground }}>KES {option.amount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: colors.mutedForeground }}>Returns:</span>
                    <span style={{ fontWeight: 'bold', color: colors.accent }}>KES {option.returns}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <button onClick={() => navigate('/register')} style={{ padding: '16px 40px', backgroundColor: colors.primary, color: colors.white, borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Start Investing Today <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Spinning Wheel Section */}
      <section id="spinning-wheel" style={{ backgroundColor: colors.dark, color: colors.white, padding: '48px 16px' }}>
        <div className="spin-content" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '48px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="wheel" style={{ position: 'relative', width: '280px', height: '280px' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '56px', height: '56px', backgroundColor: colors.background, borderRadius: '50%', zIndex: 30, boxShadow: '0 10px 25px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `4px solid ${colors.primary}` }}>
                <div style={{ width: '28px', height: '28px', backgroundColor: colors.primary, borderRadius: '50%' }}></div>
              </div>
              <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', zIndex: 40, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: `28px solid ${colors.accent}` }}></div>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', border: `8px solid ${colors.accent}`, animation: isSpinning ? 'spin 3s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards' : 'none' }}>
                {wheelPrizes.map((prize, index) => {
                  const rotation = (360 / wheelPrizes.length) * index;
                  return (
                    <div key={index} style={{ position: 'absolute', width: '50%', height: '50%', transformOrigin: 'bottom right', transform: `rotate(${rotation}deg)`, clipPath: 'polygon(100% 100%, 0% 100%, 50% 0%)', top: 0, left: 0, backgroundColor: prize.color }}>
                      <span style={{ position: 'absolute', color: colors.white, fontWeight: 'bold', fontSize: '11px', top: '30%', left: '55%', transform: 'rotate(30deg)', width: '60px', textAlign: 'center' }}>{prize.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={spinWheel} disabled={isSpinning || hasSpun} style={{ marginTop: '32px', padding: '16px 40px', borderRadius: '50px', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: isSpinning || hasSpun ? 'not-allowed' : 'pointer', backgroundColor: isSpinning || hasSpun ? colors.mutedForeground : colors.accent, color: isSpinning || hasSpun ? '#999' : colors.foreground }}>
              {isSpinning ? 'SPINNING...' : hasSpun ? 'ALREADY SPUN!' : 'SPIN NOW!'}
            </button>

            {winner && (
              <div style={{ marginTop: '24px', backgroundColor: colors.primary, color: colors.white, padding: '16px 32px', borderRadius: '12px', textAlign: 'center', animation: 'bounce 1s infinite' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>🎉 CONGRATULATIONS! 🎉</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{winner.name}</div>
                <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>Sign up now to claim!</div>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>How to Play the Points Game</h3>
            {[
              { num: '1', title: 'Spin the Wheel', desc: 'Click "SPIN NOW" to reveal your points reward' },
              { num: '2', title: 'Create Your Account', desc: 'Sign up and complete verification' },
              { num: '3', title: 'Get Your Points', desc: 'Points are automatically credited to your account' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '16px', flexShrink: 0 }}>{item.num}</div>
                <div>
                  <h4 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{item.title}</h4>
                  <p style={{ color: '#9CA3AF', fontSize: '14px' }}>{item.desc}</p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '32px', backgroundColor: colors.primary, padding: '24px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <Award color={colors.accent} size={24} style={{ marginRight: '12px' }} />
                <h4 style={{ fontWeight: 'bold', fontSize: '18px' }}>Special Offer!</h4>
              </div>
              <p style={{ opacity: 0.9, fontSize: '14px' }}>New users get access to exclusive investment opportunities!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ backgroundColor: `${colors.muted}50`, padding: '48px 16px' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: colors.foreground, marginBottom: '12px' }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: '16px', color: colors.mutedForeground }}>Everything you need to know</p>
          </div>
          {faqs.map((faq, index) => (
            <div key={index} style={{ backgroundColor: colors.background, padding: '32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.foreground, marginBottom: '12px' }}>{faq.question}</h3>
              <p style={{ fontSize: '14px', color: colors.mutedForeground, lineHeight: '1.6' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: colors.primary, color: colors.white, padding: '48px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>Ready to Double Your Money?</h2>
          <p style={{ fontSize: '16px', marginBottom: '32px', opacity: 0.9, lineHeight: '1.6' }}>Join 10,000+ Kenyans already earning guaranteed returns. Start with just KES 100 today.</p>
          <button onClick={() => navigate('/register')} style={{ padding: '20px 48px', backgroundColor: colors.background, color: colors.primary, borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            Create Free Account <ArrowRight size={24} />
          </button>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginTop: '32px', opacity: 0.9 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><CheckCircle size={18} /> No hidden fees</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><CheckCircle size={18} /> Instant M-Pesa</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}><CheckCircle size={18} /> 100% secure</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: colors.dark, color: colors.white, padding: '48px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: colors.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.white, fontWeight: 'bold', fontSize: '20px' }}>L</div>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>LiquiInvest KE</span>
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>Kenya's premier investment platform for guaranteed returns.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><a href="#benefits" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Benefits</a></li>
                <li><a href="#how-it-works" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px' }}>How It Works</a></li>
                <li><a href="#investments" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Investments</a></li>
                <li><a href="#faq" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px' }}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Terms of Service</a></li>
                <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '8px' }}>About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>Contact Us</h4>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#9CA3AF', fontSize: '14px', marginBottom: '12px' }}><Mail size={16} /> info@liquiinvest.co.ke</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#9CA3AF', fontSize: '14px', marginBottom: '12px' }}><Phone size={16} /> +254 XXX XXX XXX</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#9CA3AF', fontSize: '14px', marginBottom: '12px' }}><MapPin size={16} /> Nairobi, Kenya</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '32px', textAlign: 'center' }}>
            <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '8px' }}>Licensed by Central Bank of Kenya (CBK) • Regulated by Capital Markets Authority (CMA)</p>
            <p style={{ color: '#6B7280', fontSize: '12px' }}>© 2024 LiquiInvest KE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
