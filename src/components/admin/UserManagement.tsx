import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, UserPlus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: '1', name: 'Alex Morgan', email: 'alex@clutchbyte.com', role: 'Super Admin', status: 'Active', lastSeen: 'Just now', initials: 'AM' },
    { id: '2', name: 'Sarah Chen', email: 'sarah.c@example.com', role: 'Developer', status: 'Active', lastSeen: '12m ago', initials: 'SC' },
    { id: '3', name: 'James Wilson', email: 'j.wilson@example.com', role: 'User', status: 'Inactive', lastSeen: '2d ago', initials: 'JW' },
    { id: '4', name: 'Elena Rodriguez', email: 'elena.r@example.com', role: 'User', status: 'Active', lastSeen: '1h ago', initials: 'ER' },
    { id: '5', name: 'Marcus Thorne', email: 'marcus@example.com', role: 'Moderator', status: 'Active', lastSeen: '5m ago', initials: 'MT' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-8"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">1,284 Total Users</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3649] outline-none text-sm w-64 focus:ring-2 focus:ring-[#135bec]/50 transition-all text-slate-900 dark:text-white"
              />
            </div>
            <button className="px-6 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3649] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-[#2a3649]">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Last Seen</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649] text-slate-900 dark:text-slate-100">
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                          {user.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{user.lastSeen}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Showing 1-5 of 1,284 users</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-slate-200 dark:border-[#2a3649] text-slate-400 hover:bg-white/5 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-lg border border-slate-200 dark:border-[#2a3649] text-slate-400 hover:bg-white/5 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
