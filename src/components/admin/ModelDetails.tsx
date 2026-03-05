import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Cpu, Activity, Zap, BarChart3, Clock, 
  Database, Shield, Settings, Play, Trash2, ExternalLink, 
  Info, CheckCircle2, AlertCircle, RefreshCw, MoreVertical,
  Terminal, Globe, Search
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

interface ModelDetailsProps {
  modelId: string;
  onBack: () => void;
}

const performanceData = [
  { time: '00:00', latency: 450, throughput: 120 },
  { time: '04:00', latency: 420, throughput: 150 },
  { time: '08:00', latency: 680, throughput: 280 },
  { time: '12:00', latency: 550, throughput: 320 },
  { time: '16:00', latency: 480, throughput: 290 },
  { time: '20:00', latency: 430, throughput: 180 },
  { time: '23:59', latency: 410, throughput: 140 },
];

const recentRequests = [
  { id: 'req_89234857203', timestamp: '2023-11-14 10:45:22', type: 'Chat', status: 'Success', latency: '124ms', tokens: 842 },
  { id: 'req_89234856992', timestamp: '2023-11-14 10:44:15', type: 'Completion', status: 'Success', latency: '245ms', tokens: 1204 },
  { id: 'req_89234856110', timestamp: '2023-11-14 10:42:08', type: 'Chat', status: 'Error', latency: '45ms', tokens: 0 },
  { id: 'req_89234855001', timestamp: '2023-11-14 10:40:55', type: 'Chat', status: 'Success', latency: '188ms', tokens: 512 },
  { id: 'req_89234854882', timestamp: '2023-11-14 10:38:12', type: 'Embedding', status: 'Success', latency: '32ms', tokens: 128 },
];

export function ModelDetails({ modelId, onBack }: ModelDetailsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col h-full bg-[#f6f6f8] dark:bg-[#0f1219] overflow-hidden"
    >
      {/* Header */}
      <header className="bg-white dark:bg-[#111722] border-b border-slate-200 dark:border-[#2a3649] px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Cpu size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">GPT-4o (Omni)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Model ID: {modelId}</span>
                <span>•</span>
                <span>v1.2.4</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Database size={12} /> OpenAI</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#232f48] text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-[#2d3b55] text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700">
            <Settings size={16} /> Configure
          </button>
          <button className="px-4 py-2 rounded-xl bg-[#135bec] text-white hover:bg-blue-600 text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Play size={16} /> Run Test
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Bento Grid Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#1a2332] p-6 rounded-3xl border border-slate-200 dark:border-[#324467] shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#135bec]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <Clock size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Avg. Latency</span>
                </div>
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[14px]">trending_down</span>
                  12%
                </span>
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">420ms</h3>
                <span className="text-slate-400 text-xs font-medium">vs 480ms last 24h</span>
              </div>
              <div className="mt-6 h-16 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <Area type="monotone" dataKey="latency" stroke="#135bec" fill="#135bec" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2332] p-6 rounded-3xl border border-slate-200 dark:border-[#324467] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                    <Zap size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Throughput</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">1.2k <span className="text-sm font-bold text-slate-400">req/m</span></h3>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/[0.05]">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Peak</span>
                  <span className="text-slate-600 dark:text-slate-300">1.8k req/m</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2332] p-6 rounded-3xl border border-slate-200 dark:border-[#324467] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Shield size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Reliability</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">99.98%</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/[0.05]">
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                  <CheckCircle2 size={12} />
                  SLA Compliant
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Performance Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-[#324467] shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-[#232f48] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Performance Metrics</h3>
                  <p className="text-xs text-slate-500">Latency and throughput trends over the last 24 hours.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#135bec]"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Throughput</span>
                  </div>
                </div>
              </div>
              <div className="p-6 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="latency" stroke="#135bec" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#135bec' }} />
                    <Line type="monotone" dataKey="throughput" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column: Config & Status */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-[#324467] p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Settings size={18} className="text-[#135bec]" /> Active Configuration
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Context Window', value: '128k Tokens', icon: <Database size={14} /> },
                    { label: 'Max Output', value: '4,096 Tokens', icon: <Zap size={14} /> },
                    { label: 'Temperature', value: '0.7 (Default)', icon: <Settings size={14} /> },
                    { label: 'Top-P', value: '1.0', icon: <Activity size={14} /> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-[#232f48]">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        {item.icon}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 px-4 bg-slate-900 dark:bg-white/5 hover:bg-slate-800 dark:hover:bg-white/10 text-white dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-transparent dark:border-white/10">
                  Edit Parameters
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#135bec] to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={20} />
                    <h3 className="font-bold">Provider Status</h3>
                  </div>
                  <p className="text-sm text-blue-100 mb-6 leading-relaxed">OpenAI API is currently experiencing minor delays in the US-East region. Inference might be affected.</p>
                  <button className="w-full py-3 bg-white text-[#135bec] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    View Status Page <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Request Log Table */}
          <div className="bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-[#324467] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-[#232f48] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Recent Request Log</h3>
                  <p className="text-xs text-slate-500">Live stream of inference requests for this model.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Filter logs..." 
                    className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0f1219] border border-slate-200 dark:border-[#324467] text-xs outline-none focus:ring-2 focus:ring-[#135bec]/20 transition-all"
                  />
                </div>
                <button className="text-[10px] font-black text-[#135bec] hover:underline uppercase tracking-widest">View All Logs</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-[#232f48]">
                    <th className="px-8 py-4">Request ID</th>
                    <th className="px-8 py-4">Timestamp</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Latency</th>
                    <th className="px-8 py-4 text-right">Tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#232f48]">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5 font-mono text-[10px] text-slate-500 dark:text-slate-400">{req.id}</td>
                      <td className="px-8 py-5 text-xs text-slate-600 dark:text-slate-400">{req.timestamp}</td>
                      <td className="px-8 py-5">
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                          {req.type}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${req.status === 'Success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <span className={`text-xs font-bold ${req.status === 'Success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {req.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-mono text-xs text-slate-600 dark:text-slate-400">{req.latency}</td>
                      <td className="px-8 py-5 text-right font-bold text-slate-900 dark:text-white">{req.tokens.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'API Documentation', desc: 'View implementation guides', icon: <Globe size={20} />, color: 'text-blue-500' },
              { title: 'Usage Quotas', desc: 'Manage rate limits & billing', icon: <BarChart3 size={20} />, color: 'text-purple-500' },
              { title: 'Security Audit', desc: 'Review access logs & keys', icon: <Shield size={20} />, color: 'text-emerald-500' },
            ].map((action, i) => (
              <button key={i} className="flex items-center gap-4 p-6 bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-[#324467] hover:shadow-lg transition-all text-left group">
                <div className={`w-12 h-12 rounded-2xl ${action.color.replace('text-', 'bg-')}/10 flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{action.title}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
