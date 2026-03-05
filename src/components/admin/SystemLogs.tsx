import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Terminal, Trash2, Download, Pause, Play, Settings, ChevronLeft } from 'lucide-react';

interface SystemLogsProps {
  onBack: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  color: string;
}

export function SystemLogs({ onBack }: SystemLogsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '10:42:01', service: '[API-Gateway]', level: 'INFO', message: 'Incoming request from ID: user_882. Route: /api/v1/models/list', color: 'text-purple-400' },
    { id: '2', timestamp: '10:42:02', service: '[DB-Shard-01]', level: 'INFO', message: 'Query executed in 45ms. Rows affected: 1.', color: 'text-emerald-400' },
    { id: '3', timestamp: '10:42:05', service: '[Auth-Svc]', level: 'WARN', message: 'Token expiry imminent for session_991. Refresh recommended within 60s.', color: 'text-amber-400' },
    { id: '4', timestamp: '10:42:08', service: '[API-Gateway]', level: 'INFO', message: 'Rate limit check passed for IP: 192.168.0.104', color: 'text-purple-400' },
    { id: '5', timestamp: '10:42:15', service: '[Inference]', level: 'ERROR', message: 'CUDA Out of Memory Exception on GPU-02. Attempting soft restart of worker node...', color: 'text-rose-500' },
    { id: '6', timestamp: '10:42:16', service: '[Inference]', level: 'WARN', message: 'GPU-02 High Temperature Warning (88°C). Throttling performance.', color: 'text-rose-500' },
    { id: '7', timestamp: '10:42:18', service: '[Sys-Monitor]', level: 'INFO', message: 'Heap memory usage: 64% (2.4GB / 3.7GB). GC cycle scheduled.', color: 'text-cyan-400' },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col h-full bg-[#f6f6f8] dark:bg-[#101622] overflow-hidden"
    >
      {/* Header */}
      <header className="bg-[#111722] border-b border-slate-800 p-4 md:px-8 flex flex-col gap-4 z-10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                System Logs 
                <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-emerald-500 ml-1"></span>
              </h2>
              <p className="text-slate-400 text-sm">Real-time background service monitoring and health checks.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium border ${
                isPaused 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
              {isPaused ? 'Resume Feed' : 'Pause Feed'}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all text-sm font-medium">
              <Trash2 size={18} /> Clear
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#135bec] text-white hover:bg-blue-600 transition-all text-sm font-medium shadow-lg shadow-blue-500/20">
              <Download size={18} /> Export
            </button>
          </div>
        </div>
        
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={18} />
            </div>
            <input 
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-700 rounded-lg leading-5 bg-slate-900 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-[#135bec] focus:ring-1 focus:ring-[#135bec] sm:text-sm" 
              placeholder="Search logs (regex supported)..." 
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600">
              <span className="material-symbols-outlined text-[18px]">code</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <label className="cursor-pointer select-none inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Info
            </label>
            <label className="cursor-pointer select-none inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span> Warning
            </label>
            <label className="cursor-pointer select-none inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span> Error
            </label>
          </div>
        </div>
      </header>

      {/* Terminal Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Log Feed */}
        <div className="flex-1 bg-[#0f1219] overflow-y-auto p-4 md:p-6 font-mono text-sm relative custom-scrollbar">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]"></div>
          <div className="space-y-1 relative z-10">
            {logs.map((log) => (
              <div key={log.id} className="group flex items-start gap-3 hover:bg-white/5 p-1 rounded -mx-1 cursor-pointer transition-colors">
                <span className="text-slate-500 select-none shrink-0 w-24">{log.timestamp}</span>
                <span className={`${log.color} font-bold shrink-0 w-32`}>{log.service}</span>
                <span className={`${log.level === 'ERROR' ? 'text-rose-500' : log.level === 'WARN' ? 'text-amber-500' : 'text-blue-500'} font-bold shrink-0 w-20`}>{log.level}</span>
                <span className="text-slate-300 break-all">{log.message}</span>
                {log.level === 'ERROR' && (
                  <button className="opacity-0 group-hover:opacity-100 ml-auto text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hover:bg-slate-700">Copy Trace</button>
                )}
              </div>
            ))}
            <div ref={logEndRef} />
            <div className="flex items-center gap-2 mt-4 text-[#135bec] animate-pulse">
              <span className="text-xs">Waiting for incoming logs...</span>
              <div className="w-2 h-4 bg-[#135bec]"></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Stats */}
        <aside className="w-80 border-l border-slate-800 bg-[#111722] hidden lg:flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-emerald-500/10 w-24 h-24 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="text-slate-400 text-sm font-medium">System Health</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 relative z-10">98.2%</h3>
            <p className="text-emerald-400 text-xs font-medium relative z-10">All systems operational</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 text-sm">Errors (1h)</span>
              <span className="text-rose-400 font-bold text-xl">12</span>
            </div>
            <div className="h-16 w-full bg-slate-800/50 rounded-lg border border-slate-800 p-2 flex items-end gap-1">
              {[20, 10, 40, 0, 10, 80, 30, 20, 10, 5, 15, 10].map((h, i) => (
                <div key={i} className={`w-1/12 rounded-t-sm ${i === 5 ? 'bg-rose-500/60' : 'bg-rose-500/20'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-slate-400 text-sm">Warnings (1h)</span>
              <span className="text-amber-400 font-bold text-xl">45</span>
            </div>
            <div className="h-16 w-full bg-slate-800/50 rounded-lg border border-slate-800 p-2 flex items-end gap-1">
              {[40, 50, 30, 60, 45, 20, 35, 50, 75, 40, 30, 20].map((h, i) => (
                <div key={i} className={`w-1/12 rounded-t-sm ${i === 8 ? 'bg-amber-500/50' : 'bg-amber-500/20'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">Monitored Services</p>
            {[
              { name: 'API Gateway', status: 'emerald', icon: 'api', sub: 'Uptime: 14d 2h', color: 'text-purple-400', bg: 'bg-purple-500/20' },
              { name: 'Postgres Primary', status: 'emerald', icon: 'database', sub: 'Uptime: 45d 12h', color: 'text-blue-400', bg: 'bg-blue-500/20' },
              { name: 'Inference Engine', status: 'amber', icon: 'smart_toy', sub: 'Load: High (88%)', color: 'text-rose-400', bg: 'bg-rose-500/20', animate: true },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`${service.bg} ${service.color} p-1.5 rounded-md`}>
                    <span className="material-symbols-outlined text-lg">{service.icon}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{service.name}</p>
                    <p className="text-slate-500 text-xs">{service.sub}</p>
                  </div>
                </div>
                <span className={`h-2 w-2 rounded-full bg-${service.status}-500 ${service.animate ? 'animate-pulse' : ''}`}></span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800">
            <button className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              <Settings size={18} /> Configure Logging
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
