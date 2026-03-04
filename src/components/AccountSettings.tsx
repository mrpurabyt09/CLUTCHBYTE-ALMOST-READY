import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings } from '../types';
import { useAuth } from '../context/AuthContext';
import { updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

interface AccountSettingsProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'security' | 'preferences' | 'billing';

export const AccountSettings: React.FC<AccountSettingsProps> = ({ settings, onSave, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [localSettings, setLocalSettings] = useState(settings);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSave = () => {
    onSave(localSettings);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }

    setIsUpdating(true);
    setStatus(null);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setStatus({ type: 'success', message: 'Password updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to update password.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 flex bg-background-light dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden h-full">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#101622]">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 lg:py-12">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
            <p className="text-slate-400">Manage your profile, security preferences, and AI configurations.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Settings Sidebar Menu (In-page) */}
            <div className="lg:col-span-3">
              <nav className="flex space-x-2 overflow-x-auto lg:flex-col lg:space-x-0 lg:space-y-1">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full text-left ${activeTab === 'profile' ? 'bg-[#192233] text-white shadow-sm ring-1 ring-white/10 lg:bg-[#135bec]/10 lg:text-[#135bec] lg:ring-[#135bec]/20' : 'text-slate-400 hover:bg-[#192233] hover:text-white'}`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${activeTab === 'profile' ? 'lg:text-[#135bec]' : ''}`}>person</span>
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full text-left ${activeTab === 'security' ? 'bg-[#192233] text-white shadow-sm ring-1 ring-white/10 lg:bg-[#135bec]/10 lg:text-[#135bec] lg:ring-[#135bec]/20' : 'text-slate-400 hover:bg-[#192233] hover:text-white'}`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${activeTab === 'security' ? 'lg:text-[#135bec]' : ''}`}>lock</span>
                  Security
                </button>
                <button 
                  onClick={() => setActiveTab('preferences')}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full text-left ${activeTab === 'preferences' ? 'bg-[#192233] text-white shadow-sm ring-1 ring-white/10 lg:bg-[#135bec]/10 lg:text-[#135bec] lg:ring-[#135bec]/20' : 'text-slate-400 hover:bg-[#192233] hover:text-white'}`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${activeTab === 'preferences' ? 'lg:text-[#135bec]' : ''}`}>tune</span>
                  Preferences
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors w-full text-left ${activeTab === 'billing' ? 'bg-[#192233] text-white shadow-sm ring-1 ring-white/10 lg:bg-[#135bec]/10 lg:text-[#135bec] lg:ring-[#135bec]/20' : 'text-slate-400 hover:bg-[#192233] hover:text-white'}`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${activeTab === 'billing' ? 'lg:text-[#135bec]' : ''}`}>credit_card</span>
                  Billing
                </button>
              </nav>
            </div>

            {/* Settings Content Form */}
            <div className="flex flex-col gap-8 lg:col-span-9">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.section 
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-[#232f48] bg-[#192233] p-6 shadow-sm"
                  >
                    <div className="mb-6 flex items-center justify-between border-b border-[#232f48] pb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-white">Public Profile</h2>
                        <p className="text-sm text-slate-400">This will be displayed on your shared chats.</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                          <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#111722] bg-neutral-800">
                            <img 
                              alt="User Avatar" 
                              className="h-full w-full object-cover" 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1RYKMv9iy5ikOK96eyLZV_WRFkIHuDyoLK56J27SjiH6bHSR7o1CLL4QX1sZr7qa0HrdAls7c_nBL0TKG3EEeJg_BvEOjuE-95Ot89R9FVEAWY5qKQOH__ctohi2MxpJKGOPoEvy0dg5DOvIurNzXTEcbqwOyFTcL6U7-MqjylP546HyHvwTJe43R5NRqbEm0jFDYuCbbAATZlreYD9mAuN3VcSKfb8kLaSSwEwb4RpNFctZ1dRpx053yKB3I4V9wX_bvxN1_xo4"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#135bec] text-white shadow-md transition-transform hover:scale-110">
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button className="inline-flex h-9 items-center justify-center rounded-lg bg-[#232f48] px-4 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
                            Change Avatar
                          </button>
                          <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                        </div>
                      </div>
                      {/* Form Fields */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-slate-300" htmlFor="display_name">Display Name</label>
                          <div className="relative">
                            <input 
                              className="w-full rounded-lg border-[#232f48] bg-[#111722] py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec]" 
                              id="display_name" 
                              type="text" 
                              defaultValue={user?.displayName || ''}
                              readOnly
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                              <span className="material-symbols-outlined text-[18px]">badge</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-slate-300" htmlFor="email">Email Address</label>
                          <div className="relative">
                            <input 
                              className="w-full rounded-lg border-[#232f48] bg-[#111722] py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec]" 
                              id="email" 
                              type="email" 
                              defaultValue={user?.email || ''}
                              readOnly
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                              <span className="material-symbols-outlined text-[18px]">mail</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label className="text-sm font-medium text-slate-300" htmlFor="bio">Bio</label>
                          <textarea 
                            className="w-full rounded-lg border-[#232f48] bg-[#111722] p-3 text-sm text-white placeholder-slate-500 focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec]" 
                            id="bio" 
                            placeholder="Tell us a little about yourself..." 
                            rows={3}
                          ></textarea>
                          <p className="mt-1 text-xs text-slate-500">Brief description for your profile. URLs are hyperlinked.</p>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {activeTab === 'preferences' && (
                  <motion.section 
                    key="preferences"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-[#232f48] bg-[#192233] p-6 shadow-sm"
                  >
                    <div className="mb-6 border-b border-[#232f48] pb-4">
                      <h2 className="text-lg font-semibold text-white">App Preferences</h2>
                      <p className="text-sm text-slate-400">Customize your chat experience and interface.</p>
                    </div>
                    <div className="space-y-6">
                      {/* Default Model */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <label className="block text-sm font-medium text-white">Default AI Model</label>
                          <p className="text-xs text-slate-500">Select which model starts new conversations.</p>
                        </div>
                        <select 
                          value={localSettings.defaultModel}
                          onChange={(e) => setLocalSettings({ ...localSettings, defaultModel: e.target.value })}
                          className="w-full sm:w-64 rounded-lg border-[#232f48] bg-[#111722] py-2 pl-3 pr-10 text-sm text-white focus:border-[#135bec] focus:ring-[#135bec]"
                        >
                          <option value="gpt-4-turbo">GPT-4 Turbo (Recommended)</option>
                          <option value="claude-3-opus">Claude 3 Opus</option>
                          <option value="llama-3-70b">Llama 3 70B</option>
                          <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                        </select>
                      </div>
                      <hr className="border-[#232f48]"/>
                      {/* Theme Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Interface Theme</p>
                          <p className="text-xs text-slate-500">Select your preferred color scheme.</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-[#111722] p-1 border border-[#232f48]">
                          <button 
                            onClick={() => setLocalSettings({ ...localSettings, isDarkMode: true })}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${localSettings.isDarkMode ? 'bg-[#192233] text-white shadow-sm ring-1 ring-white/10' : 'text-slate-500 hover:text-white'}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">dark_mode</span>
                            Dark
                          </button>
                          <button 
                            onClick={() => setLocalSettings({ ...localSettings, isDarkMode: false })}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${!localSettings.isDarkMode ? 'bg-[#192233] text-white shadow-sm ring-1 ring-white/10' : 'text-slate-500 hover:text-white'}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">light_mode</span>
                            Light
                          </button>
                        </div>
                      </div>
                      <hr className="border-[#232f48]"/>
                      {/* Language */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <label className="block text-sm font-medium text-white">Language</label>
                          <p className="text-xs text-slate-500">Set the interface language.</p>
                        </div>
                        <select className="w-full sm:w-64 rounded-lg border-[#232f48] bg-[#111722] py-2 pl-3 pr-10 text-sm text-white focus:border-[#135bec] focus:ring-[#135bec]">
                          <option>English (US)</option>
                          <option>French</option>
                          <option>Spanish</option>
                          <option>German</option>
                          <option>Japanese</option>
                        </select>
                      </div>
                    </div>
                  </motion.section>
                )}

                {activeTab === 'security' && (
                  <motion.section 
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-[#232f48] bg-[#192233] p-6 shadow-sm"
                  >
                    <div className="mb-6 border-b border-[#232f48] pb-4">
                      <h2 className="text-lg font-semibold text-white">Security & Login</h2>
                      <p className="text-sm text-slate-400">Keep your account safe with a strong password and 2FA.</p>
                    </div>
                    <div className="space-y-6">
                      {status && (
                        <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                          {status.message}
                        </div>
                      )}
                      {/* Password Change */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="col-span-full">
                          <label className="block text-sm font-medium text-white mb-2">Change Password</label>
                        </div>
                        <div className="relative">
                          <input 
                            className="w-full rounded-lg border-[#232f48] bg-[#111722] py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec]" 
                            placeholder="New Password" 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="relative">
                          <input 
                            className="w-full rounded-lg border-[#232f48] bg-[#111722] py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec]" 
                            placeholder="Confirm New Password" 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <div className="col-span-full mt-2">
                          <button 
                            onClick={handleUpdatePassword}
                            disabled={isUpdating}
                            className="rounded-lg bg-[#232f48] px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                          >
                            {isUpdating ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </div>
                      <hr className="border-[#232f48]"/>
                      {/* 2FA Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                            <span className="inline-flex items-center rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">Enabled</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Secure your account with TOTP (Google Authenticator, Authy).</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input defaultChecked className="peer sr-only" type="checkbox" />
                          <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-gray-300 after:transition-all after:content-[''] peer-checked:bg-[#135bec] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#135bec]/50"></div>
                        </label>
                      </div>
                    </div>
                  </motion.section>
                )}

                {activeTab === 'billing' && (
                  <motion.section 
                    key="billing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl border border-[#232f48] bg-[#192233] p-6 shadow-sm"
                  >
                    <div className="mb-6 border-b border-[#232f48] pb-4">
                      <h2 className="text-lg font-semibold text-white">Billing & Subscription</h2>
                      <p className="text-sm text-slate-400">Manage your subscription plan and payment methods.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-[#111722] border border-[#232f48] flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">Current Plan: Pro</p>
                          <p className="text-xs text-slate-500">$20/month • Renews on April 12, 2026</p>
                        </div>
                        <button className="px-3 py-1.5 text-xs font-bold text-[#135bec] hover:underline">Change Plan</button>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-white">Payment Methods</p>
                        <div className="flex items-center justify-between p-3 bg-[#111722] rounded-lg border border-[#232f48]">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">credit_card</span>
                            <span className="text-sm text-white">•••• 4242</span>
                          </div>
                          <button className="text-xs text-slate-500 hover:text-white">Edit</button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Danger Zone */}
              <section className="rounded-xl border border-red-900/30 bg-red-950/10 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
                    <p className="text-sm text-red-300/70 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                  </div>
                  <button className="mt-2 sm:mt-0 whitespace-nowrap rounded-lg border border-red-900/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    Delete Account
                  </button>
                </div>
              </section>

              {/* Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 pb-12">
                <button onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} className="rounded-lg bg-[#135bec] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#135bec]/20 hover:bg-[#1d6bf5] transition-all focus:ring-2 focus:ring-[#135bec] focus:ring-offset-2 focus:ring-offset-[#101622]">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
