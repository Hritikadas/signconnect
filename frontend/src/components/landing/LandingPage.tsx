import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Hand, 
  Video, 
  Globe, 
  Play, 
  ArrowRight, 
  Sparkles,
  Users,
  Zap,
  CheckCircle,
  Star
} from 'lucide-react';

// Floating Orb Component
const FloatingOrb = ({ size, color, delay = 0, duration = 8 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${size} ${color}`}
    animate={{
      x: [0, 100, -50, 0],
      y: [0, -100, 50, 0],
      scale: [1, 1.2, 0.8, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Glassmorphic Card Component
const GlassCard = ({ children, className = '', hover = true, ...props }) => (
  <motion.div
    className={`
      backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl
      shadow-lg shadow-purple-100/20 transition-all duration-500
      ${hover ? 'hover:bg-white/30 hover:shadow-xl hover:shadow-purple-200/30' : ''}
      ${className}
    `}
    whileHover={hover ? { y: -8, scale: 1.02 } : {}}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Shimmer Button Component
const ShimmerButton = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = "relative overflow-hidden font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 group";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white hover:shadow-2xl hover:shadow-purple-500/25",
    outline: "border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
      )}
      {children}
    </motion.button>
  );
};

// AI Status Badge Component
const AIStatusBadge = () => (
  <motion.div
    className="fixed top-8 right-8 z-50"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1.5 }}
  >
    <GlassCard className="px-4 py-2 bg-emerald-500/20 border-emerald-400/40" hover={false}>
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-2 h-2 bg-emerald-400 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-emerald-100 text-sm font-medium">Live Detection Ready</span>
      </div>
    </GlassCard>
  </motion.div>
);

// Feature Preview Card Component
const FeaturePreviewCard = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      icon: Hand,
      title: "Real-time Recognition",
      description: "Advanced AI interprets sign language with 99.2% accuracy",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: Video,
      title: "HD Video Calls",
      description: "Crystal clear video communication with low latency",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Breaking communication barriers worldwide",
      color: "from-emerald-400 to-teal-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="mt-16"
    >
      <GlassCard className="p-8 max-w-4xl mx-auto bg-white/10 border-white/20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`text-center cursor-pointer transition-all duration-500 ${
                activeFeature === index ? 'scale-105' : 'opacity-70'
              }`}
              onClick={() => setActiveFeature(index)}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} 
                           flex items-center justify-center shadow-lg`}
                animate={activeFeature === index ? { 
                  boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-purple-100 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Stats Component
const StatsSection = () => {
  const stats = [
    { number: "99.2%", label: "Accuracy Rate", icon: CheckCircle },
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "15ms", label: "Response Time", icon: Zap },
    { number: "4.9★", label: "User Rating", icon: Star }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="mt-20"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            className="text-center"
          >
            <GlassCard className="p-6 bg-white/10 border-white/20" hover={false}>
              <stat.icon className="w-8 h-8 text-purple-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-purple-200 text-sm">{stat.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleWatchDemo = () => {
    // You can implement demo video modal or navigation here
    console.log('Watch demo clicked');
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-['Inter',sans-serif]">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2))",
              "linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Orbs */}
      <FloatingOrb size="w-96 h-96" color="bg-blue-400" delay={0} duration={12} />
      <FloatingOrb size="w-80 h-80" color="bg-purple-400" delay={2} duration={10} />
      <FloatingOrb size="w-64 h-64" color="bg-pink-400" delay={4} duration={14} />
      <FloatingOrb size="w-72 h-72" color="bg-indigo-400" delay={1} duration={11} />

      {/* AI Status Badge */}
      <AIStatusBadge />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Bridging Silence
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              with Innovation
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            className="text-xl md:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Real-time AI sign language interpretation for a more inclusive world.
            <br />
            <span className="text-purple-600 font-semibold">Connect, communicate, and collaborate without barriers.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ShimmerButton
              onClick={handleGetStarted}
              className="text-lg px-10 py-5 shadow-2xl shadow-purple-500/25"
            >
              <span className="flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </ShimmerButton>

            <ShimmerButton
              variant="outline"
              onClick={handleWatchDemo}
              className="text-lg px-10 py-5 text-slate-700 border-slate-400/50 hover:text-slate-800"
            >
              <span className="flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </span>
            </ShimmerButton>
          </motion.div>
        </motion.div>

        {/* Feature Preview Cards */}
        <FeaturePreviewCard />

        {/* Stats Section */}
        <StatsSection />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-20 mb-12"
        >
          <GlassCard className="p-8 max-w-2xl mx-auto bg-white/15 border-white/25">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Ready to get started?</h3>
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-purple-100 mb-6">
              Join thousands of users already breaking communication barriers with SignConnect.
            </p>
            <ShimmerButton
              onClick={handleGetStarted}
              className="w-full sm:w-auto"
            >
              Start Your Journey Today
            </ShimmerButton>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;