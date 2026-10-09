import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateBMI, getBMICategory, calculateDailyCalories } from '@/lib/health';
import { generateRecommendations } from '@/lib/recommendations';
import { getSuggestionsByPreference } from '@/data/meals';
import { workouts } from '@/data/workouts';
import { Sparkles, Apple, Beef, Dumbbell, Droplets, Lightbulb, User, Target } from 'lucide-react';

export default function Recommendations() {
  const { user } = useApp();
  if (!user) return null;

  const bmi = calculateBMI(user.weight, user.height);
  const bmiCat = getBMICategory(bmi);
  const recs = generateRecommendations(user, bmi);
  const calorieTarget = calculateDailyCalories(user.weight, user.height, user.age, user.gender, user.activityLevel);
  const mealRecs = getSuggestionsByPreference(user.foodPreference).slice(0, 3);
  const workoutRecs = workouts.slice(0, 3);

  const sections = [
    { icon: Apple, title: 'Food Recommendations', items: recs.food, color: '#22c55e', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: Beef, title: 'Protein Recommendations', items: recs.protein, color: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/20' },
    { icon: Dumbbell, title: 'Workout Recommendations', items: recs.workout, color: '#0d9488', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { icon: Droplets, title: 'Water Recommendations', items: recs.water, color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Lightbulb, title: 'Lifestyle Tips', items: recs.lifestyle, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const goalLabels: Record<string, string> = {
    'lose-weight': 'Lose Weight', 'maintain': 'Maintain Weight', 'gain-muscle': 'Gain Muscle', 'improve-endurance': 'Improve Endurance',
  };
  const activityLabels: Record<string, string> = {
    sedentary: 'Sedentary', light: 'Lightly Active', moderate: 'Moderately Active', active: 'Very Active', 'very-active': 'Extra Active',
  };
  const prefLabels: Record<string, string> = {
    vegetarian: 'Vegetarian', 'non-vegetarian': 'Non-Vegetarian', 'egg-focused': 'Egg-Focused', custom: user.customFoodPreference || 'Custom',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">AI Recommendations</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Personalized insights based on your health profile</p>
      </div>

      {/* Profile Summary */}
      <div className="nn-card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2"><User size={16} className="text-teal-600" /> Your Health Profile</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Age', value: `${user.age} yrs` },
            { label: 'BMI', value: `${bmi.toFixed(1)}`, sub: bmiCat.label, color: bmiCat.color },
            { label: 'Calorie Target', value: `${calorieTarget}` },
            { label: 'Fitness Goal', value: goalLabels[user.fitnessGoal] },
            { label: 'Food Preference', value: prefLabels[user.foodPreference] },
            { label: 'Activity Level', value: activityLabels[user.activityLevel] },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200" style={s.color ? { color: s.color } : {}}>{s.value}</p>
              {s.sub && <p className="text-xs" style={{ color: s.color }}>{s.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Sections */}
      {sections.map((section, i) => {
        const Icon = section.icon;
        return (
          <div key={section.title} className="nn-card p-6 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${section.bg} flex items-center justify-center`}>
                <Icon size={20} style={{ color: section.color }} />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{section.title}</h3>
            </div>
            <div className="space-y-2.5">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${section.color}20` }}>
                    <span className="text-xs font-bold" style={{ color: section.color }}>{idx + 1}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Recommended Meals */}
      <div className="nn-card p-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><Apple size={18} className="text-green-600" /> Recommended Meals for You</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mealRecs.map((m) => (
            <div key={m.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={m.image} alt={m.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{m.calories} cal • {m.protein}g protein</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Workouts */}
      <div className="nn-card p-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><Dumbbell size={18} className="text-teal-600" /> Recommended Workouts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {workoutRecs.map((w) => (
            <div key={w.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={w.image} alt={w.name} className="w-full h-28 object-cover" />
              <div className="p-3">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{w.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{w.duration} min • {w.caloriesBurn} cal</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
