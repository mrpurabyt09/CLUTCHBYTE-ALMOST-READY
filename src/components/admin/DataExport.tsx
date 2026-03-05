import React from 'react';
import { motion } from 'motion/react';
import { Download, CheckCircle, FileJson, FileSpreadsheet, Database } from 'lucide-react';

export function DataExport() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Export Tool</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Configure and generate data exports for analysis or backup.</p>
          </div>
          <button className="px-6 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Download size={18} />
            Generate Export
          </button>
        </div>

        {/* Export Configuration */}
        <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Data Types */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select Data Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'profiles', label: 'User Profiles', checked: true },
                  { id: 'chats', label: 'Chat History', checked: true },
                  { id: 'logs', label: 'System Logs', checked: false },
                  { id: 'usage', label: 'API Usage', checked: false },
                ].map(type => (
                  <label key={type.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-[#2a3649] cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <input type="checkbox" defaultChecked={type.checked} className="w-5 h-5 rounded border-slate-300 text-[#135bec] focus:ring-[#135bec]" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400">Start Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#2a3649] outline-none text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400">End Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#2a3649] outline-none text-slate-900 dark:text-white" />
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Export Format</h3>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#135bec] bg-[#135bec]/5 text-[#135bec] font-bold text-sm">
                  <FileJson size={18} />
                  JSON
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-[#2a3649] text-slate-400 font-bold text-sm hover:border-slate-300 transition-all">
                  <FileSpreadsheet size={18} />
                  CSV
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-[#2a3649] text-slate-400 font-bold text-sm hover:border-slate-300 transition-all">
                  <Database size={18} />
                  Parquet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Exports */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Exports</h3>
          <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">full_system_backup_20231012.json</h4>
                  <p className="text-xs text-slate-400">12.4 MB • Generated 2 hours ago</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-[#135bec]">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
