import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, UserPlus, MoreVertical, ChevronLeft, ChevronRight, Trash2, Shield, Mail, Calendar } from 'lucide-react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';

interface UserData {
  id: string;
  uid: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  createdAt: any;
  status?: 'active' | 'suspended';
  photoURL?: string;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (confirm(`Change role to ${newRole}?`)) {
      try {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role.");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

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
            <p className="text-sm text-slate-500 dark:text-slate-400">{users.length} Total Users</p>
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
            {/* <button className="px-6 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
              <UserPlus size={18} />
              Add User
            </button> */}
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#2a3649] text-slate-900 dark:text-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex justify-center mb-2">
                        <div className="w-6 h-6 border-2 border-[#135bec] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                   <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 overflow-hidden">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              (user.fullName || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName || 'Anonymous'}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Mail size={12} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {user.role === 'admin' && <Shield size={10} className="mr-1" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.status === 'suspended' 
                            ? 'bg-red-500/10 text-red-500' 
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleRole(user.id, user.role)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-[#135bec]"
                            title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                          >
                            <Shield size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-slate-400 hover:text-red-500"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
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
    </motion.div>
  );
}
