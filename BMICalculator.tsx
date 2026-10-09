import { useState } from 'react';
import { calculateBMI, getBMICategory, getHealthyWeightRange } from '@/lib/health';
import { useApp } from '@/context/AppContext';
import { RingProgress } from '@/components/ui/Charts';
import { Calculator, RotateCcw, Activity } from 'lucide-react';

export default function BMICalculator() {
  const { user, updateUser } = useApp();
  const [height, setHeight] = useState(user ? String(user.height) : '170');
  const [weight, setWeight] = useState(user ? String(user.weight) : '70');
  const [age, setAge] = useState(user ? String(user.age) : '25');
  const [gender, setGender] = useState(user ? user.gender : 'male');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string; min: number; max: number } | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;
    const bmi = calculateBMI(w, h);
    const cat = getBMICategory(bmi);
    const range = getHealthyWeightRange(h);
    setResult({ bmi, category: cat.label, color: cat.color, min: range.min, max: range.max });
    if (user) updateUser({ weight: w, height: h, age: parseInt(age) || user.age, gender });
  };

  const reset = () => {
    setHeight(''); setWeight(''); setAge(''); setGender('male'); setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">BMI Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Calculate your Body Mass Index and healthy weight range</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="nn-card p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Enter Your Details</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="nn-label">Height (cm)</label>
                <input type="number" className="nn-input" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" />
              </div>
              <div>
                <label className="nn-label">Weight (kg)</label>
                <input type="number" className="nn-input" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="nn-label">Age</label>
                <input type="number" className="nn-input" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
              </div>
              <div>
                <label className="nn-label">Gender</label>
                <select className="nn-input" value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={calculate} className="nn-btn-primary flex-1"><Calculator size={18} /> Calculate</button>
              <button onClick={reset} className="nn-btn-secondary"><RotateCcw size={18} /> Reset</button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="nn-card p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Your Results</h3>
          {!result ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Activity size={48} className="mb-3 opacity-40" />
              <p className="text-sm">Enter your details and click Calculate to see your BMI</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <RingProgress value={Math.min(result.bmi, 40)} max={40} size={160} color={result.color} label={result.bmi.toFixed(1)} sublabel="BMI" />
              <div className="mt-4 w-full space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${result.color}15` }}>
                  <span className="text-sm font-semibold" style={{ color: result.color }}>Category</span>
                  <span className="text-sm font-bold" style={{ color: result.color }}>{result.category}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Healthy Weight Range</span>
                  <span className="text-sm font-bold text-teal-600">{result.min} - {result.max} kg</span>
                </div>
              </div>
              {/* BMI Scale */}
              <div className="w-full mt-5">
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div className="flex-1 bg-blue-500" title="Underweight" />
                  <div className="flex-1 bg-green-500" title="Normal" />
                  <div className="flex-1 bg-amber-500" title="Overweight" />
                  <div className="flex-1 bg-red-500" title="Obese" />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>&lt;18.5</span><span>18.5</span><span>25</span><span>30</span><span>&gt;30</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
