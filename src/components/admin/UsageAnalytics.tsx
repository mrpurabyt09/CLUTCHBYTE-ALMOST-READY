import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyMetric {
  date: string;
  totalTokens: number;
  requestCount: number;
  cost: number;
  models: Record<string, number>;
}

interface UserUsage {
  uid: string;
  email: string;
  fullName: string;
  photoURL?: string;
  usage?: {
    totalTokens: number;
    requestCount: number;
  };
  role: string;
}

export function UsageAnalytics() {
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [users, setUsers] = useState<UserUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Daily Metrics (Real-time)
    // Note: 'date' field is redundant if document ID is date, but useful for sorting if indexed
    // We use document ID as date, so we can just order by document ID (which is __name__)
    // But for simplicity, let's assume we query collection and sort client side if needed, or rely on natural order
    // Actually, let's just query all and sort.
    const metricsQuery = query(collection(db, 'system_metrics'));
    const unsubscribeMetrics = onSnapshot(metricsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ date: doc.id, ...doc.data() } as DailyMetric));
      // Sort by date ascending
      data.sort((a, b) => a.date.localeCompare(b.date));
      setMetrics(data.slice(-30)); // Keep last 30 days
    });

    // Fetch Users (Real-time)
    // We fetch users to show leaderboard.
    const usersQuery = query(collection(db, 'users'), limit(50));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserUsage));
      // Sort by usage desc
      data.sort((a, b) => (b.usage?.totalTokens || 0) - (a.usage?.totalTokens || 0));
      setUsers(data);
      setLoading(false);
    });

    return () => {
      unsubscribeMetrics();
      unsubscribeUsers();
    };
  }, []);

  const totalTokens = metrics.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
  const totalRequests = metrics.reduce((acc, curr) => acc + (curr.requestCount || 0), 0);
  const totalCost = metrics.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#135bec]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Live Usage Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">Real-time monitoring of token consumption and costs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#324467] text-sm text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>Last 30 Days</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-[#135bec]">
              <span className="material-symbols-outlined">token</span>
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">Total Tokens</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalTokens.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Across all models</p>
        </div>
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <span className="material-symbols-outlined">api</span>
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">Requests</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalRequests.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Total interactions</p>
        </div>
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 border border-slate-200 dark:border-[#324467] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium">Estimated Cost</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${totalCost.toFixed(4)}</p>
          <p className="text-xs text-slate-400 mt-2">Based on usage</p>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Daily Token Usage</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="totalTokens" stroke="#135bec" fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#324467] shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Top Users</h3>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.uid} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-100 dark:border-[#232f48]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center flex items-center justify-center overflow-hidden" style={user.photoURL ? {backgroundImage: `url('${user.photoURL}')`} : {}}>
                    {!user.photoURL && <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">{user.fullName || 'Unknown User'}</span>
                    <span className="text-[10px] text-slate-400">{user.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{(user.usage?.totalTokens || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">tokens</p>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No active users yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
