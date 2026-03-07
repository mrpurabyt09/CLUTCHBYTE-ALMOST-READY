import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'motion/react';
import { Shield, Key, Bell, Database, Globe, Lock, Save } from 'lucide-react';

export function SettingsConfig() {
  const [settings, setSettings] = useState<any>({
    allowPublicSignup: true,
    requireEmailVerification: true,
    enableAuditLogging: true,
    maintenanceMode: false,
    maxTokensPerRequest: 4096,
    defaultModel: 'gpt-4-turbo'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = async (key: string) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings, { merge: true });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-[#2a3649]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="text-[#135bec]" size={20} />
            Security & Access
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Public Signup</p>
              <p className="text-sm text-slate-500">Allow new users to register without an invite</p>
            </div>
            <button 
              onClick={() => handleToggle('allowPublicSignup')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allowPublicSignup ? 'bg-[#135bec]' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowPublicSignup ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Email Verification</p>
              <p className="text-sm text-slate-500">Require email verification before access</p>
            </div>
            <button 
              onClick={() => handleToggle('requireEmailVerification')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.requireEmailVerification ? 'bg-[#135bec]' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Maintenance Mode</p>
              <p className="text-sm text-slate-500">Disable access for non-admin users</p>
            </div>
            <button 
              onClick={() => handleToggle('maintenanceMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-[#2a3649]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="text-[#135bec]" size={20} />
            System Limits
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Tokens Per Request</label>
            <input 
              type="number" 
              value={settings.maxTokensPerRequest}
              onChange={(e) => handleChange('maxTokensPerRequest', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2a3649] bg-white dark:bg-[#141b26] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec]/50 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Model</label>
            <select 
              value={settings.defaultModel}
              onChange={(e) => handleChange('defaultModel', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2a3649] bg-white dark:bg-[#141b26] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec]/50 outline-none"
            >
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#135bec] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
