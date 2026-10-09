import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { storage } from '@/lib/storage';
import { challenges, badges, getChallengeById, getBadgeById } from '@/data/challenges';
import { getTodayKey, generateId } from '@/lib/health';
import ProgressBar from '@/components/ui/ProgressBar';
import Modal from '@/components/ui/Modal';
import type { ChallengeProgress } from '@/types';
import * as Icons from 'lucide-react';
import { Flame, Droplets, Utensils, Dumbbell, Trophy, Calendar, Target, Award, Play, Check } from 'lucide-react';

const badgeIcons: Record<string, typeof Flame> = {
  Flame, Droplets, Utensils, Dumbbell, Trophy,
};

export default function Challenges() {
  const { user } = useApp();
  const [progress, setProgress] = useState<ChallengeProgress[]>(() => storage.get('challengeProgress', []));
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { storage.set('challengeProgress', progress); }, [progress]);

  if (!user) return null;

  const getProg = (cid: string) => progress.find((p) => p.challengeId === cid);
  const startChallenge = (cid: string) => {
    const existing = getProg(cid);
    if (!existing) {
      setProgress([...progress, { challengeId: cid, started: true, completedDays: [], streak: 0, lastCompletedDate: null }]);
    }
    setSelected(cid);
  };

  const completeDay = (cid: string) => {
    setProgress(progress.map((p) => {
      if (p.challengeId !== cid) return p;
      const today = getTodayKey();
      if (p.completedDays.includes(p.completedDays.length)) return p;
      const challenge = getChallengeById(cid);
      if (!challenge) return p;
      const newCompleted = [...p.completedDays, p.completedDays.length];
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = p.lastCompletedDate === yesterday.toISOString().split('T')[0];
      return {
        ...p,
        completedDays: newCompleted,
        streak: wasYesterday ? p.streak + 1 : 1,
        lastCompletedDate: today,
      };
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Challenges</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join challenges, build streaks, and earn badges</p>
      </div>

      {/* Badges */}
      <div className="nn-card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"><Award size={16} className="text-teal-600" /> Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {badges.map((b) => {
            const Icon = badgeIcons[b.icon] || Trophy;
            const earned = progress.some((p) => {
              const ch = getChallengeById(p.challengeId);
              return ch?.badgeId === b.id && p.completedDays.length >= ch.duration;
            });
            return (
              <div key={b.id} className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all ${earned ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-800 opacity-60'}`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${b.color}20` }}>
                  <Icon size={26} style={{ color: b.color }} />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{b.description}</p>
                {earned && <span className="text-xs text-teal-600 font-bold mt-1">Earned!</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((ch) => {
          const prog = getProg(ch.id);
          const pct = prog ? (prog.completedDays.length / ch.duration) * 100 : 0;
          const badge = getBadgeById(ch.badgeId);
          return (
            <div key={ch.id} className="nn-card nn-card-hover overflow-hidden">
              <div className="relative h-36">
                <img src={ch.image} alt={ch.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white">{ch.name}</h3>
                  <span className={`nn-badge ${ch.difficulty === 'Beginner' ? 'bg-green-500/90' : ch.difficulty === 'Intermediate' ? 'bg-amber-500/90' : 'bg-red-500/90'} text-white mt-1`}>{ch.difficulty}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{ch.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {ch.duration} days</span>
                  {badge && <span className="flex items-center gap-1"><Award size={14} style={{ color: badge.color }} /> {badge.name}</span>}
                </div>
                {prog && prog.started ? (
                  <>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">Progress</span>
                        <span className="text-teal-600 font-bold">{prog.completedDays.length}/{ch.duration} days</span>
                      </div>
                      <ProgressBar value={prog.completedDays.length} max={ch.duration} color="#0d9488" />
                    </div>
                    <button onClick={() => setSelected(ch.id)} className="nn-btn-primary w-full text-sm mt-2">Continue</button>
                  </>
                ) : (
                  <button onClick={() => startChallenge(ch.id)} className="nn-btn-primary w-full text-sm">
                    <Play size={14} /> Start Challenge
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Challenge Detail Modal */}
      {selected && (() => {
        const ch = getChallengeById(selected);
        if (!ch) return null;
        const prog = getProg(selected) || { challengeId: selected, started: true, completedDays: [], streak: 0, lastCompletedDate: null };
        const pct = (prog.completedDays.length / ch.duration) * 100;
        const badge = getBadgeById(ch.badgeId);
        const BadgeIcon = badge ? (badgeIcons[badge.icon] || Trophy) : Trophy;
        return (
          <Modal open={true} onClose={() => setSelected(null)} title={ch.name} maxWidth="max-w-lg">
            <div>
              <img src={ch.image} alt={ch.name} className="w-full h-36 object-cover rounded-xl mb-4" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{ch.description}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400">Duration</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{ch.duration}d</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400">Streak</p>
                  <p className="text-lg font-bold text-teal-600">{prog.streak}d</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-400">Progress</p>
                  <p className="text-lg font-bold text-teal-600">{Math.round(pct)}%</p>
                </div>
              </div>
              <ProgressBar value={prog.completedDays.length} max={ch.duration} color="#0d9488" showLabel />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-5 mb-3">Daily Tasks</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                {ch.dailyTasks.map((task, i) => {
                  const done = prog.completedDays.includes(i);
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${done ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800' : 'border border-slate-200 dark:border-slate-800'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                        {done ? <Check size={14} /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      <span className={`text-sm flex-1 ${done ? 'text-teal-700 dark:text-teal-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{task}</span>
                    </div>
                  );
                })}
              </div>
              {badge && (
                <div className="flex items-center gap-3 mt-4 p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${badge.color}20` }}>
                    <BadgeIcon size={20} style={{ color: badge.color }} />
                  </div>
                  <div><p className="text-sm font-bold text-slate-700 dark:text-slate-200">Reward: {badge.name}</p><p className="text-xs text-slate-400">{badge.description}</p></div>
                </div>
              )}
              {prog.completedDays.length < ch.duration ? (
                <button onClick={() => completeDay(selected)} className="nn-btn-primary w-full mt-4">
                  <Check size={18} /> Complete Today's Task
                </button>
              ) : (
                <div className="mt-4 text-center p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 font-bold">
                  <Trophy size={24} className="mx-auto mb-1" /> Challenge Complete!
                </div>
              )}
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
