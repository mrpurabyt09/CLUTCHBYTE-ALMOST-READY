import React from 'react';
import { motion } from 'motion/react';
import { Megaphone, AlertTriangle, Eye, Clock } from 'lucide-react';

export function BroadcastCenter() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Broadcast Center</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage system-wide announcements and notifications.</p>
          </div>
          <button className="px-6 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Megaphone size={18} />
            New Broadcast
          </button>
        </div>

        {/* Active Broadcasts */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Announcements</h3>
          <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
            <div className="p-6 flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">Scheduled Maintenance: Oct 15</h4>
                  <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded">Live</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">The system will be undergoing scheduled maintenance on October 15th from 02:00 to 04:00 UTC. Some models may be temporarily unavailable.</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Eye size={14} />
                    <span>12.4k views</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>Ends in 2 days</span>
                  </div>
                  <button className="ml-auto text-xs font-bold text-red-500 hover:underline">End Broadcast</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Broadcasts */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Broadcast History</h3>
          <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#2a3649]">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Announcement</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Audience</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649] text-slate-900 dark:text-slate-100">
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">New Model: Llama 3.1 405B</p>
                      <p className="text-xs text-slate-400">Announcing the arrival of Meta's largest model...</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded uppercase">Feature</span>
                    </td>
                    <td className="px-6 py-4 text-sm">All Users</td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-right">Oct 1, 2023</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">API Quota Increase</p>
                      <p className="text-xs text-slate-400">Enterprise users now have 2x higher limits...</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase">Update</span>
                    </td>
                    <td className="px-6 py-4 text-sm">Enterprise</td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-right">Sep 24, 2023</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
