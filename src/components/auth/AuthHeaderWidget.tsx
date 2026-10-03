import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  Shield,
  User,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';

export const AuthHeaderWidget: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    signInWithGoogle,
    signInAsAdminDemo,
    signInAsClientDemo,
    switchRole,
    signOut,
  } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      {isAuthenticated && user ? (
        <div className="flex items-center gap-2">
          {/* User Profile Capsule */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors shadow-sm"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium max-w-[120px] truncate">{user.displayName}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {user.role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 text-xs space-y-1 animate-fade-in">
                <div className="p-2 border-b border-slate-800/80">
                  <div className="font-semibold text-slate-200">{user.displayName}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Role: {isAdmin ? 'Full Agency Administrator' : 'Client Account'}</span>
                  </div>
                </div>

                {/* Role Switcher for Testing & Demonstration */}
                <div className="p-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Test Role Switcher
                </div>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    isAdmin ? 'bg-indigo-950/60 text-indigo-300 font-semibold' : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Agency Admin (See All)</span>
                  </div>
                  {isAdmin && <span className="text-[10px] text-indigo-400">Active</span>}
                </button>
                <button
                  onClick={() => {
                    switchRole('client');
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    !isAdmin ? 'bg-indigo-950/60 text-indigo-300 font-semibold' : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Client (My Subpages Only)</span>
                  </div>
                  {!isAdmin && <span className="text-[10px] text-indigo-400">Active</span>}
                </button>

                <div className="pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      signOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Sign In with Google Button */}
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Sign in with your Google account"
          >
            {/* Google G Logo SVG */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Sign In</span>
          </button>

          {/* Quick Demo Login Switchers */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => signInAsAdminDemo()}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
              title="Instant Admin test sign in"
            >
              Demo Admin
            </button>
            <button
              onClick={() => signInAsClientDemo()}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-800 transition-colors"
              title="Instant Client test sign in"
            >
              Demo Client
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
