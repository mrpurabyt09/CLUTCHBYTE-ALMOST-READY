import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Chat, Settings } from '../types';
import { X } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

interface AdminDashboardProps {
  chats: Chat[];
  settings: Settings;
  onClearAll: () => void;
  onClose: () => void;
}

export function AdminDashboard({ chats, settings, onClearAll, onClose }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const stats = useMemo(() => {
    let totalMessages = 0;
    let inputTokens = 0;
    let outputTokens = 0;

    chats.forEach(c => {
      totalMessages += c.messages.length;
      c.messages.forEach(m => {
        const estimatedTokens = Math.ceil(m.content.length / 4);
        if (m.role === 'model') outputTokens += estimatedTokens;
        if (m.role === 'user') inputTokens += estimatedTokens;
      });
    });

    return { 
      totalChats: chats.length, 
      totalMessages, 
      totalTokens: inputTokens + outputTokens
    };
  }, [chats]);

  const timelineData = useMemo(() => {
    const dates: Record<string, { messages: number, tokens: number }> = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dates[dateStr] = { messages: 0, tokens: 0 };
    }

    chats.forEach(c => {
      c.messages.forEach(m => {
        const dateStr = new Date(m.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (dates[dateStr]) {
          dates[dateStr].messages += 1;
          dates[dateStr].tokens += Math.ceil(m.content.length / 4);
        }
      });
    });

    return Object.entries(dates).map(([date, data]) => ({
      date,
      messages: data.messages,
      tokens: data.tokens
    }));
  }, [chats]);

  const modelUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    chats.forEach(chat => {
      const modelName = chat.model || 'Unknown';
      const aiMsgs = chat.messages.filter(m => m.role === 'model').length;
      if (aiMsgs > 0) {
        usage[modelName] = (usage[modelName] || 0) + aiMsgs;
      }
    });
    return Object.entries(usage)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [chats]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-1 bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans antialiased overflow-hidden flex flex-row h-full"
    >
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-[#2a3649] bg-[#111722] hidden md:flex flex-col justify-between h-full relative z-50">
        <div className="flex flex-col gap-6 p-4">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-[#135bec]/20 flex items-center justify-center rounded-lg h-10 w-10 text-[#135bec]">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold leading-none">ClutchByte</h1>
              <p className="text-slate-400 text-xs font-medium mt-1">Admin Console</p>
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${activeSection === 'dashboard' ? 'bg-[#135bec] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveSection('usage')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${activeSection === 'usage' ? 'bg-[#135bec] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              <span className="text-sm font-medium">Usage & Quotas</span>
            </button>
            <button 
              onClick={() => setActiveSection('models')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${activeSection === 'models' ? 'bg-[#135bec] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">model_training</span>
              <span className="text-sm font-medium">Models</span>
            </button>
            <button 
              onClick={() => setActiveSection('users')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${activeSection === 'users' ? 'bg-[#135bec] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span className="text-sm font-medium">Users</span>
            </button>
            <button 
              onClick={() => setActiveSection('settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${activeSection === 'settings' ? 'bg-[#135bec] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button 
              onClick={() => setActiveSection('logs')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${activeSection === 'logs' ? 'bg-[#135bec] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              <span className="text-sm font-medium">Logs</span>
            </button>
          </nav>
        </div>
        {/* User Profile Bottom */}
        <div className="p-4 border-t border-[#2a3649]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div className="h-8 w-8 rounded-full bg-slate-700 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxg5x79vyLMTmMmqrxlCsyfNCKLWo-W6sHxIGdlPcUDybu3cLzjT4BRQGY71fbtpiDjXs_DJUppZrFcUgWPaNJZ1ds0EB9hpdzMU0HaT5jBJurNK3x7selAjZ6Eo55fyRL9jmFK3694ZEnwpk_xRrt0ntl4EU5YvaoVxE0WQ4z77s2vx366t_87E7Wh-S4YblQYlONGogPWt-7Yc9S3wXhA7UvmoyBXS6GWEh9bOcmK4H2ygUGlTkM-C05rObBgKS8a2bXYY0HB5I')"}}></div>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Alex Morgan</p>
              <p className="text-xs text-slate-400 truncate">Super Admin</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px]">more_vert</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-full bg-[#f6f6f8] dark:bg-[#101622] overflow-y-auto overflow-x-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-[#2a3649]/50 bg-[#f6f6f8]/50 dark:bg-[#101622]/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {activeSection === 'dashboard' && 'Dashboard Overview'}
                {activeSection === 'usage' && 'Usage & Quotas'}
                {activeSection === 'models' && 'Models Management'}
                {activeSection === 'users' && 'Users Management'}
                {activeSection === 'settings' && 'System Settings'}
                {activeSection === 'logs' && 'System Logs'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {activeSection === 'dashboard' && 'Real-time system metrics and performance tracking'}
                {activeSection === 'usage' && 'Enterprise usage monitoring and quota management'}
                {activeSection === 'models' && 'Manage and configure AI models'}
                {activeSection === 'users' && 'Manage user accounts and permissions'}
                {activeSection === 'settings' && 'Configure global system settings'}
                {activeSection === 'logs' && 'View system activity and error logs'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#135bec] border-2 border-[#101622]"></span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative ml-2">
              <X size={24} />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
          {activeSection === 'dashboard' && (
            <div className="flex flex-col gap-8">
              {/* Page Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">API Usage Dashboard</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-base">Monitor your token consumption, costs, and manage API quotas.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#324467] text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span>Last 30 Days</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#135bec] hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export
                  </button>
                </div>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-[#135bec]">
                      <span className="material-symbols-outlined">token</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">+12.5%</span>
                  </div>
                  <h3 className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">Total Tokens</h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">4.2M</p>
                  <p className="text-xs text-slate-400 mt-2">Across all models this month</p>
                </div>
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                      <span className="material-symbols-outlined">api</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">+8.2%</span>
                  </div>
                  <h3 className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">API Calls</h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">12,842</p>
                  <p className="text-xs text-slate-400 mt-2">Total requests processed</p>
                </div>
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded">+15.4%</span>
                  </div>
                  <h3 className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">Estimated Cost</h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">$142.50</p>
                  <p className="text-xs text-slate-400 mt-2">Based on current pricing</p>
                </div>
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Usage Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Daily Token Usage</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#135bec]"></span>
                        <span className="text-xs text-slate-500">GPT-4</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        <span className="text-xs text-slate-500">Gemini</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px] w-full flex items-end justify-between gap-2">
                    {[45, 62, 58, 75, 90, 82, 65, 48, 55, 72, 88, 95, 80, 60, 52].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-1 items-center group relative">
                        <div className="w-full bg-slate-100 dark:bg-[#232f48] rounded-t-sm relative overflow-hidden h-full min-h-[10px]">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-[#135bec] opacity-80 transition-all duration-500 group-hover:opacity-100" 
                            style={{ height: `${val}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 hidden sm:block">{i + 1}</span>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {val}k tokens
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] shadow-sm p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">System Health Status</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'OpenRouter Gateway', status: 'Operational', color: 'emerald' },
                      { name: 'Gemini API (Google)', status: 'Operational', color: 'emerald' },
                      { name: 'OpenAI API', status: 'Operational', color: 'emerald' },
                      { name: 'Anthropic API', status: 'Degraded', color: 'orange' },
                      { name: 'Ollama Local Instance', status: 'Operational', color: 'emerald' },
                      { name: 'Vector Database', status: 'Operational', color: 'emerald' },
                    ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-100 dark:border-[#232f48]">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{service.name}</span>
                          <span className="text-[10px] text-slate-400">Last check: 2m ago</span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${service.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                          {service.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2 border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-[#92a4c9] rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#232f48] transition-colors">
                    View Full Status Page
                  </button>
                </div>
              </div>

              {/* Usage by API Key Table */}
              <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-[#324467] flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Usage by API Key</h3>
                  <button className="text-sm text-[#135bec] font-medium hover:underline">View All Keys</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#141b26] border-b border-slate-200 dark:border-[#232f48] text-xs uppercase tracking-wider text-slate-500 dark:text-[#92a4c9]">
                        <th className="px-6 py-4 font-semibold">Key Name</th>
                        <th className="px-6 py-4 font-semibold">Requests</th>
                        <th className="px-6 py-4 font-semibold">Tokens (In/Out)</th>
                        <th className="px-6 py-4 font-semibold">Cost</th>
                        <th className="px-6 py-4 font-semibold">Last Used</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#232f48] text-sm text-slate-600 dark:text-slate-300">
                      {[
                        { name: 'Production Main', req: '8,421', tokens: '2.8M / 1.2M', cost: '$84.20', last: '2m ago' },
                        { name: 'Development Test', req: '1,240', tokens: '450k / 120k', cost: '$12.40', last: '15m ago' },
                        { name: 'Staging Environment', req: '3,181', tokens: '1.2M / 480k', cost: '$45.90', last: '1h ago' },
                      ].map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50 dark:hover:bg-[#232f48]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                          <td className="px-6 py-4">{row.req}</td>
                          <td className="px-6 py-4">{row.tokens}</td>
                          <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{row.cost}</td>
                          <td className="px-6 py-4 text-slate-500">{row.last}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'usage' && (
            <div className="flex flex-col gap-8">
              {/* Page Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Enterprise Usage & Quota Management</h1>
                  <p className="text-slate-500 dark:text-[#92a4c9] text-sm mt-1">Monitor consumption and manage allocations across your organization.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#324467] text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span>Oct 1, 2023 - Oct 31, 2023</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#135bec] hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export Report
                  </button>
                </div>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Token Usage */}
                <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-[#92a4c9]">Total Organization Token Usage</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12.5M</h3>
                        <span className="text-sm text-slate-400">/ 20M</span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#135bec]">token</span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full bg-slate-100 dark:bg-[#232f48] rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-[#135bec] rounded-full" style={{ width: '62%' }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-[#135bec] font-medium">62% Used</span>
                    <span className="text-slate-400">Reset in 12 days</span>
                  </div>
                </div>
                {/* Active Seats */}
                <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-[#92a4c9]">Active User Seats</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">45</h3>
                        <span className="text-sm text-slate-400">/ 50</span>
                      </div>
                    </div>
                    <div className="p-2 bg-teal-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-teal-400">group_add</span>
                    </div>
                  </div>
                  <div className="relative h-2 w-full bg-slate-100 dark:bg-[#232f48] rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-teal-500 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-teal-400 font-medium">90% Occupied</span>
                    <span className="text-slate-400">5 seats remaining</span>
                  </div>
                </div>
                {/* Cost Forecast */}
                <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] p-6 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-[#92a4c9]">Projected Cost (EOM)</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$1,240</h3>
                      </div>
                    </div>
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-purple-400">trending_up</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end gap-1 h-10 w-full">
                    <div className="w-1/6 bg-[#232f48] h-[30%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-[#232f48] h-[45%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-[#232f48] h-[40%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-[#232f48] h-[60%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-[#232f48] h-[75%] rounded-t-sm"></div>
                    <div className="w-1/6 bg-purple-500/80 h-[90%] rounded-t-sm animate-pulse"></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Based on current usage trends (+12% vs last month)</p>
                </div>
              </div>

              {/* Main Content Area: Table & Detailed Forecast */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Team Usage Table */}
                <div className="xl:col-span-3 bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] shadow-sm flex flex-col">
                  <div className="p-5 border-b border-slate-200 dark:border-[#232f48] flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Team Usage Breakdown</h3>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        <input className="pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#324467] text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-[#135bec] focus:border-[#135bec] w-48" placeholder="Filter users..." type="text"/>
                      </div>
                      <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#232f48] text-slate-500 dark:text-[#92a4c9]">
                        <span className="material-symbols-outlined text-[20px]">filter_list</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-[#141b26] border-b border-slate-200 dark:border-[#232f48] text-xs uppercase tracking-wider text-slate-500 dark:text-[#92a4c9]">
                          <th className="px-6 py-4 font-semibold">User</th>
                          <th className="px-6 py-4 font-semibold">Role</th>
                          <th className="px-6 py-4 font-semibold">Monthly Consumption</th>
                          <th className="px-6 py-4 font-semibold">Allocated Quota</th>
                          <th className="px-6 py-4 font-semibold text-center">Hard Cap</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-[#232f48] text-sm text-slate-600 dark:text-slate-300">
                        {[
                          { name: 'Michael Chen', email: 'michael@clutchbyte.com', role: 'Data Science', usage: '1.2M', percentage: 80, quota: '1.5M', cap: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs3GNAzqWiR-OcrrhbD5xM12_NecBGdIOwQZeQDWfQvxUkSovo1tVAdUhyZlHiJk4clttMihfQjHa72IOxBtzlzzMzRSQw7QYOQzVZnBWbQwTGYA405sX_gqcrXcZVlSGbsFaud8qIfzaipx7L_c_vTTtS3o4YbJorSMoziQKvz2GZbTPQ3_GMpll9b44oyobFYZKgieYerNj0CcOcVFTWc9CBK_IEWzWPgiGnXp1Kt0277rY7RL-DQSl4rM4mCQGTnkZrSg1ogBQ' },
                          { name: 'Sarah Jenkins', email: 'sarah@clutchbyte.com', role: 'Product', usage: '950k', percentage: 95, quota: '1.0M', cap: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMqlTxsLHWrQupbC5hhtO6wtotzHdYEHSQOLnU6ggNo-gobKExrX6OUkWlwljXHjT2tjLeHqW0ahboeyAE8FQZghZgxdnDoXt7c6-Y8to4vIYEoAUO-6IpSIntHlt-ScMyM795iIP5vf2LlsaEDUCHYyRV_62ZO5DZWCa_LO_56ni0NOdxLo6CdKzBVwNFtHIXbh4KsbS1DFF5PFN4UvXkclOi6WadMn4bL8Meo1ojFIfnTvnVmWNtldgbrvmOkcBQZ4Je_Am6Uac' },
                          { name: 'David Ross', email: 'david@clutchbyte.com', role: 'Engineering', usage: '240k', percentage: 12, quota: '2.0M', cap: false, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIQnGBmmKDU6fByqI1yzwtOoLtDAlq4-3EUlPOXWBjHQoKbbqdguNkuq-uL5D9GGp7PvyPuD1V4i-uPXBe2U4ToBSpRFvF4S3EM6J5bYqEcdLG-mus2MPsYCe1_cTrh0ppPyC_vx8xaSJIRS5KfUkoeLZUv1OxHk48cvQVVuiD9X7WyQfc6fuFYinpXvYXsg1KQLvK5PikY_1SsSk2bYMGYQB60kzfemV4UDaKJOR-2IJvwJsnmY7o3yw9gfOoakjvhTxInyeJQuc' },
                          { name: 'Elena Rodriguez', email: 'elena@clutchbyte.com', role: 'Marketing', usage: '50k', percentage: 10, quota: '0.5M', cap: true, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPBA6kbpMf3zPImztScqy41Ns_FjIl5AZQgbVRM4jATUBl_Gr6uHAFcIjq89ZumpRDeJS6JcJgOVLh-IEpihqHvgnR6edUC23QxbpgghZ2JvItK4Z-3KXFUewSG_XzcUZiC2pZ-0ZC0laIPTx7t1WSEaTFHRmc_PjXzsoAG7ahO5QMXr-xJCdR90b69G-zPcfY4dG0gMI-AlUQ-AcibqYFlJ1Io2EQImdas5fKYyB6S9Tk_QYF3LeR0gCiByI8CUFAseZ_9A25WwE' }
                        ].map((user) => (
                          <tr key={user.email} className="group hover:bg-slate-50 dark:hover:bg-[#232f48]/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${user.img}')` }}></div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1 w-32">
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className={`font-medium ${user.percentage > 90 ? 'text-orange-400' : 'text-slate-900 dark:text-white'}`}>{user.usage}</span>
                                  <span className={user.percentage > 90 ? 'text-orange-400' : 'text-slate-500'}>{user.percentage}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 dark:bg-[#111722] rounded-full">
                                  <div className={`h-full rounded-full ${user.percentage > 90 ? 'bg-orange-400' : 'bg-[#135bec]'}`} style={{ width: `${user.percentage}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input className="w-20 px-2 py-1 bg-transparent border border-slate-300 dark:border-[#324467] rounded text-right text-slate-900 dark:text-white focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] text-sm" type="text" defaultValue={user.quota}/>
                                <span className="text-xs text-slate-500">Tokens</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <label className="inline-flex relative items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={user.cap} className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-[#111722] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#135bec]"></div>
                              </label>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-slate-400 hover:text-[#135bec] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-slate-200 dark:border-[#232f48] flex justify-between items-center">
                    <p className="text-sm text-slate-500 dark:text-[#92a4c9]">Showing 4 of 45 members</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-[#324467] text-sm text-slate-500 disabled:opacity-50" disabled>Previous</button>
                      <button className="px-3 py-1 rounded bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-[#324467] text-sm text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-[#232f48] transition-colors">Next</button>
                    </div>
                  </div>
                </div>

                {/* Cost Forecast Side Panel */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                  {/* Cost Trend */}
                  <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] p-6 shadow-sm">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Cost Analytics</h3>
                    <div className="mb-6">
                      <p className="text-xs font-medium text-slate-500 dark:text-[#92a4c9] uppercase tracking-wider mb-2">Current Run Rate</p>
                      <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">$450<span className="text-lg text-slate-400 font-normal">/mo</span></p>
                        <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                          <span className="material-symbols-outlined text-[14px] mr-1">trending_down</span>
                          -2.5%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500 dark:text-[#92a4c9]">GPT-4 Usage</span>
                          <span className="text-slate-900 dark:text-white font-medium">$320.50</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-[#232f48] rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500 dark:text-[#92a4c9]">Claude 3 Usage</span>
                          <span className="text-slate-900 dark:text-white font-medium">$85.20</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-[#232f48] rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500 dark:text-[#92a4c9]">Other Models</span>
                          <span className="text-slate-900 dark:text-white font-medium">$44.30</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-[#232f48] rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] p-6 shadow-sm">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Alert Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Usage Threshold Alert</label>
                        <div className="flex items-center gap-2">
                          <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-[#232f48]" max="100" min="0" type="range" defaultValue="80"/>
                          <span className="text-sm font-bold text-[#135bec] w-12 text-right">80%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Notify admins when organization quota hits this limit.</p>
                      </div>
                      <div className="pt-4 border-t border-slate-200 dark:border-[#232f48]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-Pause Overages</span>
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-[#111722] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#135bec]"></div>
                          </label>
                        </div>
                        <p className="text-xs text-slate-500">Automatically disable API access when quota is exceeded.</p>
                      </div>
                    </div>
                    <button className="w-full mt-6 bg-[#232f48] hover:bg-[#324467] text-white py-2 rounded-lg text-sm font-medium transition-colors">Update Settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'models' && (
            <div className="flex flex-col gap-6">
              {/* Models KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
                  <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Models</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</p>
                </div>
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
                  <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Providers</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4</p>
                </div>
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
                  <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Average Latency</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">245ms</p>
                </div>
              </div>

              {/* Models Table */}
              <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-[#2a3649] flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Models</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Search models..." 
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm rounded-lg border-none focus:ring-1 focus:ring-[#135bec] py-2 pl-10 pr-3 w-64"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#135bec] hover:bg-[#135bec]/90 rounded-lg transition-colors whitespace-nowrap">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>New Model</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Model Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649]">
                      {[
                        { name: 'Gemini 3.1 Pro', provider: 'Google', status: 'Operational', usage: '45.2k' },
                        { name: 'GPT-4o', provider: 'OpenAI', status: 'Operational', usage: '32.1k' },
                        { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'Operational', usage: '28.5k' },
                        { name: 'Llama 3.1 70B', provider: 'Ollama', status: 'Standby', usage: '12.4k' },
                        { name: 'Mistral Large', provider: 'Mistral', status: 'Operational', usage: '8.2k' },
                      ].map((model) => (
                        <tr key={model.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">{model.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{model.provider}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${model.status === 'Operational' ? 'bg-[#0bda5e]/10 text-[#0bda5e]' : 'bg-orange-500/10 text-orange-500'}`}>
                              <span className={`h-1 w-1 rounded-full ${model.status === 'Operational' ? 'bg-[#0bda5e]' : 'bg-orange-500'}`}></span>
                              {model.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{model.usage}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-[#135bec] hover:bg-[#135bec]/10 rounded transition-colors">
                                <span className="material-symbols-outlined text-[18px]">settings</span>
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="flex flex-col gap-6">
              {/* Users KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
                  <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Users</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,284</p>
                </div>
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
                  <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">New Users (7d)</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">+156</p>
                </div>
                <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
                  <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Now</h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">42</p>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-[#2a3649] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Directory</h3>
                  <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm rounded-lg border-none focus:ring-1 focus:ring-[#135bec] py-2 pl-10 pr-3"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#135bec] hover:bg-[#135bec]/90 rounded-lg transition-colors whitespace-nowrap">
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      <span className="hidden sm:inline">Add User</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Activity</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649]">
                      {[
                        { name: 'Alex Morgan', email: 'alex@clutchbyte.com', role: 'Super Admin', status: 'Active', lastSeen: 'Just now' },
                        { name: 'Sarah Chen', email: 'sarah.c@example.com', role: 'Developer', status: 'Active', lastSeen: '12m ago' },
                        { name: 'James Wilson', email: 'j.wilson@example.com', role: 'User', status: 'Inactive', lastSeen: '2d ago' },
                        { name: 'Elena Rodriguez', email: 'elena.r@example.com', role: 'User', status: 'Active', lastSeen: '1h ago' },
                        { name: 'Marcus Thorne', email: 'marcus@example.com', role: 'Moderator', status: 'Active', lastSeen: '5m ago' },
                      ].filter(user => 
                        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                      ).map((user) => (
                        <tr key={user.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                                <span className="text-xs text-slate-500">{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600 dark:text-slate-300">{user.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${user.status === 'Active' ? 'bg-[#0bda5e]/10 text-[#0bda5e]' : 'bg-slate-500/10 text-slate-500'}`}>
                              <span className={`h-1 w-1 rounded-full ${user.status === 'Active' ? 'bg-[#0bda5e]' : 'bg-slate-500'}`}></span>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.lastSeen}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 text-slate-400 hover:text-[#135bec] hover:bg-[#135bec]/10 rounded transition-colors">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                                <span className="material-symbols-outlined text-[18px]">block</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* API Settings */}
              <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <span className="material-symbols-outlined">api</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">API Configuration</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">OpenRouter API Key</label>
                    <input type="password" value="••••••••••••••••" readOnly className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#135bec]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1.5">Ollama Endpoint</label>
                    <input type="text" value="http://localhost:11434" readOnly className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#135bec]" />
                  </div>
                  <button className="w-full py-2 bg-[#135bec] text-white rounded-lg text-sm font-bold hover:bg-[#135bec]/90 transition-colors">Save API Settings</button>
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <span className="material-symbols-outlined">palette</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                      <p className="text-xs text-slate-500">Toggle system-wide dark theme</p>
                    </div>
                    <div className="w-10 h-5 bg-[#135bec] rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Compact Mode</p>
                      <p className="text-xs text-slate-500">Reduce padding and font sizes</p>
                    </div>
                    <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-slate-200 dark:border-[#2a3649] text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mt-4">Reset to Defaults</button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Security</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Auth</p>
                      <p className="text-xs text-slate-500">Require 2FA for admin accounts</p>
                    </div>
                    <div className="w-10 h-5 bg-[#135bec] rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Audit Logging</p>
                      <p className="text-xs text-slate-500">Log all administrative actions</p>
                    </div>
                    <div className="w-10 h-5 bg-[#135bec] rounded-full relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrations */}
              <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Integrations</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-[#2a3649]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">slack</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Slack Notifications</span>
                    </div>
                    <button className="text-xs font-bold text-[#135bec]">Connect</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-[#2a3649]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">monitoring</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Datadog</span>
                    </div>
                    <button className="text-xs font-bold text-slate-400">Connected</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'logs' && (
            <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-[#2a3649] flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Activity Logs</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
                    <span className="material-symbols-outlined">refresh</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649] font-mono text-xs">
                    {[
                      { time: '2026-03-04 10:04:15', level: 'INFO', msg: 'System health check completed successfully', src: 'HealthMonitor' },
                      { time: '2026-03-04 10:02:42', level: 'WARN', msg: 'High latency detected on OpenRouter gateway', src: 'APIProxy' },
                      { time: '2026-03-04 09:58:12', level: 'INFO', msg: 'New model "Claude 3.5 Sonnet" registered', src: 'ModelManager' },
                      { time: '2026-03-04 09:45:00', level: 'ERROR', msg: 'Failed to sync vector database index', src: 'PineconeSync' },
                      { time: '2026-03-04 09:30:22', level: 'INFO', msg: 'User "Alex Morgan" logged in from 192.168.1.1', src: 'AuthService' },
                      { time: '2026-03-04 09:15:10', level: 'INFO', msg: 'Automatic backup completed', src: 'BackupService' },
                    ].map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3 text-slate-500">{log.time}</td>
                        <td className="px-6 py-3">
                          <span className={`px-1.5 py-0.5 rounded ${log.level === 'ERROR' ? 'bg-red-500/10 text-red-500' : log.level === 'WARN' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-900 dark:text-slate-200">{log.msg}</td>
                        <td className="px-6 py-3 text-slate-500">{log.src}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-[#2a3649] flex justify-center">
                <button className="text-sm font-medium text-[#135bec] hover:underline">Load More Logs</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
