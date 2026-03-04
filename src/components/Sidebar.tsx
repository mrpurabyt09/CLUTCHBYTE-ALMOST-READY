import React, { useState } from 'react';
import { Chat } from '../types';
import { MessageSquare, Plus, Settings, Trash2, Edit2, X, BarChart2, Bot } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenModels: () => void;
  onOpenApiKeys: () => void;
  onLogout: () => void;
  activeView: 'chats' | 'models' | 'settings' | 'api-keys' | 'admin' | 'login' | 'register' | 'reset-password' | 'set-new-password';
}

export function Sidebar({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat, 
  onRenameChat, 
  isOpen, 
  onClose, 
  onOpenSettings, 
  onOpenAdmin,
  onOpenModels,
  onOpenApiKeys,
  onLogout,
  activeView
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-50 w-[260px] h-full flex flex-col bg-[#111722] border-r border-[#232f48] transition-transform duration-300 ease-in-out shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-2 py-2 mb-4">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#135bec] to-blue-400 text-white shadow-lg shadow-[#135bec]/20">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-none text-white">ClutchByte</h1>
              <p className="text-xs font-medium text-slate-400 mt-1">AI Platform</p>
            </div>
          </div>
          
          {/* Main Nav */}
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => onSelectChat(chats[0]?.id || 'new')}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-left",
                activeView === 'chats' ? "bg-[#135bec]/10 text-[#135bec]" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              <span className="text-sm font-medium">Chats</span>
            </button>
            <button 
              onClick={onOpenModels}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-left",
                activeView === 'models' ? "bg-[#135bec]/10 text-[#135bec]" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">deployed_code</span>
              <span className="text-sm font-medium">Models</span>
            </button>
            <button 
              onClick={onOpenSettings}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-left",
                activeView === 'settings' ? "bg-[#135bec]/10 text-[#135bec]" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button 
              onClick={onOpenApiKeys}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-left",
                activeView === 'api-keys' ? "bg-[#135bec]/10 text-[#135bec]" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">vpn_key</span>
              <span className="text-sm font-medium">API Keys</span>
            </button>
            <button 
              onClick={onOpenAdmin}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors w-full text-left",
                activeView === 'admin' ? "bg-[#135bec]/10 text-[#135bec]" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              <span className="text-sm font-medium">Admin Dashboard</span>
            </button>
          </nav>

          <div className="mt-6">
            <button 
              onClick={onNewChat}
              className="w-full flex items-center justify-between gap-2 bg-[#135bec] hover:bg-[#1d6bf5] text-white rounded-lg px-4 py-2.5 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span className="text-sm font-medium">New Chat</span>
              </div>
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {activeView === 'chats' && (
            <div className="flex flex-col gap-1">
              <p className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider mt-2">History</p>
              {chats.map(chat => (
                <div 
                  key={chat.id}
                  className={clsx(
                    "group flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg transition-all cursor-pointer",
                    currentChatId === chat.id 
                      ? "bg-[#192233]/50 text-white border border-[#232f48]/50" 
                      : "text-slate-400 hover:bg-[#192233] hover:text-white border border-transparent"
                  )}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <span className="material-symbols-outlined text-[18px] shrink-0">
                    {currentChatId === chat.id ? 'chat_bubble' : 'chat_bubble_outline'}
                  </span>
                  
                  {editingId === chat.id ? (
                    <input
                      autoFocus
                      className="flex-1 bg-transparent border-none outline-none text-sm text-white"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={() => {
                        if (editTitle.trim()) onRenameChat(chat.id, editTitle);
                        setEditingId(null);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (editTitle.trim()) onRenameChat(chat.id, editTitle);
                          setEditingId(null);
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm truncate flex-1 font-medium">{chat.title}</span>
                  )}

                  <div className={clsx(
                    "items-center gap-1 shrink-0",
                    currentChatId === chat.id ? "flex" : "hidden group-hover:flex"
                  )}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(chat.id);
                        setEditTitle(chat.title);
                      }}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Rename chat"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / User Profile */}
        <div className="border-t border-[#232f48] p-4">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors w-full text-left">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-sm font-medium">Help & Support</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors mt-1 w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
