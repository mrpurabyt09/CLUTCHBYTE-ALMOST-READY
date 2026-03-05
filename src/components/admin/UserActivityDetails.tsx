import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Lock, ShieldAlert, Calendar, CreditCard, DollarSign, Cpu, TrendingUp, Search, Settings, Bell, MoreVertical, Laptop, Globe, Eye } from 'lucide-react';

interface UserActivityDetailsProps {
  onBack: () => void;
}

export function UserActivityDetails({ onBack }: UserActivityDetailsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col h-full bg-[#f6f6f8] dark:bg-[#101622] overflow-hidden"
    >
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-[#2a3649] px-10 py-3 bg-white dark:bg-[#111722] sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500 dark:text-slate-400">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-tight">ClutchByte Admin</h2>
          </div>
          <div className="hidden md:flex items-center relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input className="w-64 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-none rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] outline-none placeholder:text-slate-400" placeholder="Search users, logs..." />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#232f48] text-slate-500 dark:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#232f48] text-slate-500 dark:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
          <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-slate-200 dark:ring-[#232f48]" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSOgKvwZ8Kr7DWXKInLMaTjuLBTb_BvTSlNcPM5HzT8Lx1jgxeRA1SGEZrEypGHUbB2sc0xcM87Q7KiCg-ajhMtqyjw-y-D0x5xZH_X_wZtsW-moJX-QiL7So-Y7a0Gkbi_rYhifupvwk_1zE6fVF1G4qwDgctuL3rSGWMqVH4zMrl6hTFc9U7J_1hD-RpfeZ6Zod2dugnvFODJBBnm7HYlTaseqGpT3Q90hwNUnPvNxwvrAeZwPHPptJnijQqcBYe4lyCgSyhVKQ")'}}></div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-8 py-6 overflow-y-auto custom-scrollbar">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={onBack} className="text-slate-500 dark:text-[#92a4c9] hover:text-[#135bec] transition-colors font-medium">Dashboard</button>
          <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          <span className="text-slate-500 dark:text-[#92a4c9] font-medium">Users</span>
          <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">alex_dev</span>
        </div>

        {/* Header Profile Section */}
        <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex gap-5 items-center">
              <div className="relative">
                <div className="size-24 rounded-full bg-cover bg-center ring-4 ring-slate-50 dark:ring-[#101622]" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBxlrDxB4yg8P633lAzd0C0N9tLOz1mxZwGWZtzTFyVW15utkO44mK6gGr2q1Zb8gqWFoe9OLSGlLVW84XRsHaheMx4aH34KxuONiQiQfLACGc52Z4kUByReABfCQeqsXZ8azngAE2LoyB6Q8gOlt7zMJtKbZ6RiAVdYl47ejqKG0-Hl7RCkO0i31cYNVrYPZnY17uKksfBIrv5zpVx7XI8BM-kvFsaSYrMY1s0QJg_xQMxbU1Lf1RvM-uv7f6NK01TtfsyhVAAqS8")'}}></div>
                <div className="absolute bottom-1 right-1 size-5 bg-emerald-500 rounded-full border-4 border-white dark:border-[#1a2332]" title="Active"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">alex_dev</h1>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">Active</span>
                </div>
                <div className="text-slate-500 dark:text-[#92a4c9] text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">mail</span> alex@clutchbyte.com</span>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">badge</span> ID: 849302</span>
                </div>
                <p className="text-slate-400 dark:text-[#64748b] text-xs mt-1">Last active: 14 mins ago</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-slate-100 dark:bg-[#232f48] text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-[#2d3b55] text-sm font-semibold transition-colors flex">
                <Lock size={18} /> Reset Password
              </button>
              <button className="flex-1 md:flex-none items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 text-sm font-semibold transition-colors flex">
                <ShieldAlert size={18} /> Suspend User
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Account Age', value: '2 Years', sub: 'Joined Oct 2021', icon: <Calendar size={18} /> },
            { label: 'Plan Type', value: 'Enterprise', sub: 'Renews in 14 days', icon: <CreditCard size={18} />, badge: 'Pro' },
            { label: 'Total Spend', value: '$450.00', sub: '+12% vs last month', icon: <DollarSign size={18} />, trend: true },
            { label: 'Total Tokens', value: '1.2M', sub: 'Avg 2k per session', icon: <Cpu size={18} /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#1a2332] p-5 rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm hover:border-[#135bec]/50 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">{stat.label}</p>
                <span className="p-1.5 rounded-md bg-slate-100 dark:bg-[#232f48] text-slate-400 group-hover:text-[#135bec] group-hover:bg-[#135bec]/10 transition-colors">
                  {stat.icon}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                {stat.badge && (
                  <span className="bg-[#135bec]/20 text-[#135bec] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">{stat.badge}</span>
                )}
              </div>
              <p className={`text-xs mt-1 ${stat.trend ? 'text-emerald-500 flex items-center gap-1' : 'text-slate-400'}`}>
                {stat.trend && <TrendingUp size={12} />} {stat.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Activity & Logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Heatmap */}
            <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] p-6 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chat Activity</h3>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-slate-100 dark:bg-[#232f48]"></span>
                  <span className="size-3 rounded-sm bg-[#135bec]/20"></span>
                  <span className="size-3 rounded-sm bg-[#135bec]/50"></span>
                  <span className="size-3 rounded-sm bg-[#135bec]"></span>
                  <span className="text-xs text-slate-400 ml-1">Less → More</span>
                </div>
              </div>
              <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
                <div className="flex gap-1 min-w-[600px]">
                  {Array.from({ length: 52 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }).map((_, j) => {
                        const rand = Math.random();
                        let colorClass = "bg-slate-100 dark:bg-[#232f48]";
                        if (rand > 0.85) colorClass = "bg-[#135bec]";
                        else if (rand > 0.7) colorClass = "bg-[#135bec]/50";
                        else if (rand > 0.5) colorClass = "bg-[#135bec]/20";
                        return <div key={j} className={`size-3 rounded-sm ${colorClass}`} title="Activity"></div>;
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 min-w-[600px]">
                  {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </div>

            {/* Interaction Log */}
            <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-[#2a3649] flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interaction Log</h3>
                <button className="text-[#135bec] text-sm font-medium hover:text-blue-400">Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-500 dark:text-[#9ca3af]">
                  <thead className="bg-slate-50 dark:bg-[#151c2a] text-xs uppercase font-semibold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4 w-1/3">Prompt Snippet</th>
                      <th className="px-6 py-4">Model</th>
                      <th className="px-6 py-4">Tokens</th>
                      <th className="px-6 py-4">Latency</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649]">
                    {[
                      { time: 'Oct 24, 14:30', prompt: 'Write a Python script for data scraping...', model: 'GPT-4', tokens: '4,201', latency: '1.2s', modelColor: 'bg-purple-500/10 text-purple-500 ring-purple-500/20' },
                      { time: 'Oct 24, 14:25', prompt: 'Explain quantum computing to a 5 y/o...', model: 'Claude-3', tokens: '890', latency: '0.8s', modelColor: 'bg-orange-500/10 text-orange-500 ring-orange-500/20' },
                      { time: 'Oct 24, 11:12', prompt: 'Debug this React hook causing infinite...', model: 'GPT-4', tokens: '1,540', latency: '2.1s', modelColor: 'bg-purple-500/10 text-purple-500 ring-purple-500/20' },
                      { time: 'Oct 23, 19:45', prompt: 'Generate a marketing email for...', model: 'GPT-3.5', tokens: '560', latency: '0.4s', modelColor: 'bg-blue-500/10 text-blue-500 ring-blue-500/20' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#1e2736] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{log.time}</td>
                        <td className="px-6 py-4">
                          <span className="truncate max-w-[200px] text-slate-900 dark:text-white font-medium block">{log.prompt}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${log.modelColor}`}>{log.model}</span>
                        </td>
                        <td className="px-6 py-4">{log.tokens}</td>
                        <td className="px-6 py-4">{log.latency}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 group-hover:text-[#135bec] transition-colors">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Security & Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm h-fit">
              <div className="p-5 border-b border-slate-200 dark:border-[#2a3649]">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={18} className="text-[#135bec]" /> Security Events
                </h3>
              </div>
              <div className="p-5 space-y-6">
                <div className="relative pl-6 border-l border-slate-200 dark:border-[#2a3649] space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#1a2332]"></span>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Successful Login</p>
                      <p className="text-xs text-slate-500 dark:text-[#92a4c9]">Oct 24, 14:00</p>
                      <div className="mt-2 bg-slate-50 dark:bg-[#151c2a] p-3 rounded-lg border border-slate-200 dark:border-[#2a3649]">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <Laptop size={12} /> <span>Chrome on MacOS</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Globe size={12} /> <span className="font-mono">192.168.1.1 (SF, USA)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-[#1a2332]"></span>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Password Changed</p>
                      <p className="text-xs text-slate-500 dark:text-[#92a4c9]">Sep 15, 09:23</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#151c2a] border-t border-slate-200 dark:border-[#2a3649] rounded-b-xl text-center">
                <button className="text-xs font-semibold text-[#135bec] hover:underline">View All Security Logs</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#135bec]/20 to-transparent rounded-xl border border-[#135bec]/20 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Admin Notes</h3>
              <textarea className="w-full bg-white/50 dark:bg-[#111722]/50 border border-[#135bec]/20 rounded-lg p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-1 focus:ring-[#135bec] outline-none resize-none h-24" placeholder="Add a note about this user..."></textarea>
              <button className="mt-3 w-full py-2 rounded-lg bg-[#135bec] hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-500/20">
                Save Note
              </button>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
