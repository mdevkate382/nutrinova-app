import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onBack: () => void;
  onSwitch: () => void;
}

export default function AuthPage({ mode, onBack, onSwitch }: AuthPageProps) {
  const { login, signup } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setError('Please enter your email and password.');
        return;
      }
      const success = login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password. If you don\'t have an account, please sign up first.');
      }
    } else {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      const ageNum = parseInt(formData.age, 10);
      if (!ageNum || ageNum < 1 || ageNum > 120) {
        setError('Please enter a valid age.');
        return;
      }

      signup({
        id: Date.now().toString(36),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        age: ageNum,
        gender: formData.gender,
        height: 170,
        weight: 70,
        targetWeight: 68,
        foodPreference: 'vegetarian',
        fitnessGoal: 'maintain',
        activityLevel: 'moderate',
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative nn-gradient items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/4662345/pexels-photo-4662345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Health and fitness"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-md text-white">
          <Logo size={48} />
          <h2 className="text-3xl font-bold mt-8 mb-4 leading-tight">
            {mode === 'login' ? 'Welcome Back to NutriNova' : 'Begin Your Health Journey'}
          </h2>
          <p className="text-teal-50 text-lg leading-relaxed">
            {mode === 'login'
              ? 'Log in to access your personalized dashboard, track your nutrition, and continue your fitness journey.'
              : 'Create your account and get instant access to AI-powered nutrition tracking, personalized workouts, and health insights.'}
          </p>
          <div className="mt-10 space-y-3">
            {['Personalized meal recommendations', 'AI-driven fitness plans', 'Real-time progress tracking', 'Achievement badges & challenges'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-teal-50">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-8 text-sm font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to home
          </button>

          <div className="lg:hidden mb-8">
            <Logo size={40} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {mode === 'login' ? 'Login to Your Account' : 'Create Your Account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            {mode === 'login' ? 'Enter your credentials to access your dashboard' : 'Fill in your details to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="nn-label">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="nn-input"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="nn-label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="nn-input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="nn-label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="nn-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label className="nn-label">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="nn-input pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="nn-label">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className="nn-input"
                      placeholder="25"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="nn-label">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="nn-input"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" className="nn-btn-primary w-full py-3 text-base">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={onSwitch} className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
