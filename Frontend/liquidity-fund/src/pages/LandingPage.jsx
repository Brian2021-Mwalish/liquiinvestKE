import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Users, Zap, Clock, Award, CheckCircle, Menu, X, Phone, Mail, MapPin, Lock, Smartphone, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState(1000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const navigate = useNavigate();

  const benefits = [
    { 
      icon: TrendingUp, 
      title: 'Guaranteed 100% Returns', 
      desc: 'Watch your money double in just 20 days with guaranteed returns on every investment. No hidden fees, no surprises.' 
    },
    { 
      icon: Shield, 
      title: 'Fully Licensed & Regulated', 
      desc: 'Licensed by Central Bank of Kenya (CBK) and regulated by Capital Markets Authority (CMA) for your complete peace of mind.' 
    },
    { 
      icon: Smartphone, 
      title: 'M-Pesa Integration', 
      desc: 'Deposit and withdraw instantly using M-Pesa. No bank visits, no paperwork - just quick and easy mobile money transactions.' 
    },
    { 
      icon: Lock, 
      title: 'Bank-Level Security', 
      desc: '256-bit SSL encryption protects all your data and transactions. Your information is safe with us, always.' 
    },
    { 
      icon: Users, 
      title: 'Earn by Referring', 
      desc: 'Share with friends and earn 50% commission on their investments. Build passive income while helping others grow their wealth.' 
    },
    { 
      icon: BarChart3, 
      title: 'Real-Time Tracking', 
      desc: 'Monitor your investments 24/7 from anywhere. See your money grow with live updates on your dashboard.' 
    },
  ];

  const investmentOptions = [
    { currency: 'Canadian Dollar (CAD)', amount: 100, flag: '🇨🇦', returns: 200 },
    { currency: 'Australian Dollar (AUD)', amount: 250, flag: '🇦🇺', returns: 500 },
    { currency: 'British Pound (GBP)', amount: 500, flag: '🇬🇧', returns: 1000 },
    { currency: 'Japanese Yen (JPY)', amount: 750, flag: '🇯🇵', returns: 1500 },
    { currency: 'Euro (EUR)', amount: 1000, flag: '🇪🇺', returns: 2000 },
    { currency: 'US Dollar (USD)', amount: 1200, flag: '🇺🇸', returns: 2400 },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up in Minutes',
      description: 'Create your free account with just your phone number and email. Complete a quick verification process and you\'re ready to invest.',
      icon: Users
    },
    {
      step: '2',
      title: 'Choose Your Investment',
      description: 'Pick from 6 global currencies starting at just KES 100. Pay instantly via M-Pesa and your investment begins immediately.',
      icon: TrendingUp
    },
    {
      step: '3',
      title: 'Watch It Grow',
      description: 'Track your investment in real-time. After 20 days, your money doubles automatically and gets credited to your wallet.',
      icon: Award
    },
    {
      step: '4',
      title: 'Withdraw Anytime',
      description: 'Cash out your returns instantly to your M-Pesa. No waiting periods, no hassles - your money, your timeline.',
      icon: Zap
    }
  ];



  const faqs = [
    {
      question: 'How does LiquiInvest KE work?',
      answer: 'You invest in global currencies for 20 days and receive 100% returns (double your investment) at maturity. It\'s that simple!'
    },
    {
      question: 'Is my money safe?',
      answer: 'Absolutely! We are licensed by CBK and regulated by CMA. All transactions use 256-bit encryption and we never share your data.'
    },
    {
      question: 'What is the minimum investment?',
      answer: 'You can start investing with as little as KES 100. No large capital needed - start small and grow!'
    },
    {
      question: 'How do I withdraw my money?',
      answer: 'Withdrawals are processed instantly to your M-Pesa account. Simply request a withdrawal from your dashboard and receive funds within 24 hours.'
    },
    {
      question: 'Can I invest multiple times?',
      answer: 'Yes! You can make unlimited investments across different currencies. Diversify and maximize your returns.'
    }
  ];

  const wheelPrizes = [
    { name: '500 Points', color: 'bg-green-600', textColor: 'text-white' },
    { name: '100 Points', color: 'bg-green-500', textColor: 'text-white' },
    { name: '1000 Points', color: 'bg-green-700', textColor: 'text-white' },
    { name: '250 Points', color: 'bg-green-500', textColor: 'text-white' },
    { name: '750 Points', color: 'bg-green-600', textColor: 'text-white' },
    { name: '200 Points', color: 'bg-green-500', textColor: 'text-white' },
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LiquiInvest KE</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#benefits" className="text-gray-700 hover:text-green-600 font-medium">Benefits</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 font-medium">How It Works</a>
              <a href="#investments" className="text-gray-700 hover:text-green-600 font-medium">Investments</a>
              <a href="#faq" className="text-gray-700 hover:text-green-600 font-medium">FAQ</a>
              <button onClick={() => navigate('/login')} className="px-5 py-2 text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#benefits" className="block text-gray-700 hover:text-green-600 font-medium py-2">Benefits</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-green-600 font-medium py-2">How It Works</a>
              <a href="#investments" className="block text-gray-700 hover:text-green-600 font-medium py-2">Investments</a>
              <a href="#faq" className="block text-gray-700 hover:text-green-600 font-medium py-2">FAQ</a>
              <button onClick={() => navigate('/login')} className="w-full px-4 py-2 text-green-600 border-2 border-green-600 rounded-lg font-semibold mb-2">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Calculate Your Returns</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-gray-700 font-semibold mb-3 block">How much do you want to invest?</label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(parseInt(e.target.value))}
                    className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>KES 100</span>
                    <span>KES 10,000</span>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-600">
                  <div className="text-sm text-gray-600 mb-2">You Invest</div>
                  <div className="text-4xl font-bold text-green-600 mb-4">
                    KES {investAmount.toLocaleString()}
                  </div>

                  <div className="flex items-center justify-center py-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">You Get Back</div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    KES {(investAmount * 2).toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    Profit: KES {investAmount.toLocaleString()} in 20 days
                  </div>
                </div>

                <button onClick={() => navigate('/register')} className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition">
                  Get Started Now
                </button>
              </div>
            </div>

            <div>
              <div className="inline-block bg-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                🇰🇪 Trusted by People Who Value Growth
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                Turn KES 100 Into KES 200 in Just 20 Days
              </h1>
              <p className="text-xl mb-8 text-green-50 leading-relaxed">
                People trust our investment platform for safe, licensed opportunities that grow wealth reliably. Start your journey today with KES 100
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition flex items-center justify-center">
                  Start Investing Now <ArrowRight className="ml-2" size={20} />
                </button>
                <button className="px-8 py-4 bg-green-700 text-white rounded-lg font-bold text-lg hover:bg-green-800 transition">
                  See How It Works
                </button>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span className="text-green-50">CBK Licensed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span className="text-green-50">100% Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span className="text-green-50">Instant M-Pesa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Thousands Choose LiquiInvest KE</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the safest, simplest, and most rewarding way to grow your money in Kenya
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-600">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-5">
                  <benefit.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">How LiquiInvest Works</h2>
            <p className="text-xl text-gray-600">From signup to payout in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-5 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Currency Showcase Wheel */}
      <section id="investments" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Currency Options</h2>
            <p className="text-xl text-gray-600">Invest in 6 global currencies - All with guaranteed 100% returns in 20 days</p>
          </div>

          <div className="flex flex-col items-center">
            {/* Rotating Currency Wheel */}
            <div className="relative w-96 h-96 mb-12">
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-600 rounded-full z-20 shadow-2xl flex flex-col items-center justify-center text-white border-4 border-white">
                <TrendingUp size={32} className="mb-2" />
                <div className="text-sm font-bold">100%</div>
                <div className="text-xs">Returns</div>
              </div>

              {/* Rotating Wheel */}
              <div className="w-full h-full relative animate-spin-slow">
                {investmentOptions.map((option, index) => {
                  const angle = (360 / investmentOptions.length) * index;
                  const radius = 160;
                  const x = radius * Math.cos((angle - 90) * Math.PI / 180);
                  const y = radius * Math.sin((angle - 90) * Math.PI / 180);
                  
                  return (
                    <div
                      key={index}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      }}
                    >
                      <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-green-600 w-28 h-28 flex flex-col items-center justify-center hover:scale-110 transition-transform">
                        <div className="text-3xl mb-1">{option.flag}</div>
                        <div className="text-xs font-bold text-gray-900 text-center">{option.code}</div>
                        <div className="text-xs text-green-600 font-bold mt-1">KES {option.amount}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Orbit Ring */}
              <div className="absolute inset-0 border-4 border-green-600 border-dashed rounded-full opacity-30"></div>
            </div>

            {/* Currency Details Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {investmentOptions.map((option, index) => (
                <div key={index} className="bg-green-50 p-6 rounded-xl border-2 border-green-600 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{option.flag}</span>
                      <div>
                        <div className="font-bold text-gray-900">{option.code}</div>
                        <div className="text-xs text-gray-600">{option.currency}</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                      +100%
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-bold text-gray-900">KES {option.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Returns:</span>
                      <span className="font-bold text-green-600">KES {option.returns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit:</span>
                      <span className="font-bold text-green-700">KES {option.amount}</span>
                    </div>
                    <div className="text-center pt-2 border-t border-green-300">
                      <span className="text-xs text-gray-600">Matures in 20 days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button onClick={() => navigate('/register')} className="px-10 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition flex items-center mx-auto">
                Start Investing Today <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 30s linear infinite;
          }
        `}</style>
      </section>

      {/* Spinning Wheel Section */}
      <section id="spinning-wheel" className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Spin & Win Your Signup Bonus!</h2>
            <p className="text-xl text-gray-300">Try your luck and win up to KES 1,000 bonus when you create an account</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Wheel Container */}
                <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                  {/* Center Pin */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-30 shadow-2xl flex items-center justify-center border-4 border-green-600">
                    <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                  </div>

                  {/* Pointer */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" style={{borderTopWidth: '24px'}}></div>
                  </div>

                  {/* Spinning Wheel */}
                  <div 
                    className={`w-full h-full rounded-full shadow-2xl relative ${isSpinning ? 'animate-spin' : ''}`}
                    style={{
                      animation: isSpinning ? 'spin 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                    }}
                  >
                    {wheelPrizes.map((prize, index) => {
                      const rotation = (360 / wheelPrizes.length) * index;
                      return (
                        <div
                          key={index}
                          className={`absolute w-1/2 h-1/2 origin-bottom-right ${prize.color}`}
                          style={{
                            transform: `rotate(${rotation}deg)`,
                            clipPath: 'polygon(100% 100%, 0% 100%, 50% 0%)',
                            top: 0,
                            left: 0,
                          }}
                        >
                          <div 
                            className={`absolute ${prize.textColor} font-bold text-xs sm:text-sm`}
                            style={{
                              top: '30%',
                              left: '60%',
                              transform: `rotate(${30}deg)`,
                              width: '80px',
                              textAlign: 'center'
                            }}
                          >
                            {prize.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Outer Ring */}
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-400"></div>
                </div>
              </div>

              <button 
                onClick={spinWheel}
                disabled={isSpinning || hasSpun}
                className={`mt-8 px-10 py-4 rounded-full font-bold text-xl transition-all transform ${
                  isSpinning || hasSpun 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSpinning ? 'SPINNING...' : hasSpun ? 'ALREADY SPUN!' : 'SPIN NOW!'}
              </button>

              {winner && (
                <div className="mt-6 text-center animate-bounce">
                  <div className="bg-green-600 text-white px-8 py-4 rounded-xl shadow-xl">
                    <div className="text-sm font-semibold mb-1">🎉 CONGRATULATIONS! 🎉</div>
                    <div className="text-2xl font-bold">{winner.name}</div>
                    <div className="text-sm mt-2 opacity-90">Sign up now to claim your points!</div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-white">
              <h3 className="text-3xl font-bold mb-6">How to Play the Points Game</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Spin the Wheel</h4>
                    <p className="text-gray-300">Click the "SPIN NOW" button and watch the wheel spin to reveal your points reward</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Create Your Account</h4>
                    <p className="text-gray-300">Sign up with your details and complete the quick KYC verification process</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Get Your Points</h4>
                    <p className="text-gray-300">Your points will be automatically credited to your account - ready to use!</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-green-600 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <Award className="mr-3" size={28} />
                  <h4 className="font-bold text-xl">Special Offer!</h4>
                </div>
                <p className="text-green-50">New users who sign up today also get access to exclusive investment opportunities with priority processing!</p>
              </div>

              <a href="#spinning-wheel" className="mt-8 w-full py-4 text-green-600 font-bold text-lg hover:text-green-700 transition flex items-center justify-center">
                Play Now <ArrowRight className="ml-2" size={20} />
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(1800deg); }
          }
        `}</style>
      </section>



      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about investing with us</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Double Your Money?</h2>
          <p className="text-xl mb-10 text-green-50 leading-relaxed">
            Join 10,000+ Kenyans already earning guaranteed returns. Start with just KES 100 today.
          </p>
          <button onClick={() => navigate('/register')} className="px-12 py-5 bg-white text-green-600 rounded-lg font-bold text-xl hover:bg-gray-100 transition inline-flex items-center">
            Create Free Account <ArrowRight className="ml-3" size={24} />
          </button>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-green-100">
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={20} />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={20} />
              <span>Instant M-Pesa</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2" size={20} />
              <span>100% secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="text-xl font-bold">LiquiInvest KE</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Kenya's premier investment platform for guaranteed returns. Licensed and regulated for your safety.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#benefits" className="hover:text-green-400">Benefits</a></li>
                <li><a href="#how-it-works" className="hover:text-green-400">How It Works</a></li>
                <li><a href="#investments" className="hover:text-green-400">Investments</a></li>
                <li><a href="#faq" className="hover:text-green-400">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400">About Us</a></li>
                <li><a href="#" className="hover:text-green-400">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <Mail className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>info@liquiinvest.co.ke</span>
                </li>
                <li className="flex items-start">
                  <Phone className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>+254 XXX XXX XXX</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-2">Licensed by Central Bank of Kenya (CBK) • Regulated by Capital Markets Authority (CMA)</p>
            <p className="text-gray-500">© 2024 LiquiInvest KE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;