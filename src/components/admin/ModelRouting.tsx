import React from 'react';
import { motion } from 'motion/react';
import { Route, Zap, Save, AlertCircle } from 'lucide-react';

export function ModelRouting() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-8"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Model Routing & Fallback</h2>
            <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-[10px] font-bold uppercase tracking-wider">Smart Routing Enabled</span>
          </div>
          <button className="px-6 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Save size={18} />
            Save Routing Rules
          </button>
        </div>

        {/* Routing Logic */}
        <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-[#2a3649] bg-slate-50/50 dark:bg-white/5">
            <h3 className="font-bold text-slate-900 dark:text-white">Active Routing Rules</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Rule 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#2a3649] bg-slate-50 dark:bg-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Route size={20} className="text-[#135bec]" />
                  <h4 className="font-bold text-slate-900 dark:text-white">High-Priority Traffic</h4>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#135bec]"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Primary Model</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3649] outline-none text-sm text-slate-900 dark:text-white">
                    <option>Gemini 1.5 Pro</option>
                    <option>GPT-4 Turbo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Fallback Model</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3649] outline-none text-sm text-slate-900 dark:text-white">
                    <option>GPT-4 Turbo</option>
                    <option>Claude 3 Opus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#2a3649] bg-slate-50 dark:bg-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={20} className="text-[#135bec]" />
                  <h4 className="font-bold text-slate-900 dark:text-white">Low-Latency Fast Path</h4>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#135bec]"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Primary Model</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3649] outline-none text-sm text-slate-900 dark:text-white">
                    <option>Gemini 1.5 Flash</option>
                    <option>GPT-3.5 Turbo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Fallback Model</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3649] outline-none text-sm text-slate-900 dark:text-white">
                    <option>GPT-3.5 Turbo</option>
                    <option>Llama 3 8B</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fallback Triggers */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fallback Triggers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1a2332] p-6 rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertCircle size={16} className="text-amber-500" />
                <h4 className="text-sm font-bold">Latency Threshold</h4>
              </div>
              <p className="text-xs text-slate-400">Trigger fallback if response exceeds 2.5s</p>
            </div>
            <div className="bg-white dark:bg-[#1a2332] p-6 rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertCircle size={16} className="text-amber-500" />
                <h4 className="text-sm font-bold">Error Rate</h4>
              </div>
              <p className="text-xs text-slate-400">Trigger fallback if 5xx errors &gt; 2%</p>
            </div>
            <div className="bg-white dark:bg-[#1a2332] p-6 rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertCircle size={16} className="text-amber-500" />
                <h4 className="text-sm font-bold">Token Limit</h4>
              </div>
              <p className="text-xs text-slate-400">Trigger fallback if prompt &gt; 128k tokens</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
