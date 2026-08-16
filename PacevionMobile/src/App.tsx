import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomNav } from './components/navigation/BottomNav';

const queryClient = new QueryClient();

// Lazy load pages
const Home = lazy(() => import('./pages/Home').catch(() => ({ default: () => <div>Home Page (Not Implemented)</div> })));
const Calendar = lazy(() => import('./pages/Calendar').catch(() => ({ default: () => <div>Calendar Page (Not Implemented)</div> })));
const Standings = lazy(() => import('./pages/Standings').catch(() => ({ default: () => <div>Standings Page (Not Implemented)</div> })));
const Drivers = lazy(() => import('./pages/Drivers').catch(() => ({ default: () => <div>Drivers Page (Not Implemented)</div> })));
const More = lazy(() => import('./pages/More').catch(() => ({ default: () => <div>More Page (Not Implemented)</div> })));
const Cars = lazy(() => import('./pages/Cars').catch(() => ({ default: () => <div>Cars Page (Not Implemented)</div> })));
const Learn = lazy(() => import('./pages/LearnF1').catch(() => ({ default: () => <div>Learn Page (Not Implemented)</div> })));
const LiveFeed = lazy(() => import('./pages/LiveFeed').catch(() => ({ default: () => <div>Live Feed Page (Not Implemented)</div> })));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="loading-fallback" style={{ padding: '16px', color: '#fff' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/more" element={<More />} />
            <Route path="/more/cars" element={<Cars />} />
            <Route path="/more/learn" element={<Learn />} />
            <Route path="/more/live-feed" element={<LiveFeed />} />
          </Routes>
        </Suspense>
        <BottomNav />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
