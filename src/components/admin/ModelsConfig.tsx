import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, Plus, Trash2, Edit, MoreHorizontal, CheckCircle, AlertTriangle } from 'lucide-react';

export function ModelsConfig() {
  const [models, setModels] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'models'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setModels(data);
    });
    return () => unsubscribe();
  }, []);

  const addSimulatedModel = async () => {
    const providers = ['OpenAI', 'Anthropic', 'Google', 'Mistral'];
    const statuses = ['Active', 'Deprecated', 'Beta'];
    const randomProvider = providers[Math.floor(Math.random() * providers.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    try {
      await addDoc(collection(db, 'models'), {
        name: `${randomProvider} Model ${Math.floor(Math.random() * 100)}`,
        provider: randomProvider,
        status: randomStatus,
        usage: `${Math.floor(Math.random() * 1000)}k tokens`,
        latency: `${Math.floor(Math.random() * 500)}ms`,
        created: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding model:", error);
    }
  };

  const deleteModel = async (id: string) => {
      try {
          await deleteDoc(doc(db, 'models', id));
      } catch (error) {
          console.error("Error deleting model:", error);
      }
  }

  const filteredModels = models.filter(model => 
    model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Models</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{models.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Providers</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {new Set(models.map(m => m.provider)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-5 border border-slate-200 dark:border-[#2a3649] shadow-sm">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Average Latency</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {models.length > 0 ? Math.round(models.reduce((acc, m) => acc + (parseInt(m.latency) || 0), 0) / models.length) : 0}ms
          </p>
        </div>
      </div>

      {/* Models Table */}
      <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-[#2a3649] flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Models</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search models..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm rounded-lg border-none focus:ring-1 focus:ring-[#135bec] py-2 pl-10 pr-3 w-64"
              />
            </div>
            <button 
              onClick={addSimulatedModel}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#135bec] hover:bg-[#135bec]/90 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              <span>New Model</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Model Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Latency</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649]">
              {filteredModels.map((model) => (
                <tr key={model.id} className="hover:bg-slate-50 dark:hover:bg-[#232f48]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{model.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{model.provider}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      model.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      model.status === 'Beta' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {model.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                      {model.status === 'Deprecated' && <AlertTriangle size={12} className="mr-1" />}
                      {model.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{model.usage}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{model.latency}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteModel(model.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredModels.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No models found. Click "New Model" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
