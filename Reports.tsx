import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { storage } from '@/lib/storage';
import { calculateBMI, getBMICategory, calculateDailyCalories, getDayKey, formatDate } from '@/lib/health';
import { LineChart, BarChart } from '@/components/ui/Charts';
import type { MealEntry, WaterEntry, WorkoutEntry, SleepEntry } from '@/types';
import { FileText, Apple, Dumbbell, Weight, Activity, Droplets, Moon, Heart, Calendar, Download } from 'lucide-react';

type ReportFilter = 'weekly' | 'monthly' | 'custom';

export default function Reports() {
  const { user } = useApp();
  const [filter, setFilter] = useState<ReportFilter>('weekly');
  const [customStart, setCustomStart] = useState(getDayKey(-7));
  const [customEnd, setCustomEnd] = useState(getDayKey(0));

  if (!user) return null;

  const days = filter === 'weekly' ? 7 : filter === 'monthly' ? 30 : Math.abs(Math.round((new Date(customEnd).getTime() - new Date(customStart).getTime()) / 86400000)) + 1;
  const dateKeys = filter === 'custom'
    ? Array.from({ length: days }, (_, i) => { const d = new Date(customStart); d.setDate(d.getDate() + i); return d.toISOString().split('T')[0]; })
    : Array.from({ length: days }, (_, i) => getDayKey(-days + 1 + i));

  const meals: MealEntry[] = storage.get('meals', []);
  const water: WaterEntry[] = storage.get('water', []);
  const workoutLogs: WorkoutEntry[] = storage.get('workoutLogs', []);
  const sleep: SleepEntry[] = storage.get('sleep', []);

  const getDayData = (date: string) => {
    const dm = meals.filter((m) => m.date === date);
    const dw = water.filter((w) => w.date === date).reduce((s, w) => s + w.glasses, 0);
    const dwk = workoutLogs.filter((w) => w.date === date);
    const ds = sleep.find((s) => s.date === date);
    return {
      calories: dm.reduce((s, m) => s + m.calories, 0),
      protein: dm.reduce((s, m) => s + m.protein, 0),
      carbs: dm.reduce((s, m) => s + m.carbs, 0),
      fat: dm.reduce((s, m) => s + m.fat, 0),
      water: dw,
      workoutMin: dwk.reduce((s, w) => s + w.duration, 0),
      workoutCal: dwk.reduce((s, w) => s + w.caloriesBurned, 0),
      sleep: ds?.hours || 0,
      mealCount: dm.length,
    };
  };

  const allData = dateKeys.map(getDayData);
  const totals = allData.reduce((acc, d) => ({
    calories: acc.calories + d.calories, protein: acc.protein + d.protein, carbs: acc.carbs + d.carbs,
    fat: acc.fat + d.fat, water: acc.water + d.water, workoutMin: acc.workoutMin + d.workoutMin,
    workoutCal: acc.workoutCal + d.workoutCal, sleep: acc.sleep + d.sleep, mealCount: acc.mealCount + d.mealCount,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, workoutMin: 0, workoutCal: 0, sleep: 0, mealCount: 0 });

  const avg = (v: number) => days > 0 ? Math.round(v / days) : 0;
  const bmi = calculateBMI(user.weight, user.height);
  const bmiCat = getBMICategory(bmi);
  const calorieTarget = calculateDailyCalories(user.weight, user.height, user.age, user.gender, user.activityLevel);

  const reportCards = [
    { icon: Apple, title: 'Nutrition', color: '#22c55e', stats: [
      { label: 'Avg Daily Calories', value: `${avg(totals.calories)} cal` },
      { label: 'Avg Protein', value: `${avg(totals.protein)} g` },
      { label: 'Avg Carbs', value: `${avg(totals.carbs)} g` },
      { label: 'Avg Fat', value: `${avg(totals.fat)} g` },
      { label: 'Total Meals', value: `${totals.mealCount}` },
    ]},
    { icon: Dumbbell, title: 'Fitness', color: '#0d9488', stats: [
      { label: 'Total Workout Time', value: `${totals.workoutMin} min` },
      { label: 'Total Calories Burned', value: `${totals.workoutCal} cal` },
      { label: 'Avg Daily Workout', value: `${avg(totals.workoutMin)} min` },
      { label: 'Workout Sessions', value: `${workoutLogs.filter((w) => dateKeys.includes(w.date)).length}` },
    ]},
    { icon: Weight, title: 'Weight', color: '#06b6d4', stats: [
      { label: 'Current Weight', value: `${user.weight} kg` },
      { label: 'Target Weight', value: `${user.targetWeight} kg` },
      { label: 'Difference', value: `${(user.weight - user.targetWeight).toFixed(1)} kg` },
    ]},
    { icon: Activity, title: 'BMI', color: '#3b82f6', stats: [
      { label: 'Current BMI', value: bmi.toFixed(1) },
      { label: 'Category', value: bmiCat.label },
      { label: 'Healthy Range', value: `${Math.round(18.5 * (user.height / 100) ** 2 * 10) / 10} - ${Math.round(24.9 * (user.height / 100) ** 2 * 10) / 10} kg` },
    ]},
    { icon: Droplets, title: 'Water', color: '#06b6d4', stats: [
      { label: 'Avg Daily Water', value: `${avg(totals.water)} glasses` },
      { label: 'Total Water', value: `${totals.water} glasses` },
    ]},
    { icon: Moon, title: 'Sleep', color: '#8b5cf6', stats: [
      { label: 'Avg Sleep', value: `${(totals.sleep / Math.max(days, 1)).toFixed(1)} h` },
      { label: 'Total Sleep', value: `${totals.sleep.toFixed(1)} h` },
    ]},
  ];

  const overallScore = Math.round(
    (bmiCat.label === 'Normal Weight' ? 25 : bmiCat.label === 'Overweight' ? 15 : 10) +
    Math.min(avg(totals.water) / 8, 1) * 20 +
    Math.min(totals.sleep / Math.max(days, 1) / 8, 1) * 20 +
    Math.min(avg(totals.workoutMin) / 30, 1) * 20 +
    Math.min(avg(totals.protein) / (user.weight * 1.5), 1) * 15
  );

  const calorieChart = dateKeys.slice(-14).map((d) => ({ label: d.slice(8), value: getDayData(d).calories }));
  const proteinChart = dateKeys.slice(-14).map((d) => ({ label: d.slice(8), value: getDayData(d).protein }));
  const waterChart = dateKeys.slice(-14).map((d) => ({ label: d.slice(8), value: getDayData(d).water }));
  const workoutChart = dateKeys.slice(-14).map((d) => ({ label: d.slice(8), value: getDayData(d).workoutMin }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Detailed health and fitness reports</p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1">
          {([['weekly', 'Weekly'], ['monthly', 'Monthly'], ['custom', 'Custom']] as [ReportFilter, string][]).map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === val ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* Custom date range */}
      {filter === 'custom' && (
        <div className="nn-card p-4 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1"><label className="nn-label">Start Date</label><input type="date" className="nn-input" value={customStart} onChange={(e) => setCustomStart(e.target.value)} /></div>
          <div className="flex-1"><label className="nn-label">End Date</label><input type="date" className="nn-input" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} /></div>
        </div>
      )}

      {/* Overall Health Score */}
      <div className="nn-card p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"><Heart size={18} className="text-teal-600" /> Overall Health Score</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on {filter} data from {formatDate(dateKeys[0])} to {formatDate(dateKeys[dateKeys.length - 1])}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold nn-gradient-text">{overallScore}</p>
            <p className="text-xs text-slate-400">out of 100</p>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="nn-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{card.title} Report</h3>
              </div>
              <div className="space-y-2">
                {card.stats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{s.label}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="nn-card p-6"><h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Calories Trend</h3><LineChart data={calorieChart} color="#f59e0b" target={calorieTarget} /></div>
        <div className="nn-card p-6"><h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Protein Intake</h3><BarChart data={proteinChart} color="#ef4444" target={Math.round(user.weight * 1.5)} /></div>
        <div className="nn-card p-6"><h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Water Intake</h3><BarChart data={waterChart} color="#3b82f6" target={8} /></div>
        <div className="nn-card p-6"><h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Workout Duration</h3><BarChart data={workoutChart} color="#22c55e" target={30} /></div>
      </div>
    </div>
  );
}
