import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Send, User, Bot, Settings2, Trash2 } from 'lucide-react';

export function ModelPlayground() {
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full bg-[#f6f6f8] dark:bg-[#101622]"
    >
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-[#2a3649] flex items-center justify-between px-8 bg-white/50 dark:bg-[#101622]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Model Playground</h2>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-[#2a3649]"></div>
          <select className="bg-transparent text-sm font-bold outline-none text-[#135bec] cursor-pointer">
            <option>Gemini 1.5 Pro</option>
            <option>GPT-4 Turbo</option>
            <option>Claude 3 Opus</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
            <Trash2 size={16} />
            Clear
          </button>
          <button className="px-6 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Play size={18} fill="currentColor" />
            Run Test
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Config */}
        <aside className="w-80 border-r border-slate-200 dark:border-[#2a3649] p-6 space-y-8 overflow-y-auto bg-white dark:bg-[#111722]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Settings2 size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Parameters</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Temperature</label>
                  <span className="text-xs font-bold text-[#135bec]">{temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#135bec]" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Top P</label>
                  <span className="text-xs font-bold text-[#135bec]">{topP}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#135bec]" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Prompt</h3>
            <textarea 
              className="w-full h-48 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#2a3649] text-sm outline-none focus:border-[#135bec] transition-all resize-none text-slate-900 dark:text-white" 
              placeholder="Enter system instructions..."
              defaultValue="You are a helpful and concise AI assistant powered by ClutchByte."
            ></textarea>
          </div>
        </aside>

        {/* Right: Chat/Output */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0b0f17]">
          <div className="flex-1 p-8 overflow-y-auto space-y-8">
            {/* User Message */}
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">User</p>
                <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">Write a quick Python script to fetch stock prices using an API.</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-4 max-w-3xl">
              <div className="w-8 h-8 rounded-lg bg-[#135bec]/10 flex items-center justify-center flex-shrink-0">
                <Bot size={18} className="text-[#135bec]" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-xs font-bold text-[#135bec] uppercase">Gemini 1.5 Pro</p>
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-[#2a3649]">
                  <pre className="text-xs font-mono text-slate-600 dark:text-slate-300 overflow-x-auto">
                    <code>{`import requests

def get_stock_price(symbol):
    url = f"https://api.example.com/price/{symbol}"
    response = requests.get(url)
    return response.json()`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-slate-200 dark:border-[#2a3649] bg-white dark:bg-[#0b0f17]">
            <div className="max-w-3xl mx-auto relative">
              <textarea 
                className="w-full p-4 pr-12 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-[#2a3649] text-sm outline-none focus:border-[#135bec] transition-all resize-none h-14 text-slate-900 dark:text-white" 
                placeholder="Type your test prompt..."
              ></textarea>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#135bec] hover:scale-110 transition-transform">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
