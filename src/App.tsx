import React, { useState, useEffect } from 'react';
import { Settings, Message, Chat } from './types';
import { DEFAULT_SETTINGS, MODELS } from './constants';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { AccountSettings } from './components/AccountSettings';
import { LiveAudioModal } from './components/LiveAudioModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ModelsDirectory } from './components/ModelsDirectory';
import { ApiKeys } from './components/ApiKeys';
import { Login } from './components/auth/Login';
import { Registration } from './components/auth/Registration';
import { ResetPassword } from './components/auth/ResetPassword';
import { SetNewPassword } from './components/auth/SetNewPassword';
import { streamOpenRouter, streamGemini, generateImage, generateSpeech } from './services/aiService';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading, logout } = useAuth();
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('chat_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!MODELS.find(m => m.id === parsed.defaultModel)) {
          parsed.defaultModel = DEFAULT_SETTINGS.defaultModel;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing settings", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((c: Chat) => {
          if (!MODELS.find(m => m.id === c.model)) {
            return { ...c, model: DEFAULT_SETTINGS.defaultModel };
          }
          return c;
        });
      }
    } catch (e) {
      console.error("Error parsing chats", e);
    }
    return [];
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chats' | 'models' | 'settings' | 'api-keys' | 'admin' | 'login' | 'register' | 'reset-password' | 'set-new-password'>(user ? 'chats' : 'login');

  useEffect(() => {
    if (!loading) {
      setActiveView(user ? 'chats' : 'login');
    }
  }, [user, loading]);
  const [resetEmail, setResetEmail] = useState('');
  const [isLiveAudioOpen, setIsLiveAudioOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastDeletedChat, setLastDeletedChat] = useState<{ chat: Chat, index: number } | null>(null);
  const [lastDeletedAll, setLastDeletedAll] = useState<Chat[] | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('chat_settings', JSON.stringify(settings));
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('clutchbyte_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('clutchbyte_user');
    }
  }, [user]);

  const currentChat = chats.find(c => c.id === currentChatId) || null;

  const handleLogin = () => {
    setActiveView('chats');
  };

  const handleLogout = async () => {
    await logout();
    setActiveView('login');
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      model: settings.defaultModel,
      systemPrompt: settings.systemPrompt,
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = (id: string) => {
    const chatToDelete = chats.find(c => c.id === id);
    const index = chats.findIndex(c => c.id === id);
    
    if (chatToDelete) {
      setLastDeletedChat({ chat: chatToDelete, index });
      setLastDeletedAll(null);
      setChats(chats.filter(c => c.id !== id));
      setShowUndoToast(true);
      
      if (currentChatId === id) {
        setCurrentChatId(null);
      }

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setShowUndoToast(false);
      }, 5000);
    }
  };

  const handleClearAllChats = () => {
    if (chats.length > 0) {
      setLastDeletedAll([...chats]);
      setLastDeletedChat(null);
      setChats([]);
      setCurrentChatId(null);
      setShowUndoToast(true);

      setTimeout(() => {
        setShowUndoToast(false);
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (lastDeletedChat) {
      const newChats = [...chats];
      newChats.splice(lastDeletedChat.index, 0, lastDeletedChat.chat);
      setChats(newChats);
      setCurrentChatId(lastDeletedChat.chat.id);
      setLastDeletedChat(null);
      setShowUndoToast(false);
    } else if (lastDeletedAll) {
      setChats(lastDeletedAll);
      setLastDeletedAll(null);
      setShowUndoToast(false);
    }
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setChats(chats.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const handleSendMessage = async (content: string, type: 'text' | 'image' = 'text', imageSize?: string) => {
    if (!currentChatId) {
      const newChatId = Date.now().toString();
      const newChat: Chat = {
        id: newChatId,
        title: type === 'text' ? content.slice(0, 30) : 'New Chat',
        messages: [],
        model: settings.defaultModel,
        systemPrompt: settings.systemPrompt,
      };
      setChats([newChat, ...chats]);
      setCurrentChatId(newChatId);
      processMessage(newChatId, content, type, imageSize, newChat.model);
      return;
    }
    
    if (currentChat && currentChat.messages.length === 0 && type === 'text') {
      handleRenameChat(currentChat.id, content.slice(0, 30));
    }

    processMessage(currentChatId, content, type, imageSize, currentChat?.model || settings.defaultModel);
  };

  const processMessage = async (chatId: string, content: string, type: 'text' | 'image', imageSize?: string, modelId?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      type,
      timestamp: Date.now(),
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return { ...c, messages: [...c.messages, userMessage] };
      }
      return c;
    }));

    setIsGenerating(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: '',
      type: 'text',
      timestamp: Date.now(),
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return { ...c, messages: [...c.messages, aiMessage] };
      }
      return c;
    }));

    try {
      const chat = chats.find(c => c.id === chatId) || { messages: [], model: modelId || settings.defaultModel };
      const messagesToSent = [...chat.messages, userMessage];
      const model = MODELS.find(m => m.id === (modelId || settings.defaultModel));

      if (!model) throw new Error("Model not found");

      if (model.id === 'gemini-3.1-flash-image-preview') {
        const imageUrl = await generateImage(content, imageSize || '1K');
        setChats(prev => prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: imageUrl, type: 'image' } : m)
            };
          }
          return c;
        }));
      } else if (model.id === 'gemini-2.5-flash-preview-tts') {
        const audioUrl = await generateSpeech(content);
        setChats(prev => prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: audioUrl, type: 'audio' } : m)
            };
          }
          return c;
        }));
      } else if (model.provider === 'openrouter') {
        if (!settings.openRouterApiKey) throw new Error("OpenRouter API Key is missing. Please set it in Settings.");
        const stream = streamOpenRouter(messagesToSent, settings, model.id);
        for await (const chunk of stream) {
          setChats(prev => prev.map(c => {
            if (c.id === chatId) {
              return {
                ...c,
                messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: m.content + chunk } : m)
              };
            }
            return c;
          }));
        }
      } else {
        const stream = streamGemini(messagesToSent, settings, model.id);
        for await (const chunk of stream) {
          setChats(prev => prev.map(c => {
            if (c.id === chatId) {
              return {
                ...c,
                messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: m.content + chunk } : m)
              };
            }
            return c;
          }));
        }
      }
    } catch (error: any) {
      console.error(error);
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === aiMessageId ? { ...m, content: error.message, type: 'error' } : m)
          };
        }
        return c;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#135bec]/30 border-t-[#135bec] rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading ClutchByte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {!user ? (
        <div className="flex-1">
          {activeView === 'login' && (
            <Login 
              onRegister={() => setActiveView('register')}
              onForgotPassword={() => setActiveView('reset-password')}
              onLogin={handleLogin}
            />
          )}
          {activeView === 'register' && (
            <Registration 
              onLogin={() => setActiveView('login')}
              onSuccess={() => setActiveView('login')}
            />
          )}
          {activeView === 'reset-password' && (
            <ResetPassword 
              onBackToLogin={() => setActiveView('login')}
              onSendLink={(email) => {
                setResetEmail(email);
                setActiveView('set-new-password');
              }}
            />
          )}
          {activeView === 'set-new-password' && (
            <SetNewPassword 
              email={resetEmail}
              onLogin={() => setActiveView('login')}
              onSuccess={() => setActiveView('login')}
            />
          )}
        </div>
      ) : (
        <>
          <Sidebar 
            chats={chats} 
            currentChatId={currentChatId} 
            onSelectChat={(id) => { 
              setCurrentChatId(id); 
              setActiveView('chats');
              setIsSidebarOpen(false); 
            }}
            onNewChat={() => {
              handleNewChat();
              setActiveView('chats');
            }}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onOpenSettings={() => setActiveView('settings')}
            onOpenAdmin={() => setActiveView('admin')}
            onOpenModels={() => setActiveView('models')}
            onOpenApiKeys={() => setActiveView('api-keys')}
            onLogout={handleLogout}
            activeView={activeView}
          />
          
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            {activeView === 'chats' && (
              <ChatArea 
                chat={currentChat} 
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                onOpenSidebar={() => setIsSidebarOpen(true)}
                onOpenLiveAudio={() => setIsLiveAudioOpen(true)}
                onChangeModel={(modelId) => {
                  if (currentChatId) {
                    setChats(chats.map(c => c.id === currentChatId ? { ...c, model: modelId } : c));
                  } else {
                    setSettings({ ...settings, defaultModel: modelId });
                  }
                }}
                currentModel={currentChat?.model || settings.defaultModel}
              />
            )}

            {activeView === 'settings' && (
              <AccountSettings 
                settings={settings} 
                onSave={(s) => { setSettings(s); setActiveView('chats'); }} 
                onClose={() => setActiveView('chats')} 
              />
            )}

            {activeView === 'admin' && (
              <AdminDashboard 
                chats={chats} 
                settings={settings}
                onClearAll={() => {
                  handleClearAllChats();
                  setActiveView('chats');
                }}
                onClose={() => setActiveView('chats')} 
              />
            )}

            {activeView === 'models' && (
              <ModelsDirectory />
            )}

            {activeView === 'api-keys' && (
              <ApiKeys />
            )}
          </div>

          {isLiveAudioOpen && (
            <LiveAudioModal onClose={() => setIsLiveAudioOpen(false)} />
          )}

          {/* Undo Toast */}
          {showUndoToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 bg-[#1a2332] border border-[#232f48] p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 min-w-[320px]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-[20px]">delete</span>
                  <span className="text-sm font-medium text-white">
                    {lastDeletedAll ? 'All chat history deleted' : 'Chat deleted'}
                  </span>
                </div>
                <button 
                  onClick={() => setShowUndoToast(false)}
                  className="text-slate-500 hover:text-white transition-colors -mt-1 -mr-1 p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="flex justify-end border-t border-[#232f48] pt-3 mt-1">
                <button 
                  onClick={handleUndoDelete}
                  className="text-sm font-bold bg-[#135bec] hover:bg-[#1d6bf5] text-white px-5 py-2 rounded-lg transition-colors shadow-lg shadow-[#135bec]/20"
                >
                  Undo
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
