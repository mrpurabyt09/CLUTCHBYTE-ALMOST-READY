import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useModels } from '../../context/ModelContext';

interface ModelFormProps {
  mode: 'add' | 'edit';
  initialData?: any;
  onBack: () => void;
}

export function ModelForm({ mode, initialData, onBack }: ModelFormProps) {
  const { addModel, updateModel } = useModels();
  const [temperature, setTemperature] = useState(initialData?.temperature || 0.7);
  const [topP, setTopP] = useState(initialData?.topP || 1.0);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    const modelData = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name: (document.getElementById('modelName') as HTMLInputElement).value,
      provider: (document.getElementById('provider') as HTMLSelectElement).value,
      description: (document.getElementById('description') as HTMLTextAreaElement).value,
      latency: (document.getElementById('latency') as HTMLInputElement).value,
      status: 'Operational',
      tokenUsage: '128k',
    };

    if (mode === 'add') {
      addModel(modelData);
    } else {
      updateModel(initialData.id, modelData);
    }
    onBack();
  };

  const title = mode === 'add' ? 'Add New AI Model' : `Edit Model: ${initialData?.name || 'GPT-4 Vision'}`;
  const subtitle = mode === 'add' 
    ? 'Configure connection details and inference parameters for a new LLM provider.'
    : 'Update connection details and fine-tune inference parameters.';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col h-full bg-[#f6f6f8] dark:bg-[#111722] overflow-hidden"
    >
      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <main className="w-full max-w-[1400px] mx-auto p-6 md:p-8 lg:p-10">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1 hover:text-[#135bec] transition-colors group"
              >
                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span>Back to Models</span>
              </button>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              {mode === 'edit' && (
                <>
                  <button className="text-slate-400 hover:text-red-500 transition-colors text-sm flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete Model
                  </button>
                  <div className="h-8 w-px bg-slate-200 dark:bg-[#2a364d]"></div>
                </>
              )}
              <button 
                onClick={onBack}
                className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-[#2a364d] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2230] font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 rounded-lg bg-[#135bec] hover:bg-blue-600 text-white font-bold transition-colors shadow-lg shadow-blue-900/20 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">save</span>
                {mode === 'add' ? 'Save Configuration' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: General Configuration */}
            <div className="lg:col-span-7 space-y-6">
              {/* General Info Card */}
              <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-slate-200 dark:border-[#2a364d] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-[#2a364d] pb-4">
                  <span className="material-symbols-outlined text-[#135bec]">tune</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">General Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Model Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="modelName">Model Name</label>
                    <input 
                      className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all" 
                      id="modelName" 
                      placeholder="e.g. Llama 3 70B Instruct" 
                      type="text"
                      defaultValue={initialData?.name}
                    />
                  </div>
                  {/* Slug */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="slug">Unique Identifier (Slug)</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all pl-10" 
                        id="slug" 
                        placeholder="e.g. llama-3-70b-instruct" 
                        type="text"
                        defaultValue={initialData?.slug}
                      />
                      <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-[18px]">tag</span>
                    </div>
                  </div>
                  {/* Average Latency */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="latency">Average Latency</label>
                    <input 
                      className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all" 
                      id="latency" 
                      placeholder="e.g. ~400ms" 
                      type="text"
                      defaultValue={initialData?.latency}
                    />
                  </div>
                  {/* Provider */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="provider">Model Provider</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all appearance-none cursor-pointer" 
                      id="provider"
                      defaultValue={initialData?.provider || ""}
                    >
                      <option disabled value="">Select a provider type</option>
                      <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
                      <option value="anthropic">Anthropic (Claude 3)</option>
                      <option value="ollama">Ollama (Local)</option>
                      <option value="openrouter">OpenRouter</option>
                      <option value="groq">Groq</option>
                      <option value="custom">Custom HTTP Endpoint</option>
                    </select>
                  </div>
                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="description">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <textarea 
                      className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all resize-none" 
                      id="description" 
                      placeholder="Add internal notes about this model's use case..." 
                      rows={3}
                      defaultValue={initialData?.description}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Connection Details Card */}
              <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-slate-200 dark:border-[#2a364d] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-[#2a364d] pb-4">
                  <span className="material-symbols-outlined text-[#135bec]">link</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connection Details</h3>
                </div>
                <div className="space-y-5">
                  {/* Endpoint */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="endpoint">API Endpoint URL</label>
                    <div className="flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-200 dark:border-[#2a364d] bg-slate-100 dark:bg-[#111722] text-slate-500 dark:text-slate-400 text-sm">
                        https://
                      </span>
                      <input 
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-lg bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all" 
                        id="endpoint" 
                        placeholder="api.provider.com/v1/chat/completions" 
                        type="text"
                        defaultValue={initialData?.endpoint}
                      />
                    </div>
                  </div>
                  {/* API Key */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="apiKey">API Key / Secret Token</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all pr-24 font-mono text-sm tracking-wide" 
                        id="apiKey" 
                        type={showApiKey ? "text" : "password"}
                        placeholder="sk-..."
                        defaultValue={initialData?.apiKey}
                      />
                      <div className="absolute right-2 top-2 flex gap-1">
                        <button 
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="text-slate-400 hover:text-[#135bec] transition-colors p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showApiKey ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                        <button 
                          onClick={async () => {
                            const start = performance.now();
                            const endpoint = (document.getElementById('endpoint') as HTMLInputElement).value;
                            try {
                              await fetch(`https://${endpoint}`, { method: 'HEAD' });
                              const end = performance.now();
                              const latency = Math.round(end - start);
                              (document.getElementById('latency') as HTMLInputElement).value = `~${latency}ms`;
                            } catch (e) {
                              alert('Connection failed');
                            }
                          }}
                          className="text-slate-400 hover:text-[#135bec] transition-colors p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          <span className="material-symbols-outlined text-[20px]">bolt</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      Keys are encrypted at rest.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Settings Card */}
              <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-slate-200 dark:border-[#2a364d] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-[#2a364d] pb-4">
                  <span className="material-symbols-outlined text-[#135bec]">build_circle</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Advanced Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="contextWindowSelect">Context Window Size</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all appearance-none cursor-pointer" 
                      id="contextWindowSelect"
                      defaultValue={initialData?.contextWindow || "128k"}
                    >
                      <option value="4k">4k Tokens</option>
                      <option value="8k">8k Tokens</option>
                      <option value="32k">32k Tokens</option>
                      <option value="128k">128k Tokens (Large)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="stopSequences">Stop Sequences</label>
                    <input 
                      className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all font-mono text-sm" 
                      id="stopSequences" 
                      placeholder="e.g. ['\n', 'User:']" 
                      type="text" 
                      defaultValue={initialData?.stopSequences}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Parameters */}
            <div className="lg:col-span-5 space-y-6">
              {/* Parameters Card */}
              <div className="bg-white dark:bg-[#1a2230] rounded-xl border border-slate-200 dark:border-[#2a364d] p-6 shadow-sm sticky top-6">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-[#2a364d] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#135bec]">settings_suggest</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Default Parameters</h3>
                  </div>
                  <button className="text-xs text-[#135bec] hover:text-blue-400 font-medium hover:underline">Reset Defaults</button>
                </div>
                <div className="space-y-8">
                  {/* Temperature */}
                  <div className="space-y-3 group">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="temperature">
                        Temperature
                        <span className="material-symbols-outlined text-[16px] text-slate-400 cursor-help" title="Controls randomness: Lowering results in less random completions.">help</span>
                      </label>
                      <span className="bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-[#2a364d] px-2 py-1 rounded text-xs font-mono text-[#135bec] font-bold">{temperature.toFixed(1)}</span>
                    </div>
                    <input 
                      className="w-full h-1.5 bg-slate-200 dark:bg-[#2a364d] rounded-lg appearance-none cursor-pointer accent-[#135bec]" 
                      id="temperature" 
                      max="2" 
                      min="0" 
                      step="0.1" 
                      type="range" 
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Precise (0.0)</span>
                      <span>Creative (2.0)</span>
                    </div>
                  </div>
                  {/* Top P */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="topP">
                        Top P
                        <span className="material-symbols-outlined text-[16px] text-slate-400 cursor-help" title="Controls diversity via nucleus sampling.">help</span>
                      </label>
                      <span className="bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-[#2a364d] px-2 py-1 rounded text-xs font-mono text-[#135bec] font-bold">{topP.toFixed(2)}</span>
                    </div>
                    <input 
                      className="w-full h-1.5 bg-slate-200 dark:bg-[#2a364d] rounded-lg appearance-none cursor-pointer accent-[#135bec]" 
                      id="topP" 
                      max="1" 
                      min="0" 
                      step="0.05" 
                      type="range" 
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Low Diversity</span>
                      <span>High Diversity</span>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-slate-100 dark:border-[#2a364d]"></div>
                  {/* Max Tokens */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="maxTokens">Max Tokens</label>
                      <span className="text-xs text-slate-500">Maximum generated length</span>
                    </div>
                    <div className="relative">
                      <input 
                        className="w-full bg-slate-50 dark:bg-[#192233] border border-slate-200 dark:border-[#2a364d] rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 focus:border-[#135bec] transition-all pr-16 font-mono" 
                        id="maxTokens" 
                        type="number" 
                        defaultValue={initialData?.maxTokens || 4096}
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-medium text-slate-500 uppercase tracking-wider">tokens</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      The maximum number of tokens to generate in the completion. 
                    </p>
                  </div>
                </div>
                {/* Alert Box */}
                <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3">
                  <span className="material-symbols-outlined text-yellow-500 shrink-0">warning</span>
                  <p className="text-xs text-yellow-700 dark:text-yellow-200/80 leading-relaxed">
                    Changing these parameters affects cost and performance. Ensure your provider supports the selected context window size.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
