import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, Filter, CheckCircle, XCircle, Clock, MoreHorizontal, AlertCircle, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface Ticket {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: any;
  updatedAt?: any;
}

interface Message {
  id: string;
  senderId: string;
  message: string;
  createdAt: any;
  role: 'user' | 'admin';
}

export function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'support_requests'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(ticketData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedTicket) return;

    const q = query(
      collection(db, 'support_requests', selectedTicket.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [selectedTicket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTicket || !newMessage.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'support_requests', selectedTicket.id, 'messages'), {
        senderId: user.uid,
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
        role: 'admin'
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: 'open' | 'in-progress' | 'closed') => {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'support_requests', ticketId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'in-progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'closed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f8] dark:bg-[#101622]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-[#2a3649] bg-white dark:bg-[#1a2332] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and respond to user support requests</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#2a3649] text-sm focus:ring-2 focus:ring-[#135bec] outline-none w-64"
            />
          </div>
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3649] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#232f48]">
              <Filter size={16} />
              <span>{statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
              <ChevronDown size={14} />
            </button>
            
            <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#1a2332] rounded-lg shadow-lg border border-slate-200 dark:border-[#2a3649] py-1 hidden group-hover:block z-10">
              {['all', 'open', 'in-progress', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-[#232f48] ${statusFilter === status ? 'text-[#135bec] font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Ticket List */}
        <div className={`flex-1 overflow-y-auto p-6 ${selectedTicket ? 'hidden lg:block lg:w-1/2 lg:flex-none border-r border-slate-200 dark:border-[#2a3649]' : 'w-full'}`}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#135bec]"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-[#232f48] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No tickets found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`bg-white dark:bg-[#1a2332] p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedTicket?.id === ticket.id ? 'border-[#135bec] ring-1 ring-[#135bec]' : 'border-slate-200 dark:border-[#2a3649] hover:border-[#135bec]/50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{ticket.id.slice(0, 6)}</span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{ticket.subject}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{ticket.message}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#232f48] flex items-center justify-center text-[10px] font-bold">
                      {ticket.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{ticket.name}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{ticket.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Detail View */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex-1 bg-white dark:bg-[#1a2332] flex flex-col h-full absolute inset-0 lg:static z-20`}
            >
              {/* Detail Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-[#2a3649] flex items-center justify-between bg-white dark:bg-[#1a2332]">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-[#232f48] rounded-full text-slate-500"
                  >
                    <ChevronDown className="rotate-90" size={20} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-lg text-slate-900 dark:text-white">Ticket Details</h2>
                      <span className="text-xs text-slate-400 font-mono">#{selectedTicket.id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <button 
                      disabled={isUpdating}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${getStatusColor(selectedTicket.status)}`}
                    >
                      {selectedTicket.status}
                      <ChevronDown size={14} />
                    </button>
                    
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#1a2332] rounded-lg shadow-lg border border-slate-200 dark:border-[#2a3649] py-1 hidden group-hover:block z-10">
                      <button onClick={() => handleStatusUpdate(selectedTicket.id, 'open')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-[#232f48] text-blue-500">Open</button>
                      <button onClick={() => handleStatusUpdate(selectedTicket.id, 'in-progress')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-[#232f48] text-amber-500">In Progress</button>
                      <button onClick={() => handleStatusUpdate(selectedTicket.id, 'closed')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-[#232f48] text-emerald-500">Closed</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#111722] space-y-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Subject & Meta */}
                  <div className="bg-white dark:bg-[#1a2332] p-6 rounded-xl border border-slate-200 dark:border-[#2a3649]">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{selectedTicket.subject}</h1>
                    <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400 pb-6 border-b border-slate-200 dark:border-[#2a3649]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center font-bold">
                          {selectedTicket.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium">{selectedTicket.name}</p>
                          <p className="text-xs">{selectedTicket.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Clock size={16} />
                        <span>Submitted on {formatDate(selectedTicket.createdAt)}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {selectedTicket.message}
                      </p>
                    </div>
                  </div>

                  {/* Conversation Thread */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white px-2">Conversation</h3>
                    
                    {messages.length === 0 ? (
                      <div className="text-center p-8 bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] text-slate-500 dark:text-slate-400">
                        No messages yet. Start the conversation below.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-2xl p-4 max-w-[80%] shadow-sm ${
                              msg.role === 'admin' 
                                ? 'bg-[#135bec] text-white rounded-tr-none' 
                                : 'bg-white dark:bg-[#1a2332] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2a3649] rounded-tl-none'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <p className={`text-[10px] mt-2 text-right ${msg.role === 'admin' ? 'text-blue-200' : 'text-slate-400'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white dark:bg-[#1a2332] border-t border-slate-200 dark:border-[#2a3649]">
                {selectedTicket.status === 'closed' ? (
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#111722] rounded-xl border border-slate-200 dark:border-[#2a3649]">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">This ticket is closed. Re-open it to send messages.</span>
                    <button 
                      onClick={() => handleStatusUpdate(selectedTicket.id, 'open')}
                      className="text-[#135bec] text-sm font-bold hover:underline"
                    >
                      Re-open Ticket
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex gap-2 max-w-3xl mx-auto w-full">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#2a3649] outline-none focus:ring-2 focus:ring-[#135bec] text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !newMessage.trim()}
                      className="p-2 bg-[#135bec] text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
