import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import Loader from '../components/ui/Loader';

const DashboardPage = lazy(() => import('../pages/Dashboard'));
const RaceCalendarPage = lazy(() => import('../pages/RaceCalendar'));
const RaceDetailsPage = lazy(() => import('../pages/RaceDetails'));
const DriversPage = lazy(() => import('../pages/Drivers'));
const DriverProfilePage = lazy(() => import('../pages/DriverProfile'));
const ConstructorsPage = lazy(() => import('../pages/Constructors'));
const StandingsPage = lazy(() => import('../pages/Standings'));

const Router: React.FC = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route
        path="/"
        element={
          <Suspense fallback={<div className="page-loader-suspense"><Loader size={36} /></div>}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path="/calendar"
        element={
          <Suspense fallback={<div className="page-loader-suspense"><Loader size={36} /></div>}>
            <RaceCalendarPage />
          </Suspense>
        }
      />
      <Route
        path="/races/:season/:round"
        element={
          <Suspense fallback={<div className="page-loader-suspense"><Loader size={36} /></div>}>
            <RaceDetailsPage />
          </Suspense>
        }
      />
      <Route
        path="/drivers"
        element={
          <Suspense fallback={<div className="page-loader-suspense"><Loader size={36} /></div>}>
            <DriversPage />
          </Suspense>
        }
      />
      <Route
        path="/drivers/:driverId"
        element={
          <Suspense fallback={<div className="page-loader-suspense"><Loader size={36} /></div>}>
            <DriverProfilePage />
          </Suspense>
        }
      />
      <Route
        path="/constructors"
        element={
          <Suspense fallback={<div className="page-loader-suspense"><Loader size={36} /></div>}>
            <ConstructorsPage />
          </Suspense>
        }
      />
      <Route
        path="/standings"
        element={
          <Suspense fallback={<div className="page-loader-suspense"><Loader size={36} /></div>}>
            <StandingsPage />
          </Suspense>
        }
      />
    </Route>
  </Routes>
);

export default Router;
