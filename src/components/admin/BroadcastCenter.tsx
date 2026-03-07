import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, AlertTriangle, Eye, Clock, Trash2, Plus, X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { collection, addDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  audience: 'all' | 'admin' | 'user';
  createdAt: any;
  expiresAt?: any;
  views: number;
  isActive: boolean;
}

export function BroadcastCenter() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'error' | 'success',
    audience: 'all' as 'all' | 'admin' | 'user',
    expiresInDays: 7
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const broadcastsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Broadcast[];
      setBroadcasts(broadcastsData);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + newBroadcast.expiresInDays);

      await addDoc(collection(db, 'broadcasts'), {
        title: newBroadcast.title,
        message: newBroadcast.message,
        type: newBroadcast.type,
        audience: newBroadcast.audience,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
        views: 0,
        isActive: true
      });

      setIsModalOpen(false);
      setNewBroadcast({
        title: '',
        message: '',
        type: 'info',
        audience: 'all',
        expiresInDays: 7
      });
      // Optionally show success toast or message somewhere else, but modal closes so maybe not needed here.
    } catch (error) {
      console.error("Error creating broadcast:", error);
      setStatus({ type: 'error', message: "Failed to create broadcast. Check console for details." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    if (confirm('Are you sure you want to delete this broadcast?')) {
      try {
        await deleteDoc(doc(db, 'broadcasts', id));
      } catch (error) {
        console.error("Error deleting broadcast:", error);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={24} />;
      case 'error': return <AlertCircle size={24} />;
      case 'success': return <CheckCircle size={24} />;
      default: return <Info size={24} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-amber-500 bg-amber-500/10';
      case 'error': return 'text-rose-500 bg-rose-500/10';
      case 'success': return 'text-emerald-500 bg-emerald-500/10';
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Broadcast Center</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage system-wide announcements and notifications.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Megaphone size={18} />
            New Broadcast
          </button>
        </div>

        {/* Active Broadcasts */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Announcements</h3>
          {broadcasts.filter(b => b.isActive).length === 0 ? (
            <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] p-8 text-center text-slate-500 dark:text-slate-400">
              No active broadcasts.
            </div>
          ) : (
            broadcasts.filter(b => b.isActive).map(broadcast => (
              <div key={broadcast.id} className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
                <div className="p-6 flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getTypeColor(broadcast.type)}`}>
                    {getTypeIcon(broadcast.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{broadcast.title}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getTypeColor(broadcast.type)}`}>
                        {broadcast.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{broadcast.message}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Eye size={14} />
                        <span>{broadcast.views} views</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={14} />
                        <span>Posted {formatDate(broadcast.createdAt)}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteBroadcast(broadcast.id)}
                        className="ml-auto text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Past Broadcasts (Inactive or Expired) - For now just showing all in a table style if needed, or just keeping the active list */}
        {/* Simplified for this implementation to just show a list */}
      </div>

      {/* New Broadcast Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-[#2a3649]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-[#2a3649] flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Broadcast</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateBroadcast} className="p-6 space-y-4">
                {status && (
                  <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {status.message}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#2a3649] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] outline-none"
                    value={newBroadcast.title}
                    onChange={e => setNewBroadcast({...newBroadcast, title: e.target.value})}
                    placeholder="e.g., Scheduled Maintenance"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#2a3649] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] outline-none resize-none"
                    value={newBroadcast.message}
                    onChange={e => setNewBroadcast({...newBroadcast, message: e.target.value})}
                    placeholder="Enter announcement details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#2a3649] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] outline-none"
                      value={newBroadcast.type}
                      onChange={e => setNewBroadcast({...newBroadcast, type: e.target.value as any})}
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                      <option value="success">Success</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Audience</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-[#2a3649] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] outline-none"
                      value={newBroadcast.audience}
                      onChange={e => setNewBroadcast({...newBroadcast, audience: e.target.value as any})}
                    >
                      <option value="all">All Users</option>
                      <option value="user">Regular Users</option>
                      <option value="admin">Admins Only</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232f48] rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-[#135bec] hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isLoading ? 'Posting...' : 'Post Broadcast'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
