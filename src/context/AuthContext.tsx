import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  fbSignOut,
  onAuthStateChanged,
  isFirebaseConfigured,
  type FirebaseUser,
} from '../services/firebase';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'client';
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isFirebaseLive: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsAdminDemo: () => void;
  signInAsClientDemo: (email?: string, name?: string) => void;
  switchRole: (newRole: 'admin' | 'client') => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_STORAGE_KEY = 'web_builder_auth_user_v1';

function determineRole(email: string | null): 'admin' | 'client' {
  if (!email) return 'client';
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'admin@agency.com,founder@agency.com,lead@agency.com')
    .toLowerCase()
    .split(',')
    .map((e: string) => e.trim());

  if (adminEmails.includes(email.toLowerCase()) || email.toLowerCase().startsWith('admin@')) {
    return 'admin';
  }
  return 'client';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state to localStorage for simulated mode
  const persistUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser && fbUser.email) {
          const role = determineRole(fbUser.email);
          const mapped: AuthUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
            photoURL: fbUser.photoURL || undefined,
            role,
          };
          persistUser(mapped);
        } else {
          // If no live firebase user logged in
          if (isFirebaseConfigured) {
            persistUser(null);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // In simulated mode, check localStorage
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const role = determineRole(fbUser.email);
        const mapped: AuthUser = {
          uid: fbUser.uid,
          email: fbUser.email || 'client@example.com',
          displayName: fbUser.displayName || 'Google User',
          photoURL: fbUser.photoURL || undefined,
          role,
        };
        persistUser(mapped);
      } catch (err) {
        console.error('[AuthContext] Google Sign In Error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      // Simulated Google OAuth Flow
      await new Promise((r) => setTimeout(r, 600));
      const simulatedUser: AuthUser = {
        uid: `google-${Date.now()}`,
        email: 'founder@hypervelocity.io',
        displayName: 'Sarah Chen',
        photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        role: 'client',
      };
      persistUser(simulatedUser);
      setLoading(false);
    }
  };

  const signInAsAdminDemo = () => {
    const adminUser: AuthUser = {
      uid: 'agency-admin-01',
      email: 'admin@agency.com',
      displayName: 'Agency Admin (Principal)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'admin',
    };
    persistUser(adminUser);
  };

  const signInAsClientDemo = (email?: string, name?: string) => {
    const clientUser: AuthUser = {
      uid: `client-${Date.now().toString().slice(-4)}`,
      email: email || 'elena@vortexcloud.io',
      displayName: name || 'Elena Rostova',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'client',
    };
    persistUser(clientUser);
  };

  const switchRole = (newRole: 'admin' | 'client') => {
    if (!user) return;
    const updated: AuthUser = {
      ...user,
      role: newRole,
      email: newRole === 'admin' ? 'admin@agency.com' : user.email,
    };
    persistUser(updated);
  };

  const signOut = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    persistUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isAuthenticated,
        isFirebaseLive: isFirebaseConfigured,
        signInWithGoogle,
        signInAsAdminDemo,
        signInAsClientDemo,
        switchRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
