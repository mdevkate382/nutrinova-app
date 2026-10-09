import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { storage } from '@/lib/storage';
import { getSuggestionsByPreference, getSuggestionsByType, mealSuggestions } from '@/data/meals';
import { calculateDailyCalories, getTodayKey, getCurrentTime12h, generateId, formatTime } from '@/lib/health';
import ProgressBar from '@/components/ui/ProgressBar';
import Modal from '@/components/ui/Modal';
import type { MealEntry, FoodPreference, MealType } from '@/types';
import {
  Apple, Fish, Egg, Settings2, Plus, Pencil, Trash2, Clock,
  Flame, Beef, Wheat, Droplet, X,
} from 'lucide-react';

const preferences: { id: FoodPreference; label: string; icon: typeof Apple; desc: string; image: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian', icon: Apple, desc: 'Plant-based meals with vegetables, grains, and legumes', image: 'https://images.pexels.com/photos/4887993/pexels-photo-4887993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'non-vegetarian', label: 'Non-Vegetarian', icon: Fish, desc: 'Chicken, fish, meat and other protein-rich meals', image: 'https://images.pexels.com/photos/8250430/pexels-photo-8250430.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'egg-focused', label: 'Egg-Focused', icon: Egg, desc: 'High-protein egg-based meals for muscle building', image: 'https://images.pexels.com/photos/23884204/pexels-photo-23884204.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 'custom', label: 'Custom', icon: Settings2, desc: 'Create your own personalized food preference', image: 'https://images.pexels.com/photos/13625188/pexels-photo-13625188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

const mealTypes: { id: MealType; label: string; icon: string }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', icon: '☀️' },
  { id: 'snacks', label: 'Snacks', icon: '🍎' },
  { id: 'dinner', label: 'Dinner', icon: '🌙' },
];

export default function Nutrition() {
  const { user, updateUser } = useApp();
  const [meals, setMeals] = useState<MealEntry[]>(() => storage.get('meals', []));
  const [activeTab, setActiveTab] = useState<MealType>('breakfast');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [editMeal, setEditMeal] = useState<MealEntry | null>(null);
  const [customPref, setCustomPref] = useState('');

  useEffect(() => { storage.set('meals', meals); }, [meals]);

  if (!user) return null;
  const today = getTodayKey();
  const pref = user.foodPreference;
  const todayMeals = meals.filter((m) => m.date === today);
  const tabMeals = todayMeals.filter((m) => m.type === activeTab);
  const suggestions = getSuggestionsByType(pref, activeTab);

  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);
  const calorieTarget = calculateDailyCalories(user.weight, user.height, user.age, user.gender, user.activityLevel);
  const proteinTarget = Math.round(user.weight * 1.5);

  const handleSelectPref = (p: FoodPreference) => {
    if (p === 'custom' && !customPref) {
      updateUser({ foodPreference: 'custom' });
    } else {
      updateUser({ foodPreference: p, customFoodPreference: p === 'custom' ? customPref : undefined });
    }
  };

  const addMealFromSuggestion = (suggestion: typeof mealSuggestions[0]) => {
    const meal: MealEntry = {
      id: generateId(), type: activeTab, name: suggestion.name, image: suggestion.image,
      quantity: suggestion.quantity, calories: suggestion.calories, protein: suggestion.protein,
      carbs: suggestion.carbs, fat: suggestion.fat, time: getCurrentTime12h(), date: today,
    };
    setMeals([...meals, meal]);
    setShowSuggestModal(false);
  };

  const saveMeal = (data: Partial<MealEntry>) => {
    if (editMeal) {
      setMeals(meals.map((m) => m.id === editMeal.id ? { ...editMeal, ...data } as MealEntry : m));
      setEditMeal(null);
    } else {
      const meal: MealEntry = {
        id: generateId(), type: activeTab,
        name: data.name || 'Custom Meal',
        image: data.image || 'https://images.pexels.com/photos/4887993/pexels-photo-4887993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        quantity: data.quantity || '1 serving', calories: data.calories || 0,
        protein: data.protein || 0, carbs: data.carbs || 0, fat: data.fat || 0,
        time: formatTime(data.time || getCurrentTime12h()), date: today,
      };
      setMeals([...meals, meal]);
    }
    setShowAddModal(false);
  };

  const deleteMeal = (id: string) => setMeals(meals.filter((m) => m.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Nutrition & Meals</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your daily meals and nutrition intake</p>
      </div>

      {/* Food Preferences */}
      <div className="nn-card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Choose Your Food Preference</h3>
        <p className="text-xs text-slate-400 mb-4">Your selection affects meal recommendations</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {preferences.map((p) => {
            const Icon = p.icon;
            const active = pref === p.id;
            return (
              <div key={p.id} className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${active ? 'border-teal-500 shadow-lg' : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'}`} onClick={() => handleSelectPref(p.id)}>
                <div className="relative h-28">
                  <img src={p.image} alt={p.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {active && <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">✓</div>}
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <Icon size={18} className="text-white" />
                    <span className="text-white font-semibold text-sm">{p.label}</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        {pref === 'custom' && (
          <div className="mt-4">
            <label className="nn-label">Describe your custom preference</label>
            <input className="nn-input" value={customPref} onChange={(e) => setCustomPref(e.target.value)} placeholder="e.g. Mostly vegetarian with occasional fish" onBlur={() => updateUser({ customFoodPreference: customPref })} />
          </div>
        )}
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Calories', value: totalCalories, target: calorieTarget, unit: 'cal', color: '#f59e0b', icon: Flame },
          { label: 'Protein', value: totalProtein, target: proteinTarget, unit: 'g', color: '#ef4444', icon: Beef },
          { label: 'Carbs', value: totalCarbs, target: 250, unit: 'g', color: '#3b82f6', icon: Wheat },
          { label: 'Fat', value: totalFat, target: 70, unit: 'g', color: '#8b5cf6', icon: Droplet },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="nn-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} style={{ color: s.color }} />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}<span className="text-sm text-slate-400"> {s.unit}</span></p>
              <p className="text-xs text-slate-400 mb-2">Target: {s.target}{s.unit}</p>
              <ProgressBar value={s.value} max={s.target} color={s.color} height="h-2" />
            </div>
          );
        })}
      </div>

      {/* Remaining Calories */}
      <div className="nn-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Remaining Calories Today</p>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{Math.max(calorieTarget - totalCalories, 0)} <span className="text-base text-slate-400">cal</span></p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">Consumed</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCalories} <span className="text-base text-slate-400">cal</span></p>
        </div>
      </div>

      {/* Meal Tabs */}
      <div className="nn-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Meal Tracking</h3>
          <div className="flex gap-2">
            <button onClick={() => { setEditMeal(null); setShowSuggestModal(true); }} className="nn-btn-ghost text-xs px-3 py-2">
              <Apple size={14} /> Suggestions
            </button>
            <button onClick={() => { setEditMeal(null); setShowAddModal(true); }} className="nn-btn-primary text-xs px-3 py-2">
              <Plus size={14} /> Add Food
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin">
          {mealTypes.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === t.id ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tabMeals.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Apple size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No {activeTab} logged today.</p>
            <button onClick={() => { setEditMeal(null); setShowSuggestModal(true); }} className="nn-btn-secondary mt-3 text-xs">Browse Suggestions</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tabMeals.map((m) => (
              <div key={m.id} className="flex gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                <img src={m.image} alt={m.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.quantity}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={12} /> {m.time}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => { setEditMeal(m); setShowAddModal(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteMeal(m.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{m.calories} cal</span>
                    <span className="text-red-500">P: {m.protein}g</span>
                    <span className="text-blue-500">C: {m.carbs}g</span>
                    <span className="text-violet-500">F: {m.fat}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Meal Modal */}
      <MealFormModal open={showAddModal} onClose={() => { setShowAddModal(false); setEditMeal(null); }} onSave={saveMeal} editMeal={editMeal} defaultTime={getCurrentTime12h()} />

      {/* Suggestions Modal */}
      <Modal open={showSuggestModal} onClose={() => setShowSuggestModal(false)} title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Suggestions`} maxWidth="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suggestions.length > 0 ? suggestions.map((s) => (
            <div key={s.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
              <img src={s.image} alt={s.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{s.calories} cal</span>
                  <span className="text-red-500">P: {s.protein}g</span>
                  <span className="text-blue-500">C: {s.carbs}g</span>
                  <span className="text-violet-500">F: {s.fat}g</span>
                </div>
                <button onClick={() => addMealFromSuggestion(s)} className="nn-btn-primary w-full mt-3 text-xs py-2">Add to {activeTab}</button>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-8 text-slate-400">
              <p className="text-sm">No suggestions available for this preference and meal type. Try adding a custom meal.</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

function MealFormModal({ open, onClose, onSave, editMeal, defaultTime }: {
  open: boolean; onClose: () => void; onSave: (data: Partial<MealEntry>) => void; editMeal: MealEntry | null; defaultTime: string;
}) {
  const [form, setForm] = useState({ name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '', time: defaultTime, image: '' });

  useEffect(() => {
    if (editMeal) {
      setForm({ name: editMeal.name, quantity: editMeal.quantity, calories: String(editMeal.calories), protein: String(editMeal.protein), carbs: String(editMeal.carbs), fat: String(editMeal.fat), time: editMeal.time, image: editMeal.image });
    } else {
      setForm({ name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '', time: defaultTime, image: '' });
    }
  }, [editMeal, defaultTime, open]);

  return (
    <Modal open={open} onClose={onClose} title={editMeal ? 'Edit Meal' : 'Add Food'}>
      <div className="space-y-4">
        <div><label className="nn-label">Food Name</label><input className="nn-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grilled Chicken Salad" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="nn-label">Quantity</label><input className="nn-input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="1 bowl" /></div>
          <div><label className="nn-label">Meal Time</label><input className="nn-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="07:30 AM" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="nn-label">Calories</label><input type="number" className="nn-input" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="350" /></div>
          <div><label className="nn-label">Protein (g)</label><input type="number" className="nn-input" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} placeholder="25" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="nn-label">Carbs (g)</label><input type="number" className="nn-input" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} placeholder="40" /></div>
          <div><label className="nn-label">Fat (g)</label><input type="number" className="nn-input" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} placeholder="12" /></div>
        </div>
        <div><label className="nn-label">Image URL (optional)</label><input className="nn-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
        <button onClick={() => onSave({ name: form.name, quantity: form.quantity, calories: parseInt(form.calories) || 0, protein: parseInt(form.protein) || 0, carbs: parseInt(form.carbs) || 0, fat: parseInt(form.fat) || 0, time: formatTime(form.time), image: form.image || undefined })} className="nn-btn-primary w-full">{editMeal ? 'Save Changes' : 'Add Food'}</button>
      </div>
    </Modal>
  );
}
