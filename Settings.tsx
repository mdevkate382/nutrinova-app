import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { storage } from '@/lib/storage';
import {
  User, Bell, Palette, Ruler, Shield, Lock, LogOut, Moon, Sun,
  Check, ChevronRight, Trash2, AlertCircle,
} from 'lucide-react';

type SettingsSection = 'account' | 'notifications' | 'appearance' | 'units' | 'privacy' | 'security';

export default function Settings() {
  const { user, settings, updateSettings, toggleTheme, logout } = useApp();
  const [section, setSection] = useState<SettingsSection>('account');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  const sections: { id: SettingsSection; label: string; icon: typeof User }[] = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'units', label: 'Units', icon: Ruler },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const notifOptions: { key: keyof typeof settings.notifications; label: string; desc: string }[] = [
    { key: 'waterReminders', label: 'Water Reminders', desc: 'Get reminded to drink water throughout the day' },
    { key: 'mealReminders', label: 'Meal Reminders', desc: 'Reminders for breakfast, lunch, snacks, and dinner' },
    { key: 'workoutReminders', label: 'Workout Reminders', desc: 'Daily reminders to complete your workout' },
    { key: 'goalReminders', label: 'Goal Reminders', desc: 'Updates on your progress toward health goals' },
    { key: 'progressUpdates', label: 'Progress Updates', desc: 'Weekly summary of your health progress' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Nav */}
        <div className="nn-card p-3 lg:col-span-1 h-fit">
          <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-thin">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${section === s.id ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Icon size={18} />
                  <span className="flex-1 text-left">{s.label}</span>
                  <ChevronRight size={16} className="hidden lg:block opacity-50" />
                </button>
              );
            })}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all whitespace-nowrap"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {section === 'account' && (
            <div className="nn-card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Account Information</h3>
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full nn-gradient flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{user.fullName}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Age', value: `${user.age} years` },
                  { label: 'Gender', value: user.gender.charAt(0).toUpperCase() + user.gender.slice(1) },
                  { label: 'Height', value: `${user.height} cm` },
                  { label: 'Weight', value: `${user.weight} kg` },
                  { label: 'Target Weight', value: `${user.targetWeight} kg` },
                  { label: 'Food Preference', value: user.foodPreference.replace('-', ' ') },
                ].map((f) => (
                  <div key={f.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-400">{f.label}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{f.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => window.location.hash = 'profile'} className="nn-btn-secondary text-sm w-full">Edit Profile</button>
            </div>
          )}

          {section === 'notifications' && (
            <div className="nn-card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Notification Preferences</h3>
              <div className="space-y-3">
                {notifOptions.map((opt) => (
                  <div key={opt.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{opt.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                    <Toggle
                      on={settings.notifications[opt.key]}
                      onToggle={() => updateSettings({
                        notifications: { ...settings.notifications, [opt.key]: !settings.notifications[opt.key] }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'appearance' && (
            <div className="nn-card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Appearance</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => settings.theme !== 'light' && toggleTheme()}
                  className={`p-6 rounded-2xl border-2 transition-all ${settings.theme === 'light' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'}`}
                >
                  <Sun size={28} className="mx-auto mb-2 text-amber-500" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Light Mode</p>
                  {settings.theme === 'light' && <p className="text-xs text-teal-600 mt-1 flex items-center justify-center gap-1"><Check size={12} /> Active</p>}
                </button>
                <button
                  onClick={() => settings.theme !== 'dark' && toggleTheme()}
                  className={`p-6 rounded-2xl border-2 transition-all ${settings.theme === 'dark' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'}`}
                >
                  <Moon size={28} className="mx-auto mb-2 text-violet-500" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Dark Mode</p>
                  {settings.theme === 'dark' && <p className="text-xs text-teal-600 mt-1 flex items-center justify-center gap-1"><Check size={12} /> Active</p>}
                </button>
              </div>
            </div>
          )}

          {section === 'units' && (
            <div className="nn-card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Measurement Units</h3>
              <div className="grid grid-cols-2 gap-4">
                {([['metric', 'Metric', 'kg, cm, L'], ['imperial', 'Imperial', 'lbs, in, fl oz']] as const).map(([val, label, desc]) => (
                  <button
                    key={val}
                    onClick={() => updateSettings({ units: val })}
                    className={`p-6 rounded-2xl border-2 transition-all text-center ${settings.units === val ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'}`}
                  >
                    <Ruler size={24} className="mx-auto mb-2 text-teal-600" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {section === 'privacy' && (
            <div className="nn-card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Privacy Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile Visible</p>
                    <p className="text-xs text-slate-400 mt-0.5">Allow others to see your profile</p>
                  </div>
                  <Toggle on={settings.privacy.profileVisible} onToggle={() => updateSettings({ privacy: { ...settings.privacy, profileVisible: !settings.privacy.profileVisible } })} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Share Progress</p>
                    <p className="text-xs text-slate-400 mt-0.5">Share your health progress with friends</p>
                  </div>
                  <Toggle on={settings.privacy.shareProgress} onToggle={() => updateSettings({ privacy: { ...settings.privacy, shareProgress: !settings.privacy.shareProgress } })} />
                </div>
              </div>
            </div>
          )}

          {section === 'security' && (
            <div className="nn-card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Security</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock size={18} className="text-teal-600" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</p>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Your password is stored securely on your device.</p>
                  <p className="text-xs text-slate-400">Last changed: Account creation</p>
                </div>
                <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle size={18} className="text-red-500" />
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Delete all your data permanently. This cannot be undone.</p>
                  <button
                    onClick={() => { storage.clearAll(); window.location.reload(); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={16} /> Delete All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative nn-card max-w-sm w-full p-6 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <LogOut size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Logout?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">You will need to log in again to access your dashboard.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="nn-btn-secondary flex-1">Cancel</button>
              <button onClick={logout} className="nn-btn-primary flex-1 bg-red-500 hover:bg-red-600">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-all ${on ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${on ? 'left-6' : 'left-0.5'}`} />
    </button>
  );
}
