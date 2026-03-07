import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  role: 'user' | 'admin' | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore, if not create them
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const newUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || 'Anonymous',
            createdAt: serverTimestamp(),
            role: firebaseUser.email === 'purabyt09@gmail.com' ? 'admin' : 'user',
            photoURL: firebaseUser.photoURL || null,
            status: 'active'
          };
          await setDoc(userRef, newUser);
          setRole(newUser.role as any);
        } else {
          const userData = userSnap.data();
          // Enforce admin role for specific email if not already set
          if (firebaseUser.email === 'purabyt09@gmail.com' && userData?.role !== 'admin') {
            await setDoc(userRef, { role: 'admin' }, { merge: true });
            setRole('admin');
          } else {
            setRole(userData?.role || 'user');
          }
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, signInWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
