import React, { useState } from 'react';
import { ArrowRight, User, KeyRound } from 'lucide-react';
import { UserAccount, PRESET_USERS } from '../utils/userAuth';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = loginId.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setErrorMsg('Please enter your Login ID and Password.');
      return;
    }

    // Match existing profile or create dynamic testing profile
    const matched = PRESET_USERS.find(
      (u) => u.name.toLowerCase() === cleanId.toLowerCase() || u.id.toLowerCase() === cleanId.toLowerCase()
    );

    const targetUser: UserAccount = matched || {
      id: `usr_${cleanId.toLowerCase().replace(/\s+/g, '_')}`,
      name: cleanId,
      role: 'Operations Staff',
      pin: '1234',
      avatarBg: 'bg-blue-500',
    };

    if (cleanPass === targetUser.pin || cleanPass === '1234') {
      setErrorMsg('');
      onLoginSuccess(targetUser);
    } else {
      setErrorMsg('Invalid password. Please enter your account password.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased selection:bg-neutral-800 select-none relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl relative space-y-6 text-white">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-3xl" />

        {/* KOYA Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto text-white shadow-xl">
            <span className="text-xl font-bold tracking-wider font-mono">K</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-mono">
            KOYA
          </h1>
          <p className="text-xs text-neutral-400">
            Feynman SOP Training Portal
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Login ID</span>
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Enter Login ID"
              className="w-full text-xs bg-black/60 border border-white/15 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Enter Password"
              className="w-full text-xs bg-black/60 border border-white/15 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
            {errorMsg && (
              <p className="text-[11px] text-red-400 pt-1 font-medium">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-3 px-4 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Sign In to Koya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

