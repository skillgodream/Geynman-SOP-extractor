import React, { useState } from 'react';
import { X, User, Check, ShieldCheck, Lock, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { UserAccount, PRESET_USERS } from '../utils/userAuth';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleUserClick = (user: UserAccount) => {
    if (user.id === currentUser.id) {
      onClose();
      return;
    }
    setSelectedUser(user);
    setPinInput('');
    setPinError(false);
  };

  const handleVerifyPinAndSwitch = (userToSwitch: UserAccount) => {
    if (pinInput.trim() === userToSwitch.pin) {
      onSelectUser(userToSwitch);
      setSelectedUser(null);
      setPinInput('');
      onClose();
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-white space-y-5 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent rounded-t-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Switch Test Account
              </h2>
              <p className="text-xs text-neutral-400">
                SOPs & training data are isolated per account
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Account PIN Verification Prompt */}
        {selectedUser ? (
          <div className="space-y-4 py-2 animate-in zoom-in-95 duration-200">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${selectedUser.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {selectedUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">{selectedUser.name}</div>
                <div className="text-xs text-neutral-400">{selectedUser.role}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span>Enter PIN for {selectedUser.name} <span className="text-neutral-500 font-normal">(Default PIN: {selectedUser.pin})</span></span>
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerifyPinAndSwitch(selectedUser);
                }}
                autoFocus
                placeholder="1234"
                maxLength={4}
                className={`w-full text-center tracking-[0.5em] text-base bg-black/60 border ${
                  pinError ? 'border-red-500 text-red-300' : 'border-white/15 focus:border-blue-500'
                } rounded-xl px-4 py-3 text-white focus:outline-none transition-colors`}
              />
              {pinError && (
                <div className="text-xs text-red-400 font-medium text-center">
                  Incorrect PIN. Please enter 1234.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => handleVerifyPinAndSwitch(selectedUser)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Login as {selectedUser.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* User Selection List */
          <div className="space-y-3">
            <div className="text-xs font-medium text-neutral-400">
              Select one of the 4 test accounts to view its persistent SOP library:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_USERS.map((user) => {
                const isActive = user.id === currentUser.id;

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleUserClick(user)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-500/15 border-blue-500/50 text-white'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${user.avatarBg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-neutral-400 truncate">{user.role}</div>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold shrink-0 flex items-center gap-1">
                        <Check className="w-3 h-3 text-blue-400" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                        PIN: {user.pin}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Persistent Storage Notice */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-neutral-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Automatic Refresh Storage Active:</span> All extracted SOPs and created decks are saved permanently to your logged-in profile in browser storage and persist seamlessly across refreshes.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
