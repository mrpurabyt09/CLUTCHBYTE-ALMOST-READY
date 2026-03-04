import { UserData } from '../types';

const USERS_KEY = 'clutchbyte_users_db';

export const authService = {
  getUsers: (): UserData[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (userData: UserData) => {
    const users = authService.getUsers();
    const existingIndex = users.findIndex(u => u.email === userData.email);
    if (existingIndex > -1) {
      users[existingIndex] = userData;
    } else {
      users.push(userData);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findUserByEmail: (email: string): UserData | undefined => {
    return authService.getUsers().find(u => u.email === email);
  },

  register: (userData: UserData): { success: boolean; message: string } => {
    const existing = authService.findUserByEmail(userData.email);
    if (existing) {
      return { success: false, message: 'User already exists with this email.' };
    }
    authService.saveUser(userData);
    return { success: true, message: 'Account created successfully!' };
  },

  login: (email: string, password: string): { success: boolean; message: string; user?: UserData } => {
    const user = authService.findUserByEmail(email);
    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid email or password.' };
    }
    return { success: true, message: 'Login successful!', user };
  },

  updatePassword: (email: string, newPassword: string): { success: boolean; message: string } => {
    const user = authService.findUserByEmail(email);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }
    user.password = newPassword;
    authService.saveUser(user);
    return { success: true, message: 'Password updated successfully!' };
  }
};
