import React, { useState } from 'react';
import { UserProfile } from '../types';
import { loginWithGoogle, logoutUser } from '../firebase';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clapperboard, 
  LogOut,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      onLogin(user);
      setSuccessMsg(`Welcome, ${user.name}! Syncing your projects with Firebase...`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      // If user closed popup or provider issue
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else {
        setError(err?.message || 'Google sign-in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleQuickGuest = () => {
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      name: 'Guest Creator',
      email: 'guest@cineflow.local',
      isGuest: true,
      role: 'Creative Director',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    };
    onLogin(guestUser);
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131418] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
            <Clapperboard className="w-6 h-6 text-zinc-200" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            {currentUser && !currentUser.isGuest ? 'Your Account' : 'Welcome to CineFlow AI'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Minimalist studio for DTC video ads, AI thumbnails, and performance scripts.
          </p>
        </div>

        {currentUser && !currentUser.isGuest ? (
          // Logged In Profile View
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#1a1b20] border border-zinc-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-lg">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-xs text-zinc-400 truncate">{currentUser.email}</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Firebase Synced • {currentUser.role}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#1a1b20] border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Cloud Sync</span>
                <div className="text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Firestore Active</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1b20] border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Tier</span>
                <div className="text-zinc-200 font-medium mt-0.5">Unlimited Pro</div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Google Sign-in button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.09C3.26 21.3 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.41l4-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.28 6.59l4 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
                />
              </svg>
              <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#131418] px-2 text-zinc-500">or</span>
              </div>
            </div>

            {/* Quick Guest Access */}
            <button
              type="button"
              onClick={handleQuickGuest}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Explore as Guest</span>
            </button>

            <div className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1 pt-1">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>Secure cloud database powered by Google Cloud Firestore</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
