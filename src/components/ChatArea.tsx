import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message } from '../types';
import { useModels } from '../context/ModelContext';
import { Menu, Send, Image as ImageIcon, Mic, ChevronDown, Share, History, Copy, RefreshCw, ThumbsUp, Paperclip, Wand2, ArrowUp, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (content: string, type?: 'text' | 'image', imageSize?: string) => void;
  isGenerating: boolean;
  onOpenSidebar: () => void;
  onOpenLiveAudio: () => void;
  onChangeModel: (modelId: string) => void;
  onOpenSettings?: () => void;
  currentModel: string;
  user: any;
}

export function ChatArea({ chat, onSendMessage, isGenerating, onOpenSidebar, onOpenLiveAudio, onChangeModel, onOpenSettings, currentModel, user }: ChatAreaProps) {
  const { models } = useModels();
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState('1K');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isImageGen = currentModel === 'gemini-3.1-flash-image-preview';
  const isVision = currentModel === 'gemini-3.1-pro-preview-vision';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages, isGenerating]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    
    if (selectedImage && isVision) {
      onSendMessage(selectedImage, 'image');
      if (input.trim()) {
        setTimeout(() => onSendMessage(input, 'text'), 100);
      }
      setSelectedImage(null);
    } else {
      onSendMessage(input, 'text', isImageGen ? imageSize : undefined);
    }
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentModelObj = models.find(m => m.id === currentModel) || models[0];

  return (
    <div className="flex flex-col h-full w-full bg-background-dark relative">
      {/* Recent History Bar (Top) */}
      <div className="h-12 border-b border-border-dark flex items-center px-4 bg-background-dark/50 backdrop-blur-sm overflow-x-auto no-scrollbar gap-2 z-10">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-text-secondary whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-[14px]">chat</span>
          <span>Project Proposal</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-transparent border border-transparent text-[11px] text-text-secondary whitespace-nowrap cursor-pointer hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[14px]">chat</span>
          <span>Code Review</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-transparent border border-transparent text-[11px] text-text-secondary whitespace-nowrap cursor-pointer hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[14px]">chat</span>
          <span>Market Research</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-transparent border border-transparent text-[11px] text-text-secondary whitespace-nowrap cursor-pointer hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[14px]">chat</span>
          <span>Travel Plans</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-48">
          {chat?.messages.length === 0 || !chat ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-6 opacity-60">
              <div className="size-16 rounded-full bg-surface-dark flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[32px]">bolt</span>
              </div>
              <h2 className="text-2xl font-bold text-white">How can I help you today?</h2>
            </div>
          ) : (
            chat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onChangeModel={onChangeModel} onOpenSettings={onOpenSettings} user={user} />
            ))
          )}
          {isGenerating && (
            <div className="flex gap-4 items-start group">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary shrink-0 mt-1 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[18px] text-white">smart_toy</span>
              </div>
              <div className="flex flex-col items-start gap-1 w-full max-w-[90%] md:max-w-[85%]">
                <div className="flex items-center gap-2 ml-1">
                  <span className="text-xs text-text-secondary font-bold">ClutchByte</span>
                </div>
                <div className="text-slate-200 leading-relaxed w-full">
                  <div className="flex gap-1 items-center h-6">
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area (Fixed Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-10">
        <div className="max-w-3xl mx-auto">
          {/* Controls Bar (Moved from Top) */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <button className="md:hidden p-2 text-text-secondary hover:text-white mr-2" onClick={onOpenSidebar}>
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="relative group">
                <select 
                  value={currentModel}
                  onChange={(e) => onChangeModel(e.target.value)}
                  className="appearance-none bg-surface-dark text-sm font-medium text-white hover:bg-surface-darker px-3 py-1.5 rounded-lg transition-colors outline-none cursor-pointer pr-8 border border-border-dark"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id} className="text-base bg-surface-dark text-white">
                      {m.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-text-secondary text-[18px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onOpenLiveAudio} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-xs font-medium transition-colors">
                <span className="material-symbols-outlined text-[16px]">mic</span>
                <span className="hidden sm:inline">Live Audio</span>
              </button>
              <button className="text-text-secondary hover:text-white transition-colors" title="History">
                <span className="material-symbols-outlined text-[18px]">history</span>
              </button>
            </div>
          </div>
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img src={selectedImage} alt="Selected" className="h-20 rounded-lg border border-border-dark" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-surface-darker text-white rounded-full p-1 text-xs border border-border-dark"
              >
                ✕
              </button>
            </div>
          )}
          
          {isImageGen && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm text-text-secondary">Image Size:</span>
              <select 
                value={imageSize} 
                onChange={e => setImageSize(e.target.value)}
                className="text-sm bg-surface-dark text-white border border-border-dark rounded px-2 py-1 outline-none"
              >
                <option value="512px">512px</option>
                <option value="1K">1K</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
              </select>
            </div>
          )}

          <div className="relative flex flex-col w-full bg-surface-dark border border-border-dark rounded-xl shadow-2xl focus-within:ring-1 focus-within:ring-border-dark/80 focus-within:border-primary/50 transition-all">
            {isVision && (
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              className="w-full bg-transparent text-white border-0 focus:ring-0 p-4 pr-12 resize-none max-h-[200px] placeholder:text-text-secondary outline-none"
              placeholder={isImageGen ? "Describe the image to generate..." : "Message ClutchByte..."}
              rows={1}
              style={{ minHeight: '56px' }}
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => isVision && fileInputRef.current?.click()}
                  className={clsx("p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors tooltip", !isVision && "opacity-50 cursor-not-allowed")} 
                  title="Attach files"
                  disabled={!isVision}
                >
                  <span className="material-symbols-outlined text-[20px]">attach_file</span>
                </button>
                <button onClick={onOpenLiveAudio} className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Voice input">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
                <button className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors hidden sm:block" title="Enhance prompt">
                  <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                </button>
              </div>
              <button 
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isGenerating}
                className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              </button>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-[11px] text-text-secondary">ClutchByte can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onChangeModel, onOpenSettings, user }: { message: Message, onChangeModel?: (modelId: string) => void, onOpenSettings?: () => void, user: any }) {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex gap-4 items-start flex-row-reverse group">
        <div 
          className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 mt-1 flex items-center justify-center overflow-hidden bg-slate-700" 
          style={user?.photoURL ? { backgroundImage: `url('${user.photoURL}')` } : {}}
        >
          {!user?.photoURL && <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>}
        </div>
        <div className="flex flex-col items-end gap-1 max-w-[85%] md:max-w-[75%]">
          <div className="text-xs text-text-secondary font-medium mr-1">{user?.displayName || 'You'}</div>
          <div className="bg-surface-dark text-slate-100 px-5 py-3.5 rounded-2xl rounded-tr-sm">
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  const isApiKeyError = message.content.toLowerCase().includes('api key');
  const isRateLimitError = message.content.toLowerCase().includes('rate limit') || message.content.toLowerCase().includes('quota');

  return (
    <div className="flex gap-4 items-start group">
      <div className="flex items-center justify-center size-8 rounded-full bg-primary shrink-0 mt-1 shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-[18px] text-white">smart_toy</span>
      </div>
      <div className="flex flex-col items-start gap-1 w-full max-w-[90%] md:max-w-[85%]">
        <div className="flex items-center gap-2 ml-1">
          <span className="text-xs text-text-secondary font-bold">ClutchByte</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-dark border border-border-dark text-text-secondary uppercase tracking-wider">AI Model</span>
        </div>
        <div className="text-slate-200 leading-relaxed space-y-4 w-full">
          {message.type === 'image' && message.content.startsWith('data:image') ? (
            <img src={message.content} alt="Generated" className="rounded-lg max-w-full shadow-md border border-border-dark" />
          ) : message.type === 'audio' && message.content.startsWith('data:audio') ? (
            <audio controls src={message.content} className="w-full max-w-sm" />
          ) : message.type === 'error' ? (
            <div className="flex flex-col gap-3">
              <div className="text-red-400 flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined">error</span> 
                <span>Error Generating Response</span>
              </div>
              <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <p className="text-sm text-red-200 mb-4 font-medium">
                  {message.content}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {isApiKeyError && (
                    <button 
                      onClick={() => onOpenSettings?.()}
                      className="px-3 py-1.5 bg-red-500/20 text-red-100 text-xs rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px]">settings</span>
                      Check API Settings
                    </button>
                  )}
                  
                  <button 
                    onClick={() => onChangeModel?.('gemini-3.1-flash-lite-preview')}
                    className="px-3 py-1.5 bg-surface-dark text-white text-xs rounded-lg border border-border-dark hover:bg-surface-darker transition-colors shadow-sm"
                  >
                    Try Gemini Flash Lite
                  </button>
                  
                  {!isRateLimitError && (
                    <button 
                      onClick={() => onChangeModel?.('gemini-3.1-pro-preview')}
                      className="px-3 py-1.5 bg-surface-dark text-white text-xs rounded-lg border border-border-dark hover:bg-surface-darker transition-colors shadow-sm"
                    >
                      Try Gemini Pro
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ children }) => <>{children}</>,
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    
                    if (!inline && match) {
                      return (
                        <div className="rounded-lg overflow-hidden border border-border-dark bg-[#0d1117] my-4">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-border-dark">
                            <span className="text-xs font-mono text-text-secondary">{match[1]}</span>
                            <button 
                              onClick={() => navigator.clipboard.writeText(codeString)}
                              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors"
                            >
                              <span className="material-symbols-outlined text-[14px]">content_copy</span>
                              Copy code
                            </button>
                          </div>
                          <div className="p-4 overflow-x-auto font-mono text-sm">
                            <SyntaxHighlighter
                              style={vscDarkPlus as any}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <code className="bg-surface-dark px-1.5 py-0.5 rounded text-primary font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => navigator.clipboard.writeText(message.content)}
            className="p-1.5 rounded hover:bg-surface-dark text-text-secondary hover:text-white" 
            title="Copy"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
          </button>
          <button className="p-1.5 rounded hover:bg-surface-dark text-text-secondary hover:text-white" title="Regenerate">
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
          <button className="p-1.5 rounded hover:bg-surface-dark text-text-secondary hover:text-white" title="Good response">
            <span className="material-symbols-outlined text-[16px]">thumb_up</span>
          </button>
        </div>
      </div>
    </div>
  );
}
