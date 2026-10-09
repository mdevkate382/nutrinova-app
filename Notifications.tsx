import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { getCurrentTime12h, getTodayKey, generateId, formatTime } from '@/lib/health';
import type { Notification } from '@/types';
import { Bell, Droplets, Apple, Dumbbell, Target, TrendingUp, Check, Trash2, BellOff } from 'lucide-react';

const typeIcons: Record<string, typeof Droplets> = {
  water: Droplets, meal: Apple, workout: Dumbbell, goal: Target, progress: TrendingUp,
};
const typeColors: Record<string, string> = {
  water: '#3b82f6', meal: '#22c55e', workout: '#0d9488', goal: '#f59e0b', progress: '#8b5cf6',
};

function generateDefaultNotifications(): Notification[] {
  const today = getTodayKey();
  const now = getCurrentTime12h();
  return [
    { id: generateId(), title: 'Water Reminder', message: 'Time to drink a glass of water! Stay hydrated.', type: 'water', read: false, time: '09:00 AM', date: today },
    { id: generateId(), title: 'Breakfast Reminder', message: 'Don\'t forget to log your breakfast for today.', type: 'meal', read: false, time: '08:30 AM', date: today },
    { id: generateId(), title: 'Workout Reminder', message: 'Your recommended workout is ready. Let\'s get moving!', type: 'workout', read: false, time: now, date: today },
    { id: generateId(), title: 'Goal Update', message: 'You\'re 75% towards your weekly calorie goal. Great job!', type: 'goal', read: true, time: '06:00 PM', date: today },
    { id: generateId(), title: 'Progress Update', message: 'You\'ve logged meals for 5 consecutive days. Keep it up!', type: 'progress', read: true, time: '10:00 PM', date: getTodayKey() },
  ];
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const existing = storage.get<Notification[]>('notifications', []);
    return existing.length > 0 ? existing : generateDefaultNotifications();
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => { storage.set('notifications', notifications); }, [notifications]);

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter((n) => !n.read) : notifications.filter((n) => n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const deleteOne = (id: string) => setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && <span className="nn-badge bg-teal-500 text-white">{unreadCount} new</span>}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Stay updated with reminders and progress alerts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="nn-btn-secondary text-sm"><Check size={16} /> Mark All Read</button>
          <button onClick={clearAll} className="nn-btn-ghost text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={16} /> Clear All</button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([['all', `All (${notifications.length})`], ['unread', `Unread (${unreadCount})`], ['read', `Read (${notifications.length - unreadCount})`]] as [typeof filter, string][]).map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === val ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400'}`}>{label}</button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="nn-card p-12 text-center text-slate-400">
          <BellOff size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No notifications here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            const color = typeColors[n.type] || '#0d9488';
            return (
              <div key={n.id} className={`nn-card p-4 flex items-start gap-4 transition-all ${!n.read ? 'border-l-4' : ''}`} style={!n.read ? { borderLeftColor: color } : {}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.date} • {formatTime(n.time)}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!n.read && <button onClick={() => markAsRead(n.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors" title="Mark as read"><Check size={16} /></button>}
                  <button onClick={() => deleteOne(n.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
