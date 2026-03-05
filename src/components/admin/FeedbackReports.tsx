import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, Filter, Download, RefreshCw, Frown, Meh, Smile, ChevronLeft, ChevronRight, Share2, MoreVertical, Mail, Laptop, Globe, Send } from 'lucide-react';

interface FeedbackReportsProps {
  onBack: () => void;
}

export function FeedbackReports({ onBack }: FeedbackReportsProps) {
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const reports = [
    {
      id: '94821',
      user: 'John Doe',
      email: 'john.doe@example.com',
      plan: 'Premium Plan',
      type: 'Bug',
      severity: 'Critical Bug',
      message: "The API returns a 500 internal server error consistently when I try to pass a message object with nested properties in the 'metadata' field. This happens every time I use the Claude 3.5 model specifically. I've attached a screenshot of the console log below for your reference. This is critical for our production environment as it's blocking several user flows.",
      model: 'GPT-4 Turbo',
      modelVersion: 'GPT-4 Turbo (v2.1)',
      sentiment: 'Negative',
      status: 'In Progress',
      timestamp: '2023-10-27 10:42:15',
      tokens: '450',
      latency: '230ms',
      device: 'Mac OS 14.2 / Chrome',
      location: 'SF, USA',
      ip: '192.168.1.1'
    },
    {
      id: '94822',
      user: 'Sarah Miller',
      email: 'sarah.m@example.com',
      plan: 'Free Tier',
      type: 'Feature',
      message: "Would love to see a dark mode toggle for...",
      model: 'Claude 3.5',
      sentiment: 'Positive',
      status: 'New',
      timestamp: '2023-10-27 10:41:58',
      tokens: '1,204',
      latency: '850ms'
    },
    {
      id: '94823',
      user: 'Ryan K.',
      email: 'ryan.k@example.com',
      plan: 'Pro Developer',
      type: 'General',
      message: "Overall the latency has been great lately!",
      model: 'DALL-E 3',
      sentiment: 'Very Positive',
      status: 'Resolved',
      timestamp: '2023-10-27 10:41:12',
      tokens: '32',
      latency: '45ms'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col h-full bg-[#f6f6f8] dark:bg-[#0c111d] overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#111722] px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="size-8 bg-[#135bec] rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">ClutchByte <span className="text-slate-500 font-normal text-sm ml-1">Admin</span></span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
            <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz7e95wicdCXf4XCe2aKoHxw36kgP5C0Rp8iFR0VPXnVAIx6EHiUrVNs4xiPRssE_vDZVCHLXTZkyW7htnauMu-OrqXYZN7Ce6Wpnzd2CIgt6jgPQAeyUOuGoy-qTd_YkDQhmBr37gg4eVZ-h-XF1fjMKQz7sfDackZ7cXeXeiEtqTt8nJEQidYIHgXdQGvo5ejPhUy7C4ObKpPYqcgkcR8idjqWSJubAwwbwBCQoL8d7Tt1yAK2EyqrMhjlzgQxBmBLTexWEKlWE" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback & Bug Reports</h1>
                <p className="text-slate-500 text-sm">Reviewing 2,490 total user submissions</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#135bec]/10 hover:bg-[#135bec]/20 text-[#135bec] rounded-lg text-sm font-semibold transition-all">
                  <Download size={16} /> Export CSV
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#135bec] hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all">
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Unresolved Bugs', value: '24', trend: '+5%', trendColor: 'text-emerald-500' },
                { label: 'Pending Features', value: '12', trend: '-2%', trendColor: 'text-rose-500' },
                { label: 'Avg. Sentiment', value: '78%', trend: '+4%', trendColor: 'text-emerald-500' },
                { label: 'Response Rate', value: '92%', sub: 'Target: 95%' }
              ].map((metric, i) => (
                <div key={i} className="bg-white dark:bg-[#135bec]/5 p-4 rounded-xl border border-slate-200 dark:border-[#135bec]/10">
                  <p className="text-xs text-slate-500 font-medium mb-1">{metric.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
                    {metric.trend && (
                      <span className={`${metric.trendColor} text-xs font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded`}>{metric.trend}</span>
                    )}
                    {metric.sub && (
                      <span className="text-slate-400 text-xs">{metric.sub}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-white/5">
              <div className="flex bg-slate-200/50 dark:bg-[#135bec]/5 rounded-lg p-1">
                <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-[#135bec] text-[#135bec] dark:text-white rounded-md shadow-sm">All Reports</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-[#135bec]">Bugs Only</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-[#135bec]">Feature Requests</button>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold hover:bg-[#135bec]/5 text-slate-600 dark:text-slate-400">
                <Filter size={14} /> Filter Status
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold hover:bg-[#135bec]/5 text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-[18px]">tune</span> Model Used
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead className="sticky top-0 bg-[#f6f6f8] dark:bg-[#0c111d] z-10">
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-2 px-4 w-8"><input className="rounded bg-transparent border-slate-300 dark:border-slate-700 text-[#135bec] focus:ring-[#135bec] size-4" type="checkbox" /></th>
                  <th className="pb-2">User</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Message Snippet</th>
                  <th className="pb-2">Model</th>
                  <th className="pb-2">Sentiment</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr 
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`transition-colors group cursor-pointer ${selectedReport?.id === report.id ? 'bg-[#135bec]/5 ring-1 ring-[#135bec]/40' : 'bg-white dark:bg-[#135bec]/5 hover:bg-slate-100 dark:hover:bg-[#135bec]/10'}`}
                  >
                    <td className="py-4 px-4 rounded-l-xl">
                      <input checked={selectedReport?.id === report.id} className="rounded bg-transparent border-slate-300 dark:border-slate-700 text-[#135bec] focus:ring-[#135bec] size-4" type="checkbox" readOnly />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {report.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">{report.user}</p>
                          <p className="text-[10px] text-slate-500">{report.plan}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                        report.type === 'Bug' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                        report.type === 'Feature' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {report.message}
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300">{report.model}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        {report.sentiment === 'Negative' ? <Frown size={14} className="text-rose-500" /> :
                         report.sentiment === 'Positive' ? <Smile size={14} className="text-emerald-500" /> :
                         report.sentiment === 'Very Positive' ? <Smile size={14} className="text-emerald-500" /> :
                         <Meh size={14} className="text-amber-500" />}
                        <span className={`text-xs font-medium ${
                          report.sentiment.includes('Positive') ? 'text-emerald-400' : 
                          report.sentiment === 'Negative' ? 'text-rose-400' : 'text-amber-400'
                        }`}>{report.sentiment}</span>
                      </div>
                    </td>
                    <td className="py-4 rounded-r-xl">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${
                        report.status === 'In Progress' ? 'text-blue-400' :
                        report.status === 'Resolved' ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        <span className={`size-2 rounded-full ${
                          report.status === 'In Progress' ? 'bg-blue-400' :
                          report.status === 'Resolved' ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}></span> {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0c111d]">
            <p className="text-xs text-slate-500">Showing <span className="text-slate-900 dark:text-slate-200">1-3</span> of 2,490 reports</p>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-[#135bec]/10 text-slate-500"><ChevronLeft size={16} /></button>
              <button className="size-7 rounded bg-[#135bec] text-white text-xs font-bold">1</button>
              <button className="size-7 rounded hover:bg-[#135bec]/10 text-xs font-bold text-slate-600 dark:text-slate-400">2</button>
              <button className="size-7 rounded hover:bg-[#135bec]/10 text-xs font-bold text-slate-600 dark:text-slate-400">3</button>
              <span className="text-slate-500">...</span>
              <button className="size-7 rounded hover:bg-[#135bec]/10 text-xs font-bold text-slate-600 dark:text-slate-400">48</button>
              <button className="p-1 rounded hover:bg-[#135bec]/10 text-slate-500"><ChevronRight size={16} /></button>
            </div>
          </div>
        </main>

        {/* Detail Inspector Pane */}
        {selectedReport && (
          <aside className="w-[450px] border-l border-slate-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#0c111d] shrink-0">
            <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Report Details</h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-[#135bec]/10 text-slate-400 transition-colors"><Share2 size={18} /></button>
                <button className="p-2 rounded-lg hover:bg-[#135bec]/10 text-slate-400 transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {/* Detail Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300">
                    {selectedReport.user.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedReport.user}</h4>
                    <p className="text-xs text-slate-500">{selectedReport.email} • ID: {selectedReport.id}</p>
                  </div>
                </div>
                {selectedReport.severity && (
                  <span className="bg-rose-500/10 text-rose-500 text-[10px] font-bold px-2 py-1 rounded border border-rose-500/20 uppercase">{selectedReport.severity}</span>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#135bec]/5 p-3 rounded-lg border border-[#135bec]/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Model Version</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedReport.modelVersion || selectedReport.model}</p>
                </div>
                <div className="bg-[#135bec]/5 p-3 rounded-lg border border-[#135bec]/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Submission Date</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedReport.timestamp}</p>
                </div>
                <div className="bg-[#135bec]/5 p-3 rounded-lg border border-[#135bec]/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Device/OS</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedReport.device || 'N/A'}</p>
                </div>
                <div className="bg-[#135bec]/5 p-3 rounded-lg border border-[#135bec]/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Sentiment Score</p>
                  <p className={`text-sm font-medium flex items-center gap-1 ${selectedReport.sentiment === 'Negative' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    <span className="material-symbols-outlined text-sm">trending_down</span> 0.12 ({selectedReport.sentiment})
                  </p>
                </div>
              </div>

              {/* Full Message */}
              <div className="mb-8">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">User Message</h5>
                <div className="bg-slate-100 dark:bg-[#1a2333] p-4 rounded-xl text-sm leading-relaxed border border-white/5 text-slate-700 dark:text-slate-300">
                  "{selectedReport.message}"
                </div>
              </div>

              {/* Attachments */}
              <div className="mb-8">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Attachments (1)</h5>
                <div className="relative group cursor-zoom-in rounded-xl overflow-hidden border border-white/5">
                  <img className="w-full h-32 object-cover transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATmB0t6hrxBhFmkBA4zO1Y6pXxNZ8Tv8iL2-kW-1H4_IaTBJZKHB6AmB2laWPj8vrfyAO_FNYHy6JiI1e-kPZmQFOSzpn2ziiKtH5gF5RmaB70EyM5qDh_z68FBmuY13X0HPNVhxmotoy1wE7cTU6cgfz_uLV1lCaDIE2ijRF9TFVoEPHWyY8yTK0biCYBL3Q1Ikn9E9tUAsJWPsNIVS1LW7tXwfF0qLewNV7AXMtcGERqr3fK4vBoX4GjnZoNy8nNGKW5r_tFqss" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">fullscreen</span>
                  </div>
                </div>
              </div>

              {/* Response Section */}
              <div className="mb-8">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Internal Note & Status</h5>
                <div className="space-y-4">
                  <div className="relative">
                    <select className="w-full bg-[#135bec]/5 border border-[#135bec]/10 rounded-lg py-2.5 px-4 text-sm font-semibold appearance-none focus:ring-[#135bec] focus:border-[#135bec] outline-none text-slate-900 dark:text-white">
                      <option value="new">Status: New</option>
                      <option selected value="progress">Status: In Progress</option>
                      <option value="resolved">Status: Resolved</option>
                      <option value="junk">Status: Junk/Spam</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                  <textarea className="w-full bg-[#135bec]/5 border border-[#135bec]/10 rounded-lg p-4 text-sm focus:ring-[#135bec] focus:border-[#135bec] outline-none min-h-[100px] placeholder:text-slate-600 text-slate-900 dark:text-white" placeholder="Type your reply or internal note here..."></textarea>
                </div>
              </div>
            </div>

            {/* Detail Actions */}
            <div className="p-6 bg-slate-50 dark:bg-[#111722] border-t border-slate-200 dark:border-white/5 flex gap-3">
              <button className="flex-1 px-4 py-3 bg-slate-200 dark:bg-[#135bec]/10 hover:bg-[#135bec]/20 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-all">
                Internal Note
              </button>
              <button className="flex-[2] px-4 py-3 bg-[#135bec] hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                <Send size={16} /> Send Response
              </button>
            </div>
          </aside>
        )}
      </div>
    </motion.div>
  );
}
