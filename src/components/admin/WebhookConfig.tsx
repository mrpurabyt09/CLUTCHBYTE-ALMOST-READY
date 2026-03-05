import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Network, History, Copy, Eye, 
  Edit, Trash2, AlertTriangle, ChevronRight, RotateCcw,
  Search, Info, ExternalLink
} from 'lucide-react';

interface WebhookConfigProps {
  onBack: () => void;
}

export function WebhookConfig({ onBack }: WebhookConfigProps) {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const endpoints = [
    {
      id: '1',
      url: 'https://api.myapp.com/clutchbyte-hook',
      lastActive: '2 mins ago',
      events: ['message.created', 'system.health_alert', 'provider.status_change'],
      status: 'Active',
      secret: 'whsec_5f8a9b2c3d4e5f6g7h8i9j0k'
    },
    {
      id: '2',
      url: 'https://staging.myapp.com/test-hook',
      lastActive: '1 hour ago',
      events: ['conversation.ended', 'system.latency_spike'],
      status: 'Failing',
      secret: 'whsec_1a2b3c4d5e6f7g8h9i0j1k2l'
    }
  ];

  const deliveries = [
    {
      id: 'req_89234857203',
      status: '200 OK',
      statusType: 'success',
      method: 'POST',
      event: 'system.health_alert',
      time: 'Nov 14, 10:23 AM',
      duration: '240ms'
    },
    {
      id: 'req_89234856992',
      status: '500 Err',
      statusType: 'error',
      method: 'POST',
      event: 'provider.status_change',
      time: 'Nov 14, 09:15 AM',
      duration: '5002ms'
    },
    {
      id: 'req_89234856110',
      status: '200 OK',
      statusType: 'success',
      method: 'POST',
      event: 'system.latency_spike',
      time: 'Nov 14, 08:42 AM',
      duration: '120ms'
    },
    {
      id: 'req_89234855001',
      status: '200 OK',
      statusType: 'success',
      method: 'POST',
      event: 'message.created',
      time: 'Nov 14, 08:30 AM',
      duration: '185ms'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-full bg-[#f6f6f8] dark:bg-[#101622] overflow-hidden"
    >
      <main className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8 custom-scrollbar">
        <div className="flex flex-col max-w-[1200px] mx-auto gap-8">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-[#232f48]/50">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Webhooks</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Configure endpoints to receive real-time events from ClutchByte.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors h-10 px-4 text-slate-700 dark:text-slate-200 text-sm font-bold">
                <RotateCcw size={18} />
                <span>Reset Keys</span>
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-[#135bec] hover:bg-blue-600 transition-colors h-10 px-4 text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                <Plus size={20} />
                <span>Add Endpoint</span>
              </button>
            </div>
          </div>

          {/* System Health Quick Setup */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-[#135bec] to-[#0a3a9c] rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                    <Network className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">System Health Webhooks</h3>
                  <p className="text-blue-100 text-sm leading-relaxed max-w-md">
                    Automatically receive alerts when service latency exceeds thresholds, providers go offline, or system resources are strained.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button className="px-5 py-2.5 bg-white text-[#135bec] font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors">
                    Configure Health Alerts
                  </button>
                  <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-widest backdrop-blur-md border border-white/10 transition-colors">
                    View Templates
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-[#324467] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-orange-500" size={18} />
                  Critical Events
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Provider Outage', enabled: true },
                    { label: 'High Latency (>500ms)', enabled: true },
                    { label: 'Error Rate Spike', enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${item.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${item.enabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest">
                Manage All Events
              </button>
            </div>
          </section>

          {/* Active Endpoints Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">hub</span>
                Active Endpoints
              </h2>
              <a className="text-sm text-[#135bec] hover:text-blue-400 font-medium flex items-center gap-1" href="#">
                Read Documentation <ExternalLink size={14} />
              </a>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#18202F] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-[#232f48]">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[35%]">Endpoint URL</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[20%]">Events</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[15%]">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[20%]">Secret</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[10%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#232f48] text-sm">
                    {endpoints.map((endpoint) => (
                      <tr key={endpoint.id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center gap-2 font-mono text-slate-700 dark:text-slate-300">
                            <span className="truncate max-w-[300px]" title={endpoint.url}>{endpoint.url}</span>
                            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                              <Copy size={14} />
                            </button>
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Last active: {endpoint.lastActive}</div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            {endpoint.events.map(event => (
                              <span key={event} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 font-mono">
                                {event}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          {endpoint.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              <AlertTriangle size={14} />
                              Failing
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center gap-2 group/secret">
                            <code className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                              {showSecrets[endpoint.id] ? endpoint.secret : 'whsec_••••••••••••••••'}
                            </code>
                            <button 
                              onClick={() => toggleSecret(endpoint.id)}
                              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors" title="Edit">
                              <Edit size={20} />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-colors" title="Delete">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Recent Deliveries Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1 pt-4">
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">history</span>
                Recent Deliveries
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Auto-refreshing</span>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#101622] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#18202F] border-b border-slate-200 dark:border-[#232f48]">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Method</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Event / ID</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#232f48] text-sm bg-white dark:bg-[#18202F]/50">
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id} className={`hover:bg-slate-50 dark:hover:bg-[#18202F] transition-colors cursor-pointer group ${delivery.statusType === 'error' ? 'bg-rose-50/30 dark:bg-rose-900/5' : ''}`}>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            delivery.statusType === 'success' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                          }`}>
                            {delivery.status}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="font-mono text-xs text-slate-400">POST</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-200 font-medium font-mono text-xs">{delivery.event}</span>
                            <span className="text-slate-400 dark:text-slate-500 text-xs font-mono mt-0.5">{delivery.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-slate-500 dark:text-slate-400 text-xs">
                          <div>{delivery.time}</div>
                          <div className="text-slate-400 dark:text-slate-600">{delivery.duration}</div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          {delivery.statusType === 'error' ? (
                            <button className="inline-flex items-center gap-1 text-xs font-medium text-[#135bec] hover:text-blue-400 transition-colors mr-2 px-2 py-1 rounded hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20">
                              <RotateCcw size={14} />
                              Redeliver
                            </button>
                          ) : (
                            <ChevronRight className="inline-block text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" size={20} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                <div className="px-6 py-3 border-t border-slate-200 dark:border-[#232f48] flex items-center justify-between bg-slate-50 dark:bg-[#18202F]">
                  <span className="text-xs text-slate-500">Showing 1-4 of 124 deliveries</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition-colors">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      {/* Footer for visual balance */}
      <footer className="border-t border-slate-200 dark:border-[#232f48] py-6 mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center text-xs text-slate-400 dark:text-slate-600">
          <div>© 2023 ClutchByte Inc.</div>
          <div className="flex gap-4">
            <a className="hover:text-slate-600 dark:hover:text-slate-400" href="#">Privacy</a>
            <a className="hover:text-slate-600 dark:hover:text-slate-400" href="#">Terms</a>
            <a className="hover:text-slate-600 dark:hover:text-slate-400" href="#">Support</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
