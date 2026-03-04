import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Bot, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  onRegister: () => void;
  onForgotPassword: () => void;
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onRegister, onForgotPassword, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithGithub } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'GitHub') => {
    setError(null);
    setIsLoading(true);

    try {
      if (provider === 'Google') {
        await signInWithGoogle();
      } else {
        await signInWithGithub();
      }
      onLogin();
    } catch (err: any) {
      console.error(`${provider} OAuth error:`, err);
      setError(`Failed to connect with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-[#192233] rounded-2xl border border-gray-200 dark:border-[#232f48] shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#135bec] via-blue-400 to-indigo-500"></div>
          
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="flex items-center gap-2 text-[#135bec] mb-6">
                <Bot size={32} />
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">ClutchByte</h2>
              </div>
              <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight mb-2">Welcome back</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Log in to your account to continue.</p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="email"
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] border border-gray-300 dark:border-[#324467] bg-gray-50 dark:bg-[#101622] h-12 pl-10 pr-4 text-base placeholder:text-slate-400 transition-all disabled:opacity-50"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">Password</label>
                  <button 
                    type="button"
                    onClick={onForgotPassword}
                    disabled={isLoading}
                    className="text-sm font-medium text-[#135bec] hover:underline disabled:opacity-50"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] border border-gray-300 dark:border-[#324467] bg-gray-50 dark:bg-[#101622] h-12 pl-10 pr-10 text-base placeholder:text-slate-400 transition-all disabled:opacity-50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-[#135bec] hover:bg-blue-600 text-white text-base font-bold transition-all shadow-lg shadow-[#135bec]/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : 'Log In'}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-[#324467]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#192233] text-slate-500 dark:text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-lg h-11 border border-gray-200 dark:border-[#324467] bg-white dark:bg-[#101622] hover:bg-gray-50 dark:hover:bg-[#1e293b] text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-lg h-11 border border-gray-200 dark:border-[#324467] bg-white dark:bg-[#101622] hover:bg-gray-50 dark:hover:bg-[#1e293b] text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
                GitHub
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account? 
                <button 
                  onClick={onRegister}
                  className="text-[#135bec] hover:text-blue-400 font-semibold hover:underline transition-colors ml-1"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
