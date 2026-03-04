import React from 'react';

export const CompareOutput: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Toolbar & Breadcrumbs */}
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">ClutchByte</span>
            <span className="text-slate-400 dark:text-[#586380] text-sm">/</span>
            <span className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">Playground</span>
            <span className="text-slate-400 dark:text-[#586380] text-sm">/</span>
            <span className="text-slate-900 dark:text-white text-sm font-medium">Compare Output</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Compare Output</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-surface-dark rounded-lg border border-slate-200 dark:border-[#232f48]">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Stream Output</span>
            <button className="w-8 h-4 bg-primary rounded-full relative">
              <span className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg shadow-lg shadow-primary/20 transition-all">
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            <span>Run Comparison</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-6 h-full">
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* System Prompt */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-primary text-[18px]">engineering</span>
                System Prompt
              </label>
              <div className="relative group">
                <textarea 
                  className="w-full h-32 bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-[#2d3748] rounded-xl p-4 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono" 
                  placeholder="Enter system instructions here..."
                  defaultValue="Act as a senior python engineer."
                />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-400 dark:text-slate-500">
                    <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                  </button>
                </div>
              </div>
            </div>

            {/* User Input */}
            <div className="lg:col-span-8 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-primary text-[18px]">chat</span>
                User Input
              </label>
              <div className="relative group">
                <textarea 
                  className="w-full h-32 bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-[#2d3748] rounded-xl p-4 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono" 
                  placeholder="Enter your prompt here..."
                  defaultValue="Write a recursive function to calculate Fibonacci numbers efficiently. Explain the time complexity."
                />
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-400 dark:text-slate-500" title="Attach file">
                    <span className="material-symbols-outlined text-[18px]">attach_file</span>
                  </button>
                  <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-slate-400 dark:text-slate-500" title="Enhance prompt">
                    <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="flex-1 min-h-[500px] grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
            {/* Left Model Column */}
            <div className="flex flex-col rounded-xl border border-slate-200 dark:border-[#2d3748] bg-white dark:bg-[#1a1d24] overflow-hidden shadow-sm">
              {/* Controls Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-[#2d3748] bg-slate-50 dark:bg-[#151920] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                  </div>
                  <select className="bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-0 p-0 cursor-pointer">
                    <option>GPT-4 Turbo</option>
                    <option>GPT-3.5 Turbo</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col w-24">
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">
                      <span>Temp</span>
                      <span>0.7</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[70%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex flex-col w-24">
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">
                      <span>Top P</span>
                      <span>1.0</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full rounded-full"></div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </button>
                </div>
              </div>
              {/* Output Body */}
              <div className="flex-1 p-5 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <p className="mb-4">Here is a Python function to calculate Fibonacci numbers using recursion with memoization to ensure efficiency:</p>
                <div className="relative my-4 rounded-lg bg-slate-900 border border-slate-800 p-4 overflow-x-auto group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded">Copy</button>
                  </div>
                  <pre>
                    <code className="text-blue-400">def </code>
                    <code className="text-yellow-300">fibonacci_memo</code>
                    <code className="text-slate-300">(n, memo=&#123;&#125;):</code>
                    <br/>
                    <code className="text-slate-400">    # Base cases</code>
                    <br/>
                    <code className="text-purple-400">    if </code>
                    <code className="text-slate-300">n </code>
                    <code className="text-purple-400">in </code>
                    <code className="text-slate-300">memo:</code>
                    <br/>
                    <code className="text-purple-400">        return </code>
                    <code className="text-slate-300">memo[n]</code>
                    <br/>
                    <code className="text-purple-400">    if </code>
                    <code className="text-slate-300">n &lt;= 1:</code>
                    <br/>
                    <code className="text-purple-400">        return </code>
                    <code className="text-slate-300">n</code>
                    <br/>
                    <br/>
                    <code className="text-slate-400">    # Recursive step with storage</code>
                    <br/>
                    <code className="text-slate-300">    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)</code>
                    <br/>
                    <code className="text-purple-400">    return </code>
                    <code className="text-slate-300">memo[n]</code>
                  </pre>
                </div>
                <p className="mb-2 font-bold text-slate-900 dark:text-white">Time Complexity:</p>
                <p>Without memoization, the time complexity is <span className="bg-slate-200 dark:bg-slate-800 px-1 rounded text-primary font-bold">O(2^n)</span> due to redundant calculations. With memoization, each number is calculated only once, reducing the complexity to <span className="bg-slate-200 dark:bg-slate-800 px-1 rounded text-primary font-bold">O(n)</span>.</p>
              </div>
              {/* Metrics Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-[#151920] border-t border-slate-200 dark:border-[#2d3748] flex items-center justify-between text-xs">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-slate-500 dark:text-slate-400 mb-0.5">Latency</span>
                    <span className="font-bold text-red-500 flex items-center gap-1">
                      1,400ms
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 dark:text-slate-400 mb-0.5">Tokens</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">450</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 dark:text-slate-400 mb-0.5">Cost</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">$0.03</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Model Column */}
            <div className="flex flex-col rounded-xl border border-slate-200 dark:border-[#2d3748] bg-white dark:bg-[#1a1d24] overflow-hidden shadow-sm">
              {/* Controls Header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-[#2d3748] bg-slate-50 dark:bg-[#151920] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/10 text-purple-600 dark:text-purple-400 p-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                  </div>
                  <select className="bg-transparent border-none text-sm font-bold text-slate-900 dark:text-white focus:ring-0 p-0 cursor-pointer">
                    <option>Claude 3 Opus</option>
                    <option>Claude 3 Sonnet</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col w-24">
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">
                      <span>Temp</span>
                      <span>0.5</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[50%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex flex-col w-24">
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">
                      <span>Top P</span>
                      <span>0.9</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[90%] rounded-full"></div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-purple-500 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </button>
                </div>
              </div>
              {/* Output Body */}
              <div className="flex-1 p-5 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <p className="mb-4">Certainly. The most efficient way to calculate Fibonacci numbers for large `n` is usually iteration or matrix exponentiation, but for a recursive approach, memoization is key.</p>
                <div className="relative my-4 rounded-lg bg-slate-900 border border-slate-800 p-4 overflow-x-auto group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded">Copy</button>
                  </div>
                  <pre>
                    <code className="text-blue-400">from </code>
                    <code className="text-yellow-300">functools </code>
                    <code className="text-blue-400">import </code>
                    <code className="text-yellow-300">lru_cache</code>
                    <br/>
                    <br/>
                    <code className="text-yellow-300">@lru_cache(maxsize=None)</code>
                    <br/>
                    <code className="text-blue-400">def </code>
                    <code className="text-yellow-300">fib_recursive</code>
                    <code className="text-slate-300">(n):</code>
                    <br/>
                    <code className="text-purple-400">    if </code>
                    <code className="text-slate-300">n &lt; 2:</code>
                    <br/>
                    <code className="text-purple-400">        return </code>
                    <code className="text-slate-300">n</code>
                    <br/>
                    <code className="text-purple-400">    return </code>
                    <code className="text-slate-300">fib_recursive(n-1) + fib_recursive(n-2)</code>
                  </pre>
                </div>
                <p className="mb-2 font-bold text-slate-900 dark:text-white">Explanation:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>I used the built-in <code>@lru_cache</code> decorator which is cleaner Pythonic style.</li>
                  <li>It handles the storage of results automatically.</li>
                </ul>
                <p className="mb-2 font-bold text-slate-900 dark:text-white">Complexity:</p>
                <p>Time Complexity: <span className="bg-slate-200 dark:bg-slate-800 px-1 rounded text-purple-400 font-bold">O(n)</span> - Linear time.</p>
              </div>
              {/* Metrics Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-[#151920] border-t border-slate-200 dark:border-[#2d3748] flex items-center justify-between text-xs">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-slate-500 dark:text-slate-400 mb-0.5">Latency</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      900ms
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 dark:text-slate-400 mb-0.5">Tokens</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">480</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 dark:text-slate-400 mb-0.5">Cost</span>
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      $0.015
                      <span className="material-symbols-outlined text-[14px]">trending_down</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
