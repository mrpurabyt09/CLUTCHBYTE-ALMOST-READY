import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: any;
  status: 'Active' | 'Inactive';
}

export const ApiKeys: React.FC = () => {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/api_keys`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const keysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApiKey[];
      setKeys(keysData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sk_live_';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateKey = async () => {
    if (!user || !newKeyName.trim()) return;

    try {
      const newKey = generateKey();
      await addDoc(collection(db, `users/${user.uid}/api_keys`), {
        name: newKeyName,
        key: newKey,
        createdAt: serverTimestamp(),
        status: 'Active'
      });
      setNewKeyName('');
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating API key:", error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/api_keys`, id));
      } catch (error) {
        console.error("Error deleting API key:", error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-[#101622] p-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">API Keys</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your access tokens and security credentials for external integrations.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#135bec] text-white rounded-xl font-bold hover:bg-[#1d6bf5] transition-all shadow-lg shadow-[#135bec]/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create New Key</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#232f48] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-[#232f48] flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your API Keys</h3>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                <span className="text-xs text-slate-500">Keys are encrypted and stored securely.</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">API Key</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#232f48]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading keys...</td>
                    </tr>
                  ) : keys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No API keys found. Create one to get started.</td>
                    </tr>
                  ) : (
                    keys.map((key) => (
                      <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{key.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-300 font-mono">
                              {key.key.substring(0, 12)}••••••••••••••••••••••••
                            </code>
                            <button 
                              onClick={() => navigator.clipboard.writeText(key.key)}
                              className="p-1 text-slate-400 hover:text-[#135bec] transition-colors"
                              title="Copy Key"
                            >
                              <span className="material-symbols-outlined text-[16px]">content_copy</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {key.createdAt?.seconds ? new Date(key.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${key.status === 'Active' ? 'bg-[#0bda5e]/10 text-[#0bda5e]' : 'bg-slate-500/10 text-slate-500'}`}>
                            <span className={`h-1 w-1 rounded-full ${key.status === 'Active' ? 'bg-[#0bda5e]' : 'bg-slate-500'}`}></span>
                            {key.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDeleteKey(key.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete Key"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#192233] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-[#232f48]"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Create New API Key</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Key Name</label>
                  <input 
                    type="text" 
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Production App"
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#101622] border border-slate-200 dark:border-[#232f48] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim()}
                    className="px-6 py-2 bg-[#135bec] text-white rounded-lg font-bold hover:bg-[#1d6bf5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Key
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
