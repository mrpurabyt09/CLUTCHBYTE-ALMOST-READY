import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Key, Lock, Eye, EyeOff, Shield, Info, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

interface SetNewPasswordProps {
  email: string;
  onLogin: () => void;
  onSuccess: () => void;
}

export const SetNewPassword: React.FC<SetNewPasswordProps> = ({ email, onLogin, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = authService.updatePassword(email, password);
    
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex flex-col font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2332]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="size-8 text-[#135bec] flex items-center justify-center">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48">
                  <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">ClutchByte</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Remember your password?</span>
              <button onClick={onLogin} className="text-sm font-semibold text-[#135bec] hover:text-[#135bec]/80 transition-colors">Log in</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#135bec]/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#135bec]/10 blur-[100px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-[#1a2332] rounded-xl shadow-2xl shadow-black/20 border border-slate-200 dark:border-slate-800 z-10 relative overflow-hidden"
        >
          <div className="h-2 bg-[#135bec] w-full"></div>
          <div className="px-8 py-8 pt-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#135bec]/10 text-[#135bec] mb-4">
                <Key size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Set New Password</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Please create a strong password for your account <br className="hidden sm:block"/> <span className="text-slate-700 dark:text-slate-300 font-medium">{email}</span>
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm"
              >
                <AlertCircle size={18} />
                <p>{error}</p>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-500 text-sm"
              >
                <CheckCircle2 size={18} />
                <p>Password updated! Redirecting to login...</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key size={20} />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading || isSuccess}
                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-[#101622] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent sm:text-sm transition-all shadow-sm disabled:opacity-50"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isSuccess}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Password Strength Meter */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                  <span className="text-amber-500 font-medium">Medium</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full">
                  <div className="h-full w-1/4 rounded-full bg-amber-500"></div>
                  <div className="h-full w-1/4 rounded-full bg-amber-500"></div>
                  <div className="h-full w-1/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-full w-1/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                  <Info size={14} />
                  Must contain 8+ characters, 1 number & 1 symbol.
                </p>
              </div>

              <div className="group mt-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading || isSuccess}
                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-[#101622] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-transparent sm:text-sm transition-all shadow-sm disabled:opacity-50"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading || isSuccess}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <button 
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#135bec] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#135bec] focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : 'Update Password'}
                </button>
              </div>

              <div className="mt-2 text-center sm:hidden">
                <button onClick={onLogin} className="text-sm font-medium text-[#135bec] hover:text-[#135bec]/80">
                  Back to Log in
                </button>
              </div>
            </form>
          </div>

          <div className="px-8 py-4 bg-slate-50 dark:bg-[#151c2a] border-t border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Shield size={14} className="text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
              Secure, encrypted connection. Your data is protected by industry standard encryption protocols.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="w-full py-6 text-center border-t border-slate-200 dark:border-slate-800/50 bg-white dark:bg-[#101622] text-slate-500 dark:text-slate-600 text-sm">
        <p>© 2024 ClutchByte AI Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
