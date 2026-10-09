import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Gender, FoodPreference, FitnessGoal, ActivityLevel } from '@/types';
import { User, Mail, Calendar, Ruler, Weight, Target, Apple, Dumbbell, Activity, Save, Pencil } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  if (!user || !form) return null;

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(user);
    setEditing(false);
  };

  const update = (field: string, value: string | number) => setForm({ ...form, [field]: value });

  const goalLabels: Record<string, string> = { 'lose-weight': 'Lose Weight', 'maintain': 'Maintain Weight', 'gain-muscle': 'Gain Muscle', 'improve-endurance': 'Improve Endurance' };
  const activityLabels: Record<string, string> = { sedentary: 'Sedentary', light: 'Lightly Active', moderate: 'Moderately Active', active: 'Very Active', 'very-active': 'Extra Active' };
  const prefLabels: Record<string, string> = { vegetarian: 'Vegetarian', 'non-vegetarian': 'Non-Vegetarian', 'egg-focused': 'Egg-Focused', custom: 'Custom' };

  const fields = [
    { icon: User, label: 'Full Name', key: 'fullName', type: 'text' },
    { icon: Mail, label: 'Email', key: 'email', type: 'email' },
    { icon: Calendar, label: 'Age', key: 'age', type: 'number' },
    { icon: User, label: 'Gender', key: 'gender', type: 'select', options: [['male', 'Male'], ['female', 'Female'], ['other', 'Other']] },
    { icon: Ruler, label: 'Height (cm)', key: 'height', type: 'number' },
    { icon: Weight, label: 'Weight (kg)', key: 'weight', type: 'number' },
    { icon: Target, label: 'Target Weight (kg)', key: 'targetWeight', type: 'number' },
    { icon: Apple, label: 'Food Preference', key: 'foodPreference', type: 'select', options: [['vegetarian', 'Vegetarian'], ['non-vegetarian', 'Non-Vegetarian'], ['egg-focused', 'Egg-Focused'], ['custom', 'Custom']] },
    { icon: Dumbbell, label: 'Fitness Goal', key: 'fitnessGoal', type: 'select', options: [['lose-weight', 'Lose Weight'], ['maintain', 'Maintain Weight'], ['gain-muscle', 'Gain Muscle'], ['improve-endurance', 'Improve Endurance']] },
    { icon: Activity, label: 'Activity Level', key: 'activityLevel', type: 'select', options: [['sedentary', 'Sedentary'], ['light', 'Lightly Active'], ['moderate', 'Moderately Active'], ['active', 'Very Active'], ['very-active', 'Extra Active']] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your personal information and health details</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={handleSave} className="nn-btn-primary text-sm"><Save size={16} /> Save Changes</button>
            <button onClick={handleCancel} className="nn-btn-secondary text-sm">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="nn-btn-primary text-sm"><Pencil size={16} /> Edit Profile</button>
        )}
      </div>

      {/* Avatar Card */}
      <div className="nn-card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full nn-gradient flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.fullName}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="nn-badge bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400">{goalLabels[user.fitnessGoal]}</span>
            <span className="nn-badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">{prefLabels[user.foodPreference]}</span>
          </div>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="nn-card p-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => {
            const Icon = f.icon;
            const value = (form as unknown as Record<string, unknown>)[f.key] as string | number;
            return (
              <div key={f.key}>
                <label className="nn-label flex items-center gap-1.5"><Icon size={14} /> {f.label}</label>
                {editing ? (
                  f.type === 'select' ? (
                    <select className="nn-input" value={String(value)} onChange={(e) => update(f.key, e.target.value)}>
                      {f.options!.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} className="nn-input" value={String(value)} onChange={(e) => update(f.key, f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} />
                  )
                ) : (
                  <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {f.type === 'select' ? (f.options!.find(([v]) => v === String(value))?.[1] || value) : value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {editing && (
          <button onClick={handleSave} className="nn-btn-primary w-full mt-6"><Save size={18} /> Save Changes</button>
        )}
      </div>
    </div>
  );
}
