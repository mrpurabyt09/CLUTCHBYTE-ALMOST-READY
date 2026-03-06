import React from 'react';
import { useModels } from '../context/ModelContext';

export const ModelsDirectory: React.FC = () => {
  const { models } = useModels();
  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#101622] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Models Directory</h1>
          <p className="text-slate-500 dark:text-slate-400">Explore and manage available AI models for your conversations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.id} className="relative group min-h-[260px]">
              {/* Main Card */}
              <div className="bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#232f48] rounded-xl p-6 hover:shadow-lg transition-all flex flex-col h-full cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#135bec]/10 rounded-xl text-[#135bec] transition-colors">
                    <span className="material-symbols-outlined text-[28px]">smart_toy</span>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded">
                    {model.provider}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{model.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow line-clamp-2">
                  {model.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#232f48]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${model.status === 'Operational' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{model.status}</span>
                  </div>
                  <button className="text-sm font-bold text-[#135bec] hover:underline">Details</button>
                </div>
              </div>

              {/* Popover Overlay */}
              <div className="absolute inset-0 bg-white/95 dark:bg-[#192233]/95 backdrop-blur-sm border border-[#135bec] rounded-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 flex flex-col justify-center shadow-xl">
                <h4 className="text-lg font-bold text-[#135bec] mb-2">{model.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-grow">
                  {model.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-[#101622] p-3 rounded-lg border border-slate-100 dark:border-[#232f48]">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Latency</div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{model.latency}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#101622] p-3 rounded-lg border border-slate-100 dark:border-[#232f48]">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Context</div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{model.tokenUsage}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
