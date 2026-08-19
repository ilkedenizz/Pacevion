import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as CapApp } from '@capacitor/app';
import { BottomNav } from './components/navigation/BottomNav';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 mins cache
      retry: 2,
    },
  },
});

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Standings = lazy(() => import('./pages/Standings'));
const Drivers = lazy(() => import('./pages/Drivers'));
const More = lazy(() => import('./pages/More'));
const Cars = lazy(() => import('./pages/Cars'));
const Learn = lazy(() => import('./pages/LearnF1'));
const LiveFeed = lazy(() => import('./pages/LiveFeed'));
const AboutPacevion = lazy(() => import('./pages/AboutPacevion'));
const DataSources = lazy(() => import('./pages/DataSources'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

function NavigationHandler() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Native Android Hardware Back Button listener
  useEffect(() => {
    const rootPaths = ['/', '/standings', '/live', '/drivers', '/cars', '/more', '/calendar'];

    const backListener = CapApp.addListener('backButton', () => {
      if (!rootPaths.includes(pathname)) {
        navigate(-1);
      } else {
        CapApp.exitApp();
      }
    });

    return () => {
      backListener.then((h) => h.remove()).catch(() => {});
    };
  }, [pathname, navigate]);

  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationHandler />
        <Suspense fallback={<div className="loading-fallback" style={{ padding: '16px', color: '#fff' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Redirect /home to / for safety */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/live" element={<LiveFeed />} />
            <Route path="/more" element={<More />} />
            
            {/* Kept nested routes just in case any internal links use them */}
            <Route path="/more/cars" element={<Navigate to="/cars" replace />} />
            <Route path="/more/live-feed" element={<Navigate to="/live" replace />} />
            
            <Route path="/more/learn" element={<Learn />} />
            <Route path="/more/about" element={<AboutPacevion />} />
            <Route path="/more/data-sources" element={<DataSources />} />
            <Route path="/more/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>
        <BottomNav />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
