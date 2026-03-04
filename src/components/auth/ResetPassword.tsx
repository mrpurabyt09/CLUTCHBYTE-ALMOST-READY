import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Bot, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

interface ResetPasswordProps {
  onBackToLogin: () => void;
  onSendLink: (email: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBackToLogin, onSendLink }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
      
      // Wait a bit then move back to login or show success
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-[#192233] rounded-2xl border border-gray-200 dark:border-[#232f48] shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="size-12 bg-[#135bec]/10 rounded-xl flex items-center justify-center text-[#135bec] mb-4">
                <Bot size={28} />
              </div>
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight mb-2">ClutchByte</h2>
              <h1 className="text-slate-900 dark:text-white text-xl font-bold mb-2">Reset your password</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Enter your email address and we'll send you a link to reset your password.
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
                <p>Reset link sent! Redirecting...</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="email"
                    required
                    disabled={isLoading || isSuccess}
                    className="w-full rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] border border-gray-300 dark:border-[#324467] bg-gray-50 dark:bg-[#101622] h-12 pl-10 pr-4 text-base placeholder:text-slate-400 transition-all disabled:opacity-50"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-[#135bec] hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-[#135bec]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : 'Send Reset Link'}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#232f48] text-center">
              <button 
                onClick={onBackToLogin}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#135bec] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </div>
        </div>
        
        {/* Support Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Having trouble? <a href="#" className="text-[#135bec] hover:underline">Contact Support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
