import React, { useState } from 'react';

export const ApiKeys: React.FC = () => {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'sk_live_••••••••••••••••••••••••', created: '2026-03-01', status: 'Active' },
    { id: '2', name: 'Staging API Key', key: 'sk_test_••••••••••••••••••••••••', created: '2026-03-02', status: 'Active' },
    { id: '3', name: 'Development API Key', key: 'sk_dev_••••••••••••••••••••••••', created: '2026-03-03', status: 'Inactive' },
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#101622] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">API Keys</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your access tokens and security credentials for external integrations.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#135bec] text-white rounded-xl font-bold hover:bg-[#1d6bf5] transition-all shadow-lg shadow-[#135bec]/20">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create New Key</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#232f48] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-[#232f48] flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your API Keys</h3>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                <span className="text-xs text-slate-500">Keys are encrypted and stored securely.</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">API Key</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#232f48]">
                  {keys.map((key) => (
                    <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{key.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300 font-mono">
                            {key.key}
                          </code>
                          <button className="p-1 text-slate-400 hover:text-[#135bec] transition-colors">
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{key.created}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${key.status === 'Active' ? 'bg-[#0bda5e]/10 text-[#0bda5e]' : 'bg-slate-500/10 text-slate-500'}`}>
                          <span className={`h-1 w-1 rounded-full ${key.status === 'Active' ? 'bg-[#0bda5e]' : 'bg-slate-500'}`}></span>
                          {key.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-[#135bec] hover:bg-[#135bec]/10 rounded transition-colors">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
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
      </div>
    </div>
  );
};
