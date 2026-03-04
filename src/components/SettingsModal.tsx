import React, { useState } from 'react';
import { Settings } from '../types';
import { MODELS } from '../constants';
import { X } from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">OpenRouter API Key</label>
            <input 
              type="password"
              value={localSettings.openRouterApiKey}
              onChange={e => setLocalSettings({...localSettings, openRouterApiKey: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
              placeholder="sk-or-v1-..."
            />
            <p className="text-xs text-zinc-500 mt-1">Required for DeepSeek models.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Model</label>
            <select 
              value={localSettings.defaultModel}
              onChange={e => setLocalSettings({...localSettings, defaultModel: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">System Prompt</label>
            <textarea 
              value={localSettings.systemPrompt}
              onChange={e => setLocalSettings({...localSettings, systemPrompt: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 resize-none h-24"
              placeholder="You are a helpful assistant..."
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Dark Mode</label>
            <button 
              onClick={() => setLocalSettings({...localSettings, isDarkMode: !localSettings.isDarkMode})}
              className={`w-11 h-6 rounded-full transition-colors relative ${localSettings.isDarkMode ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${localSettings.isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2 bg-zinc-50 dark:bg-zinc-950">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave(localSettings)}
            className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
