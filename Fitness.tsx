import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { storage } from '@/lib/storage';
import { workouts, workoutCategories, getWorkoutsByCategory } from '@/data/workouts';
import { getTodayKey, getCurrentTime12h, generateId, formatTime } from '@/lib/health';
import Modal from '@/components/ui/Modal';
import type { WorkoutEntry, Workout, Exercise } from '@/types';
import {
  Clock, Flame, Dumbbell, Play, Check, Pause, RotateCcw, X,
  ArrowLeft, Activity, TrendingUp, Calendar,
} from 'lucide-react';

export default function Fitness() {
  const { user } = useApp();
  const [category, setCategory] = useState('All');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutEntry[]>(() => storage.get('workoutLogs', []));
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { storage.set('workoutLogs', workoutLogs); }, [workoutLogs]);

  if (!user) return null;
  const today = getTodayKey();
  const todayWorkouts = workoutLogs.filter((w) => w.date === today);
  const totalCaloriesBurned = workoutLogs.reduce((s, w) => s + w.caloriesBurned, 0);
  const totalDuration = workoutLogs.reduce((s, w) => s + w.duration, 0);
  const filtered = getWorkoutsByCategory(category);
  const recommended = workouts[0];

  const logWorkout = (w: Workout) => {
    const entry: WorkoutEntry = {
      id: generateId(), workoutId: w.id, name: w.name,
      duration: w.duration, caloriesBurned: w.caloriesBurn,
      exercisesCompleted: w.exercises.length, date: today, time: getCurrentTime12h(),
    };
    setWorkoutLogs([...workoutLogs, entry]);
    setSelectedWorkout(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Fitness & Workouts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Choose a workout and start training</p>
        </div>
        <button onClick={() => setShowHistory(true)} className="nn-btn-secondary text-sm">
          <Activity size={16} /> Workout History
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Workouts", value: todayWorkouts.length, icon: Dumbbell, color: '#0d9488', bg: 'bg-teal-50 dark:bg-teal-900/20' },
          { label: 'Calories Burned', value: totalCaloriesBurned, icon: Flame, color: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Total Duration', value: `${totalDuration}m`, icon: Clock, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Total Sessions', value: workoutLogs.length, icon: TrendingUp, color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nn-card p-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recommended */}
      <div className="nn-card overflow-hidden">
        <div className="relative h-48">
          <img src={recommended.image} alt={recommended.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6">
            <div className="max-w-md">
              <p className="text-xs text-teal-300 font-bold uppercase tracking-wide mb-1">Today's Recommended</p>
              <h2 className="text-2xl font-bold text-white mb-2">{recommended.name}</h2>
              <p className="text-sm text-slate-200 mb-3">{recommended.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-300 mb-4">
                <span className="flex items-center gap-1"><Clock size={14} /> {recommended.duration} min</span>
                <span className="flex items-center gap-1"><Flame size={14} /> {recommended.caloriesBurn} cal</span>
                <span className="flex items-center gap-1"><Dumbbell size={14} /> {recommended.exerciseCount} exercises</span>
              </div>
              <button onClick={() => setSelectedWorkout(recommended)} className="nn-btn-primary text-sm">View Workout</button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {['All', ...workoutCategories].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${category === cat ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Workout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((w) => (
          <div key={w.id} className="nn-card nn-card-hover overflow-hidden">
            <div className="relative h-44">
              <img src={w.image} alt={w.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`nn-badge ${w.difficulty === 'Beginner' ? 'bg-green-500/90' : w.difficulty === 'Intermediate' ? 'bg-amber-500/90' : 'bg-red-500/90'} text-white`}>{w.difficulty}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs text-teal-300 font-semibold">{w.category}</span>
                <h3 className="text-lg font-bold text-white">{w.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{w.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Clock size={14} /> {w.duration} min</span>
                <span className="flex items-center gap-1"><Flame size={14} /> {w.caloriesBurn} cal</span>
                <span className="flex items-center gap-1"><Dumbbell size={14} /> {w.exerciseCount} ex</span>
              </div>
              <button onClick={() => setSelectedWorkout(w)} className="nn-btn-primary w-full text-sm">View Workout</button>
            </div>
          </div>
        ))}
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <WorkoutDetail workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} onStartExercise={(ex) => setActiveExercise(ex)} onComplete={() => logWorkout(selectedWorkout)} />
      )}

      {/* Exercise Timer Modal */}
      {activeExercise && (
        <ExerciseTimer exercise={activeExercise} onClose={() => setActiveExercise(null)} />
      )}

      {/* History Modal */}
      <Modal open={showHistory} onClose={() => setShowHistory(false)} title="Workout History" maxWidth="max-w-2xl">
        {workoutLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Calendar size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No workouts logged yet. Start your first workout!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
            {[...workoutLogs].reverse().map((w) => (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{w.name}</p>
                  <p className="text-xs text-slate-400">{w.date} • {w.time} • {w.exercisesCompleted} exercises</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-teal-600">{w.duration}m</p>
                  <p className="text-xs text-slate-400">{w.caloriesBurned} cal</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

function WorkoutDetail({ workout, onClose, onStartExercise, onComplete }: {
  workout: Workout; onClose: () => void; onStartExercise: (ex: Exercise) => void; onComplete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative nn-card max-w-2xl w-full my-8 animate-scale-in">
        <div className="relative h-56">
          <img src={workout.image} alt={workout.name} className="w-full h-full object-cover rounded-t-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"><X size={18} /></button>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-xs text-teal-300 font-semibold">{workout.category}</span>
            <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{workout.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
            <span className="flex items-center gap-1"><Clock size={14} /> {workout.duration} min</span>
            <span className="flex items-center gap-1"><Flame size={14} /> {workout.caloriesBurn} cal</span>
            <span className="flex items-center gap-1"><Dumbbell size={14} /> {workout.exerciseCount} exercises</span>
            <span className={`nn-badge ${workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : workout.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{workout.difficulty}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Exercises</h3>
          <div className="space-y-3">
            {workout.exercises.map((ex, i) => (
              <div key={ex.id} className="flex gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <img src={ex.image} alt={ex.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{i + 1}. {ex.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{ex.instructions}</p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-400">
                    <span>{ex.sets} sets</span>
                    {ex.reps > 0 && <span>{ex.reps} reps</span>}
                    {ex.duration > 0 && <span>{ex.duration}s</span>}
                    <span>Rest: {ex.restTime}s</span>
                  </div>
                </div>
                <button onClick={() => onStartExercise(ex)} className="self-center nn-btn-primary text-xs px-3 py-2 flex-shrink-0">
                  <Play size={12} /> Start
                </button>
              </div>
            ))}
          </div>
          <button onClick={onComplete} className="nn-btn-primary w-full mt-5">
            <Check size={18} /> Complete Workout
          </button>
        </div>
      </div>
    </div>
  );
}

function ExerciseTimer({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const [mode, setMode] = useState<'exercise' | 'rest'>('exercise');
  const [seconds, setSeconds] = useState(exercise.duration > 0 ? exercise.duration : 30);
  const [running, setRunning] = useState(false);
  const [setsDone, setSetsDone] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds <= 0) {
      if (mode === 'exercise') {
        setMode('rest');
        setSeconds(exercise.restTime);
        setSetsDone((s) => s + 1);
      } else {
        setMode('exercise');
        setSeconds(exercise.duration > 0 ? exercise.duration : 30);
      }
      setRunning(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds, mode, exercise]);

  const reset = () => {
    setRunning(false);
    setMode('exercise');
    setSeconds(exercise.duration > 0 ? exercise.duration : 30);
    setSetsDone(0);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const totalSecs = mode === 'exercise' ? (exercise.duration > 0 ? exercise.duration : 30) : exercise.restTime;
  const pct = totalSecs > 0 ? ((totalSecs - seconds) / totalSecs) * 100 : 0;

  return (
    <Modal open={true} onClose={onClose} title={exercise.name} maxWidth="max-w-md">
      <div className="text-center">
        <img src={exercise.image} alt={exercise.name} className="w-full h-40 object-cover rounded-xl mb-4" />
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{exercise.instructions}</p>
        <div className="flex justify-center gap-4 text-xs text-slate-500 mb-4">
          <span>{exercise.sets} sets</span>
          {exercise.reps > 0 && <span>{exercise.reps} reps</span>}
          <span>Rest: {exercise.restTime}s</span>
        </div>

        <div className="relative inline-flex items-center justify-center my-4">
          <svg width="180" height="180" className="-rotate-90">
            <circle cx="90" cy="90" r="80" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="8" />
            <circle cx="90" cy="90" r="80" fill="none" stroke={mode === 'exercise' ? '#0d9488' : '#f59e0b'} strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 80} strokeDashoffset={2 * Math.PI * 80 * (1 - pct / 100)} className="transition-all duration-1000 ease-linear" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: mode === 'exercise' ? '#0d9488' : '#f59e0b' }}>{mode === 'exercise' ? 'Exercise' : 'Rest'}</span>
            <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">{mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`}</span>
            <span className="text-xs text-slate-400">Set {setsDone + 1} / {exercise.sets}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => setRunning(!running)} className="nn-btn-primary">
            {running ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
          </button>
          <button onClick={reset} className="nn-btn-secondary">
            <RotateCcw size={18} /> Reset
          </button>
        </div>
        {setsDone >= exercise.sets && (
          <button onClick={onClose} className="nn-btn-primary w-full mt-4 bg-green-600 hover:bg-green-700">
            <Check size={18} /> Exercise Complete!
          </button>
        )}
      </div>
    </Modal>
  );
}
