import LandingNav from '@/components/layout/LandingNav';
import Footer from '@/components/layout/Footer';
import {
  Apple,
  Dumbbell,
  Calculator,
  Sparkles,
  TrendingUp,
  FileText,
  Heart,
  Shield,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export default function LandingPage({ onLogin, onGetStarted }: LandingPageProps) {
  const features = [
    { icon: Apple, title: 'Nutrition Tracking', desc: 'Log meals, track calories, protein, carbs, and fats with a rich food database tailored to your preferences.', color: '#22c55e' },
    { icon: Dumbbell, title: 'Fitness Tracking', desc: 'Follow guided workouts with exercise details, timers, and progress tracking to stay on top of your fitness.', color: '#0d9488' },
    { icon: Calculator, title: 'BMI Calculator', desc: 'Calculate your Body Mass Index instantly and understand your healthy weight range with actionable insights.', color: '#3b82f6' },
    { icon: Sparkles, title: 'AI Recommendations', desc: 'Get personalized food, protein, workout, and lifestyle recommendations powered by intelligent analysis.', color: '#8b5cf6' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor your weight, BMI, calories, water intake, sleep, and workout progress with beautiful charts.', color: '#f59e0b' },
    { icon: FileText, title: 'Health Reports', desc: 'Generate detailed weekly and monthly reports for nutrition, fitness, and overall health at a glance.', color: '#06b6d4' },
  ];

  const steps = [
    { num: '01', title: 'Create Your Profile', desc: 'Sign up and enter your health details — age, weight, goals, and food preferences.' },
    { num: '02', title: 'Track Daily Activities', desc: 'Log meals, water, workouts, and sleep. NutriNova calculates everything for you automatically.' },
    { num: '03', title: 'Get AI Insights', desc: 'Receive personalized recommendations and track your progress toward your health goals.' },
    { num: '04', title: 'Achieve Your Goals', desc: 'Stay motivated with challenges, badges, and visual progress that keeps you on track.' },
  ];

  const benefits = [
    { icon: Heart, title: 'Better Health', desc: 'Make informed decisions with data-driven insights about your nutrition and fitness.' },
    { icon: Clock, title: 'Save Time', desc: 'Quick logging, smart recommendations, and automated tracking mean less effort, more results.' },
    { icon: Users, title: 'Personalized', desc: 'Everything adapts to your body, goals, preferences, and activity level for maximum relevance.' },
    { icon: Award, title: 'Stay Motivated', desc: 'Challenges, achievement badges, and streak tracking keep you engaged and committed.' },
    { icon: Shield, title: 'Privacy First', desc: 'Your health data stays on your device. Full control over what you share and with whom.' },
    { icon: TrendingUp, title: 'Real Results', desc: 'See measurable progress with detailed charts, reports, and trend analysis over time.' },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'Meals Logged' },
    { value: '500+', label: 'Workout Plans' },
    { value: '98%', label: 'Satisfaction' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <LandingNav onLogin={onLogin} onGetStarted={onGetStarted} />

      {/* Hero */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Sparkles size={16} />
                AI-Powered Health Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                Your Smart Path to{' '}
                <span className="nn-gradient-text">Better Health</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
                NutriNova combines AI-driven nutrition tracking, personalized fitness plans, and real-time health insights to help you achieve your wellness goals — all in one beautiful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onGetStarted} className="nn-btn-primary text-base px-7 py-3.5 group">
                  Get Started Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={onLogin} className="nn-btn-secondary text-base px-7 py-3.5">
                  Login
                </button>
              </div>

              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full nn-gradient border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-sm font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Trusted by 50,000+ users</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/4662345/pexels-photo-4662345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Fitness and wellness"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 animate-slide-up hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Apple size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Calories Today</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">1,840 <span className="text-xs text-slate-400">/ 2,200</span></p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 animate-slide-up hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <Heart size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Health Score</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">87<span className="text-xs text-slate-400"> / 100</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold nn-gradient-text">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="nn-section-title mb-4">Everything You Need for Better Health</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Six powerful features that work together to give you a complete health and fitness management experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="nn-card nn-card-hover p-6 animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon size={24} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="nn-section-title mb-4">How NutriNova Works</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Four simple steps to transform your health journey from confusion to clarity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="nn-card p-6 h-full">
                  <div className="text-4xl font-bold nn-gradient-text mb-3">{step.num}</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center text-teal-400 z-10">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="about" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="nn-section-title mb-4">Why Choose NutriNova?</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              The benefits that make NutriNova the smartest choice for your health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <Icon size={22} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{benefit.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden nn-gradient p-12 md:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Your Health Journey Today
              </h2>
              <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their lives with NutriNova. It's free to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold rounded-xl px-7 py-3.5 hover:bg-teal-50 active:scale-95 transition-all shadow-lg"
                >
                  Create Free Account
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={onLogin}
                  className="inline-flex items-center justify-center gap-2 bg-teal-600/30 backdrop-blur text-white font-semibold rounded-xl px-7 py-3.5 hover:bg-teal-600/40 border border-white/30 transition-all"
                >
                  I Have an Account
                </button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-teal-50 text-sm">
                    <CheckCircle size={16} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
