import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { storage } from '@/lib/storage';
import {
  calculateBMI, getBMICategory, calculateDailyCalories, calculateHealthScore,
  getTodayKey, getCurrentTime12h, generateId, formatTime,
} from '@/lib/health';
import { workouts } from '@/data/workouts';
import { getSuggestionsByPreference } from '@/data/meals';
import { RingProgress, LineChart } from '@/components/ui/Charts';
import ProgressBar from '@/components/ui/ProgressBar';
import Modal from '@/components/ui/Modal';
import type { MealEntry, WaterEntry, WorkoutEntry, SleepEntry } from '@/types';
import {
  Weight, Target, Flame, Beef, Droplets, Moon, Heart, Apple,
  Dumbbell, Calculator, TrendingUp, Plus, Clock, Activity,
} from 'lucide-react';

export default function Dashboard() {
  const { user, navigate } = useApp();
  const [meals, setMeals] = useState<MealEntry[]>(() => storage.get('meals', []));
  const [water, setWater] = useState<WaterEntry[]>(() => storage.get('water', []));
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutEntry[]>(() => storage.get('workoutLogs', []));
  const [sleep, setSleep] = useState<SleepEntry[]>(() => storage.get('sleep', []));
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddWater, setShowAddWater] = useState(false);
  const [showAddSleep, setShowAddSleep] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: '', time: getCurrentTime12h() });
  const [newSleep, setNewSleep] = useState({ hours: '', bedTime: '10:30 PM', wakeTime: '06:30 AM' });

  useEffect(() => { storage.set('meals', meals); }, [meals]);
  useEffect(() => { storage.set('water', water); }, [water]);
  useEffect(() => { storage.set('workoutLogs', workoutLogs); }, [workoutLogs]);
  useEffect(() => { storage.set('sleep', sleep); }, [sleep]);

  if (!user) return null;

  const today = getTodayKey();
  const todayMeals = meals.filter((m) => m.date === today);
  const todayWater = water.filter((w) => w.date === today);
  const todayWorkouts = workoutLogs.filter((w) => w.date === today);
  const todaySleep = sleep.find((s) => s.date === today);

  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);
  const waterGlasses = todayWater.reduce((s, w) => s + w.glasses, 0);
  const workoutMinutes = todayWorkouts.reduce((s, w) => s + w.duration, 0);
  const workoutCalories = todayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);
  const sleepHours = todaySleep?.hours || 0;

  const bmi = calculateBMI(user.weight, user.height);
  const bmiCat = getBMICategory(bmi);
  const calorieTarget = calculateDailyCalories(user.weight, user.height, user.age, user.gender, user.activityLevel);
  const proteinTarget = Math.round(user.weight * 1.5);
  const waterTarget = 8;
  const sleepTarget = 8;
  const workoutTarget = 30;

  const healthScore = calculateHealthScore(bmi, waterGlasses, sleepHours, workoutMinutes, totalProtein, proteinTarget, totalCalories, calorieTarget);

  const recommendedWorkout = workouts[0];
  const suggestions = getSuggestionsByPreference(user.foodPreference).slice(0, 3);

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;
    const meal: MealEntry = {
      id: generateId(), type: 'lunch', name: newMeal.name,
      image: 'https://images.pexels.com/photos/4887993/pexels-photo-4887993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      quantity: newMeal.quantity || '1 serving',
      calories: parseInt(newMeal.calories) || 0, protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0, fat: parseInt(newMeal.fat) || 0,
      time: formatTime(newMeal.time), date: today,
    };
    setMeals([...meals, meal]);
    setShowAddMeal(false);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', quantity: '', time: getCurrentTime12h() });
  };

  const addWater = (glasses: number) => {
    const entry: WaterEntry = { id: generateId(), glasses, date: today, time: getCurrentTime12h() };
    setWater([...water, entry]);
    setShowAddWater(false);
  };

  const addSleep = () => {
    const hours = parseFloat(newSleep.hours);
    if (!hours) return;
    const entry: SleepEntry = { id: generateId(), hours, quality: 80, date: today, bedTime: newSleep.bedTime, wakeTime: newSleep.wakeTime };
    setSleep([...sleep.filter((s) => s.date !== today), entry]);
    setShowAddSleep(false);
    setNewSleep({ hours: '', bedTime: '10:30 PM', wakeTime: '06:30 AM' });
  };

  const weightProgress = user.targetWeight < user.weight
    ? Math.min(((user.weight - user.targetWeight) / Math.max(user.weight - user.targetWeight, 1)) * 100, 100)
    : Math.min(((user.targetWeight - user.weight) / Math.max(user.targetWeight - user.weight, 1)) * 100, 100);

  const statCards = [
    { icon: Weight, label: 'Current Weight', value: `${user.weight} kg`, color: '#0d9488', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { icon: Target, label: 'Target Weight', value: `${user.targetWeight} kg`, color: '#06b6d4', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { icon: Activity, label: 'BMI', value: bmi.toFixed(1), sub: bmiCat.label, color: bmiCat.color, bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Flame, label: 'Daily Calories', value: `${totalCalories}`, sub: `/ ${calorieTarget}`, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { icon: Beef, label: 'Protein', value: `${totalProtein}g`, sub: `/ ${proteinTarget}g`, color: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/20' },
    { icon: Droplets, label: 'Water', value: `${waterGlasses}`, sub: '/ 8 glasses', color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Moon, label: 'Sleep', value: `${sleepHours}h`, sub: '/ 8h', color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { icon: Dumbbell, label: 'Workout', value: `${workoutMinutes}m`, sub: `${workoutCalories} cal`, color: '#22c55e', bg: 'bg-green-50 dark:bg-green-900/20' },
  ];

  const quickActions = [
    { icon: Apple, label: 'Add Meal', color: '#22c55e', action: () => setShowAddMeal(true) },
    { icon: Droplets, label: 'Add Water', color: '#3b82f6', action: () => setShowAddWater(true) },
    { icon: Dumbbell, label: 'Log Workout', color: '#0d9488', action: () => navigate('fitness') },
    { icon: Calculator, label: 'Calculate BMI', color: '#f59e0b', action: () => navigate('calculator') },
    { icon: TrendingUp, label: 'View Progress', color: '#8b5cf6', action: () => navigate('progress') },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">My Health Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your personalized health, nutrition and fitness overview</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2">
          <RingProgress value={healthScore} max={100} size={48} color="#0d9488" />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Health Score</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{healthScore}<span className="text-xs text-slate-400">/100</span></p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nn-card p-4 animate-slide-up">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              {s.sub && <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calories Ring */}
        <div className="nn-card p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 self-start">Daily Calories</h3>
          <RingProgress value={totalCalories} max={calorieTarget} size={160} color="#f59e0b" label={`${totalCalories}`} sublabel={`of ${calorieTarget} cal`} />
          <div className="grid grid-cols-3 gap-3 w-full mt-6 text-center">
            <div><p className="text-xs text-slate-400">Protein</p><p className="font-bold text-red-500">{totalProtein}g</p></div>
            <div><p className="text-xs text-slate-400">Carbs</p><p className="font-bold text-blue-500">{totalCarbs}g</p></div>
            <div><p className="text-xs text-slate-400">Fat</p><p className="font-bold text-amber-500">{totalFat}g</p></div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">Remaining: <span className="font-bold text-teal-600">{Math.max(calorieTarget - totalCalories, 0)} cal</span></p>
        </div>

        {/* Today's Meals */}
        <div className="nn-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Today's Meals</h3>
            <button onClick={() => navigate('nutrition')} className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline">View All</button>
          </div>
          {todayMeals.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Apple size={32} className="mx-auto mb-2 opacity-50" />
              No meals logged today. Click "Add Meal" to start tracking.
            </div>
          ) : (
            <div className="space-y-3">
              {todayMeals.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <img src={m.image} alt={m.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.quantity} • {m.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{m.calories} cal</p>
                    <p className="text-xs text-slate-400">{m.protein}g protein</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommended Workout */}
        <div className="nn-card overflow-hidden">
          <div className="relative h-40">
            <img src={recommendedWorkout.image} alt={recommendedWorkout.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-xs text-teal-300 font-semibold">Today's Recommended Workout</p>
              <h3 className="text-lg font-bold text-white">{recommendedWorkout.name}</h3>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{recommendedWorkout.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1"><Clock size={14} /> {recommendedWorkout.duration} min</span>
              <span className="flex items-center gap-1"><Flame size={14} /> {recommendedWorkout.caloriesBurn} cal</span>
              <span className="flex items-center gap-1"><Dumbbell size={14} /> {recommendedWorkout.exerciseCount} exercises</span>
            </div>
            <button onClick={() => navigate('fitness')} className="nn-btn-primary w-full text-sm">Start Workout</button>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="nn-card p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-5">Goal Progress</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Weight Goal</span>
                <span className="text-slate-400">{user.weight} → {user.targetWeight} kg</span>
              </div>
              <ProgressBar value={Math.abs(weightProgress)} max={100} color="#0d9488" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Calories</span>
                <span className="text-slate-400">{totalCalories} / {calorieTarget}</span>
              </div>
              <ProgressBar value={totalCalories} max={calorieTarget} color="#f59e0b" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Protein</span>
                <span className="text-slate-400">{totalProtein}g / {proteinTarget}g</span>
              </div>
              <ProgressBar value={totalProtein} max={proteinTarget} color="#ef4444" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Water</span>
                <span className="text-slate-400">{waterGlasses} / {waterTarget} glasses</span>
              </div>
              <ProgressBar value={waterGlasses} max={waterTarget} color="#3b82f6" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Sleep</span>
                <span className="text-slate-400">{sleepHours}h / {sleepTarget}h</span>
              </div>
              <ProgressBar value={sleepHours} max={sleepTarget} color="#8b5cf6" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Workout</span>
                <span className="text-slate-400">{workoutMinutes}m / {workoutTarget}m</span>
              </div>
              <ProgressBar value={workoutMinutes} max={workoutTarget} color="#22c55e" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="nn-card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-700 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${a.color}20` }}>
                  <Icon size={20} style={{ color: a.color }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Meals */}
      <div className="nn-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Suggested Meals for You</h3>
          <button onClick={() => navigate('nutrition')} className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline">Explore More</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestions.map((s) => (
            <div key={s.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group cursor-pointer" onClick={() => navigate('nutrition')}>
              <div className="relative h-28 overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{s.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.calories} cal • {s.protein}g protein</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Meal Modal */}
      <Modal open={showAddMeal} onClose={() => setShowAddMeal(false)} title="Add Meal">
        <div className="space-y-4">
          <div><label className="nn-label">Food Name</label><input className="nn-input" value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} placeholder="e.g. Grilled Chicken Salad" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="nn-label">Quantity</label><input className="nn-input" value={newMeal.quantity} onChange={(e) => setNewMeal({ ...newMeal, quantity: e.target.value })} placeholder="1 bowl" /></div>
            <div><label className="nn-label">Meal Time</label><input className="nn-input" value={newMeal.time} onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })} placeholder="07:30 AM" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="nn-label">Calories</label><input type="number" className="nn-input" value={newMeal.calories} onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })} placeholder="350" /></div>
            <div><label className="nn-label">Protein (g)</label><input type="number" className="nn-input" value={newMeal.protein} onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })} placeholder="25" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="nn-label">Carbs (g)</label><input type="number" className="nn-input" value={newMeal.carbs} onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })} placeholder="40" /></div>
            <div><label className="nn-label">Fat (g)</label><input type="number" className="nn-input" value={newMeal.fat} onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })} placeholder="12" /></div>
          </div>
          <button onClick={addMeal} className="nn-btn-primary w-full">Add Meal</button>
        </div>
      </Modal>

      {/* Add Water Modal */}
      <Modal open={showAddWater} onClose={() => setShowAddWater(false)} title="Add Water" maxWidth="max-w-sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">How many glasses of water (250ml each)?</p>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} onClick={() => addWater(n)} className="aspect-square rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-all">
                {n}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Add Sleep Modal */}
      <Modal open={showAddSleep} onClose={() => setShowAddSleep(false)} title="Log Sleep">
        <div className="space-y-4">
          <div><label className="nn-label">Hours Slept</label><input type="number" step="0.5" className="nn-input" value={newSleep.hours} onChange={(e) => setNewSleep({ ...newSleep, hours: e.target.value })} placeholder="7.5" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="nn-label">Bed Time</label><input className="nn-input" value={newSleep.bedTime} onChange={(e) => setNewSleep({ ...newSleep, bedTime: e.target.value })} placeholder="10:30 PM" /></div>
            <div><label className="nn-label">Wake Time</label><input className="nn-input" value={newSleep.wakeTime} onChange={(e) => setNewSleep({ ...newSleep, wakeTime: e.target.value })} placeholder="06:30 AM" /></div>
          </div>
          <button onClick={addSleep} className="nn-btn-primary w-full">Log Sleep</button>
        </div>
      </Modal>
    </div>
  );
}
