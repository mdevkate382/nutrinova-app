import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import Nutrition from '@/pages/Nutrition';
import Fitness from '@/pages/Fitness';
import Challenges from '@/pages/Challenges';
import BMICalculator from '@/pages/BMICalculator';
import Recommendations from '@/pages/Recommendations';
import Progress from '@/pages/Progress';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

type AppState = 'landing' | 'login' | 'signup';

function AppContent() {
  const { isAuthed, currentPage, navigate } = useApp();
  const [appState, setAppState] = useState<AppState>('landing');

  // If user becomes authed, we render the dashboard layout
  if (isAuthed) {
    return <AppLayout />;
  }

  // Landing page
  if (appState === 'landing') {
    return (
      <LandingPage
        onLogin={() => setAppState('login')}
        onGetStarted={() => setAppState('signup')}
      />
    );
  }

  // Auth pages
  return (
    <AuthPage
      mode={appState === 'login' ? 'login' : 'signup'}
      onBack={() => setAppState('landing')}
      onSwitch={() => setAppState(appState === 'login' ? 'signup' : 'login')}
    />
  );
}

function AppLayout() {
  const { currentPage, navigate } = useApp();

  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    nutrition: <Nutrition />,
    fitness: <Fitness />,
    recommendations: <Recommendations />,
    progress: <Progress />,
    challenges: <Challenges />,
    calculator: <BMICalculator />,
    notifications: <Notifications />,
    reports: <Reports />,
    profile: <Profile />,
    settings: <Settings />,
  };

  const page = pages[currentPage] || <Dashboard />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <Sidebar onNavigate={(p) => navigate(p)} />
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {page}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
