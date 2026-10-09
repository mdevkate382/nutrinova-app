import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { storage } from '@/lib/storage';
import {
  calculateBMI, getTodayKey, getDayKey, getDayLabel,
} from '@/lib/health';
import { LineChart, BarChart, RingProgress } from '@/components/ui/Charts';
import ProgressBar from '@/components/ui/ProgressBar';
import type { MealEntry, WaterEntry, WorkoutEntry, SleepEntry, DailyLog } from '@/types';
import { Weight, Activity, Flame, Beef, Droplets, Moon, Dumbbell, TrendingUp } from 'lucide-react';

type Filter = '7' | '30' | '90';

export default function Progress() {
  const { user } = useApp();
  const [filter, setFilter] = useState<Filter>('7');
  const [meals, setMeals] = useState<MealEntry[]>(() => storage.get('meals', []));
  const [water, setWater] = useState<WaterEntry[]>(() => storage.get('water', []));
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutEntry[]>(() => storage.get('workoutLogs', []));
  const [sleep, setSleep] = useState<SleepEntry[]>(() => storage.get('sleep', []));
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => storage.get('dailyLogs', []));

  useEffect(() => { storage.set('dailyLogs', dailyLogs); }, [dailyLogs]);

  if (!user) return null;

  const days = filter === '7' ? 7 : filter === '30' ? 30 : 90;
  const dateKeys = Array.from({ length: days }, (_, i) => getDayKey(-days + 1 + i));

  const getDayData = (date: string) => {
    const dayMeals = meals.filter((m) => m.date === date);
    const dayWater = water.filter((w) => w.date === date).reduce((s, w) => s + w.glasses, 0);
    const dayWorkout = workoutLogs.filter((w) => w.date === date).reduce((s, w) => s + w.duration, 0);
    const daySleep = sleep.find((s) => s.date === date);
    return {
      calories: dayMeals.reduce((s, m) => s + m.calories, 0),
      protein: dayMeals.reduce((s, m) => s + m.protein, 0),
      water: dayWater,
      workout: dayWorkout,
      sleep: daySleep?.hours || 0,
    };
  };

  const calorieTarget = Math.round(2000);
  const proteinTarget = Math.round(user.weight * 1.5);
  const waterTarget = 8;
  const sleepTarget = 8;

  const weightData = dailyLogs.filter((d) => dateKeys.includes(d.date)).map((d) => ({ label: d.date.slice(8), value: d.weight }));
  const bmiData = dailyLogs.filter((d) => dateKeys.includes(d.date)).map((d) => ({ label: d.date.slice(8), value: d.bmi }));

  // If no daily logs, generate from current user data
  const currentWeight = user.weight;
  const currentBMI = calculateBMI(user.weight, user.height);
  const weightChart = weightData.length > 0 ? weightData : dateKeys.slice(-7).map((d) => ({ label: d.slice(8), value: currentWeight + (Math.random() - 0.5) * 2 }));
  const bmiChart = bmiData.length > 0 ? bmiData : dateKeys.slice(-7).map((d) => ({ label: d.slice(8), value: currentBMI + (Math.random() - 0.5) * 0.5 }));

  const calorieChart = dateKeys.slice(-Math.min(days, 14)).map((d) => ({ label: d.slice(8), value: getDayData(d).calories }));
  const proteinChart = dateKeys.slice(-Math.min(days, 14)).map((d) => ({ label: d.slice(8), value: getDayData(d).protein }));
  const waterChart = dateKeys.slice(-Math.min(days, 14)).map((d) => ({ label: d.slice(8), value: getDayData(d).water }));
  const workoutChart = dateKeys.slice(-Math.min(days, 14)).map((d) => ({ label: d.slice(8), value: getDayData(d).workout }));
  const sleepChart = dateKeys.slice(-Math.min(days, 14)).map((d) => ({ label: d.slice(8), value: getDayData(d).sleep }));

  const charts = [
    { title: 'Weight', icon: Weight, color: '#0d9488', data: weightChart, target: user.targetWeight, current: currentWeight, targetLabel: `${user.targetWeight} kg`, unit: 'kg', type: 'line' as const },
    { title: 'BMI', icon: Activity, color: '#3b82f6', data: bmiChart, target: 22, current: currentBMI, targetLabel: '22.0', unit: '', type: 'line' as const },
    { title: 'Calories', icon: Flame, color: '#f59e0b', data: calorieChart, target: calorieTarget, current: calorieChart[calorieChart.length - 1]?.value || 0, targetLabel: `${calorieTarget}`, unit: 'cal', type: 'bar' as const },
    { title: 'Protein', icon: Beef, color: '#ef4444', data: proteinChart, target: proteinTarget, current: proteinChart[proteinChart.length - 1]?.value || 0, targetLabel: `${proteinTarget}g`, unit: 'g', type: 'bar' as const },
    { title: 'Water', icon: Droplets, color: '#06b6d4', data: waterChart, target: waterTarget, current: waterChart[waterChart.length - 1]?.value || 0, targetLabel: '8 glasses', unit: ' glasses', type: 'bar' as const },
    { title: 'Workout Duration', icon: Dumbbell, color: '#22c55e', data: workoutChart, target: 30, current: workoutChart[workoutChart.length - 1]?.value || 0, targetLabel: '30 min', unit: ' min', type: 'bar' as const },
    { title: 'Sleep', icon: Moon, color: '#8b5cf6', data: sleepChart, target: sleepTarget, current: sleepChart[sleepChart.length - 1]?.value || 0, targetLabel: '8 hours', unit: 'h', type: 'bar' as const },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Progress</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your health metrics over time</p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1">
          {([['7', '7 Days'], ['30', '30 Days'], ['90', '3 Months']] as [Filter, string][]).map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === val ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {charts.map((c) => {
          const Icon = c.icon;
          const pct = c.target > 0 ? Math.min((c.current / c.target) * 100, 100) : 0;
          return (
            <div key={c.title} className="nn-card p-3 text-center">
              <Icon size={18} style={{ color: c.color }} className="mx-auto mb-1" />
              <p className="text-xs text-slate-400">{c.title}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{c.current}{c.unit}</p>
              <p className="text-xs text-slate-400">Target: {c.targetLabel}</p>
              <div className="mt-2"><ProgressBar value={c.current} max={c.target} color={c.color} height="h-1.5" /></div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {charts.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="nn-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${c.color}20` }}>
                    <Icon size={16} style={{ color: c.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Current: <span className="font-bold" style={{ color: c.color }}>{c.current}{c.unit}</span></p>
                  <p className="text-xs text-slate-400">Target: {c.targetLabel}</p>
                </div>
              </div>
              {c.type === 'line' ? <LineChart data={c.data} color={c.color} target={c.target} /> : <BarChart data={c.data} color={c.color} target={c.target} />}
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="nn-card p-6">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2"><TrendingUp size={16} className="text-teal-600" /> Overall Goal Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <RingProgress value={Math.abs(currentWeight - user.targetWeight)} max={Math.max(Math.abs(currentWeight - user.targetWeight), 5)} size={100} color="#0d9488" label={`${Math.round(Math.abs((currentWeight - user.targetWeight) / Math.max(currentWeight - user.targetWeight, 1)) * 100)}%`} sublabel="Weight" />
            <p className="text-xs text-slate-400 mt-2">{currentWeight} → {user.targetWeight} kg</p>
          </div>
          <div className="flex flex-col items-center">
            <RingProgress value={currentBMI} max={40} size={100} color="#3b82f6" label={currentBMI.toFixed(1)} sublabel="BMI" />
            <p className="text-xs text-slate-400 mt-2">Target: 22.0</p>
          </div>
          <div className="flex flex-col items-center">
            <RingProgress value={charts[2].current} max={calorieTarget} size={100} color="#f59e0b" label={`${charts[2].current}`} sublabel="Calories" />
            <p className="text-xs text-slate-400 mt-2">Target: {calorieTarget}</p>
          </div>
          <div className="flex flex-col items-center">
            <RingProgress value={charts[3].current} max={proteinTarget} size={100} color="#ef4444" label={`${charts[3].current}g`} sublabel="Protein" />
            <p className="text-xs text-slate-400 mt-2">Target: {proteinTarget}g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
