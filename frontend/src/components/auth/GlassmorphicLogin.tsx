import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  AlertCircle,
  Chrome
} from 'lucide-react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';

const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div
    className={`
      backdrop-blur-xl bg-white/40 border border-blue-200/30 rounded-2xl
      shadow-lg shadow-blue-100/20 transition-all duration-300
      ${className}
    `}
    {...props}
  >
    {children}
  </motion.div>
);

const ShimmerButton = ({ children, className = '', loading = false, ...props }) => (
  <motion.button
    className={`
      relative overflow-hidden bg-gradient-to-r from-blue-500 to-sky-600
      text-white font-semibold px-6 py-3 rounded-xl shadow-lg
      hover:shadow-xl transition-all duration-300 disabled:opacity-50
      ${className}
    `}
    whileHover={{ scale: loading ? 1 : 1.02 }}
    whileTap={{ scale: loading ? 1 : 0.98 }}
    disabled={loading}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                    transform -skew-x-12 -translate-x-full animate-shimmer" />
    {children}
  </motion.button>
);

const GlassmorphicLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginWithGoogle } = useFirebaseAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      const errorMsg = 'Please fill in all fields';
      setError(errorMsg);
      showError('Login Failed', errorMsg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      showSuccess('Login Successful', 'Welcome back to SignConnect!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to login';
      
      // Handle specific Firebase auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection';
            break;
          case 'auth/api-key-not-valid':
            errorMessage = 'Firebase configuration error. Please contact support';
            break;
          default:
            errorMessage = error.message || 'Failed to login';
        }
      }
      
      setError(errorMessage);
      showError('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      console.log('🚀 Starting Google login process...');
      
      await loginWithGoogle();
      showSuccess('Login Successful', 'Welcome to SignConnect!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      let errorMessage = 'Failed to login with Google';
      
      // Handle specific Google auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/unauthorized-domain':
            errorMessage = 'Domain not authorized. Please contact support to add this domain to Firebase.';
            break;
          case 'auth/popup-closed-by-user':
            errorMessage = 'Login cancelled by user';
            break;
          case 'auth/popup-blocked':
            errorMessage = 'Popup blocked. Please allow popups and try again';
            break;
          case 'auth/cancelled-popup-request':
            errorMessage = 'Login cancelled';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection';
            break;
          case 'auth/api-key-not-valid':
            errorMessage = 'Firebase configuration error. Please contact support';
            break;
          case 'auth/invalid-api-key':
            errorMessage = 'Invalid Firebase API key. Please contact support';
            break;
          case 'auth/app-not-authorized':
            errorMessage = 'App not authorized. Please contact support';
            break;
          default:
            errorMessage = error.message || 'Failed to login with Google';
        }
      }
      
      setError(errorMessage);
      showError('Google Login Failed', errorMessage);
      
      // Additional debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 Detailed error info:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,197,253,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(165,180,252,0.1),transparent)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 bg-white/50 border-blue-200/50">
          {/* Logo and Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to continue to SignConnect</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-xl flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Google Sign In Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white/70 border border-blue-200/50 rounded-xl text-slate-700 hover:bg-white/80 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
              ) : (
                <Chrome className="w-5 h-5 text-blue-500" />
              )}
              <span className="font-medium">
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>
            
            {/* Helpful note for domain issues */}
            {error && error.includes('Domain not authorized') && (
              <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200/50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Tip:</strong> Try using <code className="bg-blue-100 px-1 rounded">localhost:3000</code> instead of the network IP address.
                </p>
              </div>
            )}
          </motion.div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-200/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/50 text-slate-500 rounded-lg">or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 border border-blue-200/50 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/70 border border-blue-200/50 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-white/70 border-blue-200/50 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-slate-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <ShimmerButton
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-sky-600"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </ShimmerButton>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-slate-600">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up here
            </Link>
          </motion.div>


        </GlassCard>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-sky-500/20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
};

export default GlassmorphicLogin;