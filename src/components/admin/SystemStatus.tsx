import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SystemStatusProps {
  onNavigate?: (section: string) => void;
}

export function SystemStatus({ onNavigate }: SystemStatusProps) {
  const [services, setServices] = useState([
    { name: 'Core API Gateway', icon: 'api', uptime: '99.4%', status: 'degraded', latency: 42 },
    { name: 'Inference Engine', icon: 'psychology', uptime: '99.9%', status: 'operational', latency: 124 },
    { name: 'Vector Database', icon: 'database', uptime: '100%', status: 'operational', latency: 8 },
    { name: 'Auth Service', icon: 'lock', uptime: '100%', status: 'operational', latency: 15 },
    { name: 'Web Dashboard', icon: 'dashboard', uptime: '100%', status: 'operational', latency: 24 },
    { name: 'CDN Edge', icon: 'language', uptime: '99.9%', status: 'operational', latency: 12 },
    { name: 'Storage Cluster', icon: 'folder_shared', uptime: '100%', status: 'operational', latency: 31 },
    { name: 'Monitoring Stack', icon: 'monitoring', uptime: '100%', status: 'operational', latency: 5 },
  ]);

  const [regionalMetrics, setRegionalMetrics] = useState([
    { region: 'US-East (N. Virginia)', provider: 'AWS', status: 'Degraded', latency: 142, color: 'yellow' },
    { region: 'US-West (Oregon)', provider: 'GCP', status: 'Operational', latency: 28, color: 'emerald' },
    { region: 'EU-Central (Frankfurt)', provider: 'Azure', status: 'Operational', latency: 34, color: 'emerald' },
    { region: 'Asia-East (Taiwan)', provider: 'GCP', status: 'Operational', latency: 41, color: 'emerald' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        latency: Math.max(5, s.latency + Math.floor(Math.random() * 21 - 10))
      })));
      setRegionalMetrics(prev => prev.map(r => ({
        ...r,
        latency: Math.max(5, r.latency + Math.floor(Math.random() * 21 - 10))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 custom-scrollbar"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#135bec] font-bold text-sm uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-[#135bec] animate-pulse"></span>
              Live Infrastructure Status
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Health</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
              Real-time monitoring of our global infrastructure, API gateways, and inference clusters.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-[#1a2332] p-4 rounded-2xl border border-slate-200 dark:border-[#324467] shadow-sm">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Last Sync: Just Now</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Incident Card - Large */}
          <div className="md:col-span-8 bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-[#324467] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-[#232f48] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Active Incident Log</h3>
                  <p className="text-xs text-slate-500">Current and recent service disruptions</p>
                </div>
              </div>
              <button className="text-xs font-bold text-[#135bec] hover:underline uppercase tracking-wider">Full History</button>
            </div>
            <div className="flex-1 p-6 space-y-6">
              <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-500 before:rounded-full">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">API Latency Spike: US-East-1</h4>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">Investigating</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  We are observing increased response times for inference requests routed through our Virginia gateway. Our team is currently analyzing traffic patterns to identify the root cause.
                </p>
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    Oct 24, 14:45 UTC
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    On-call: @jdoe
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-[#232f48]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Previous incidents (Last 7 days)</span>
                  <span className="text-slate-400">None reported</span>
                </div>
              </div>
            </div>
          </div>

          {/* Uptime Stats - Small/Medium */}
          <div className="md:col-span-4 bg-[#135bec] rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white">speed</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Global Uptime</h3>
              <p className="text-blue-100 text-sm leading-relaxed">Our infrastructure maintained a 99.98% uptime across all regions over the last 30 days.</p>
            </div>
            <div className="relative z-10 mt-8">
              <div className="text-5xl font-black tracking-tighter mb-2">99.98%</div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Exceeding SLA
              </div>
            </div>
          </div>

          {/* Service Grid - Full Width */}
          <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {services.map((service) => (
              <div key={service.name} className="bg-white dark:bg-[#1a2332] p-6 rounded-3xl border border-slate-200 dark:border-[#324467] hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${service.status === 'operational' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    <span className="material-symbols-outlined text-[20px]">{service.icon}</span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${service.status === 'operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{service.name}</h4>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-[#232f48]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Uptime</span>
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{service.uptime}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latency</span>
                    <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{service.latency}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Metrics Table - Large */}
          <div className="md:col-span-12 bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-[#324467] shadow-sm overflow-hidden mt-4">
            <div className="p-6 border-b border-slate-100 dark:border-[#232f48] flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Regional Performance Metrics</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Degraded</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-[#232f48]">
                    <th className="px-8 py-4">Region</th>
                    <th className="px-8 py-4">Provider</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Avg. Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#232f48]">
                  {regionalMetrics.map((row) => (
                    <tr key={row.region} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{row.region}</td>
                      <td className="px-8 py-5 text-sm text-slate-500">{row.provider}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${row.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{row.latency}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Subscribe Footer */}
        <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#135bec]/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tight">Stay informed on service health.</h3>
              <p className="text-slate-400 text-lg">
                Subscribe to our automated status alerts to receive real-time notifications via Email, SMS, or Webhooks.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="px-8 py-4 bg-[#135bec] hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs">
                Subscribe via Email
              </button>
              <button 
                onClick={() => onNavigate?.('webhooks')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all backdrop-blur-md border border-white/10 uppercase tracking-widest text-xs"
              >
                Webhook Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
