import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard';
import RaceCalendarPage from '../pages/RaceCalendar';
import RaceDetailsPage from '../pages/RaceDetails';
import DriversPage from '../pages/Drivers';
import DriverProfilePage from '../pages/DriverProfile';
import ConstructorsPage from '../pages/Constructors';
import StandingsPage from '../pages/Standings';

const Router: React.FC = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/calendar" element={<RaceCalendarPage />} />
    <Route path="/races/:season/:round" element={<RaceDetailsPage />} />
    <Route path="/drivers" element={<DriversPage />} />
    <Route path="/drivers/:driverId" element={<DriverProfilePage />} />
    <Route path="/constructors" element={<ConstructorsPage />} />
    <Route path="/standings" element={<StandingsPage />} />
  </Routes>
);

export default Router;
