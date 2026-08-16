import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Radio, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useCalendar, useRaceResults } from '../hooks/useF1Data';
import CircuitTrack from '../components/common/CircuitTrack';
import type { Session } from '../api/types';
import './LiveFeed.css';

interface SessionItem {
  id: string;
  name: string;
  shortName: string;
  session?: Session;
  date?: string;
  time?: string;
}

export const LiveFeed: React.FC = () => {
  const navigate = useNavigate();
  const { data: calendar, isLoading: isCalLoading, error: calError, refetch: refetchCalendar } = useCalendar();

  const [selectedSessionId, setSelectedSessionId] = useState<string>('race');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const now = useMemo(() => new Date(), []);

  // Find current active or next upcoming GP
  const currentGP = useMemo(() => {
    if (!calendar || calendar.length === 0) {
      return null;
    }

    // Find first GP where race date/time is in the future
    const upcomingIndex = calendar.findIndex((r) => {
      const timeStr = r.time ? (r.time.endsWith('Z') ? r.time : `${r.time}Z`) : '00:00:00Z';
      return new Date(`${r.date}T${timeStr}`) > now;
    });

    if (upcomingIndex !== -1) {
      return calendar[upcomingIndex];
    }

    // Fallback to last GP of season
    return calendar[calendar.length - 1];
  }, [calendar, now]);

  // Extract sessions available for current GP
  const sessions: SessionItem[] = useMemo(() => {
    if (!currentGP) return [];

    const list: SessionItem[] = [];

    if (currentGP.FirstPractice) {
      list.push({
        id: 'fp1',
        name: 'PRACTICE 1',
        shortName: 'FP1',
        session: currentGP.FirstPractice,
        date: currentGP.FirstPractice.date,
        time: currentGP.FirstPractice.time,
      });
    }

    if (currentGP.SecondPractice) {
      list.push({
        id: 'fp2',
        name: 'PRACTICE 2',
        shortName: 'FP2',
        session: currentGP.SecondPractice,
        date: currentGP.SecondPractice.date,
        time: currentGP.SecondPractice.time,
      });
    }

    if (currentGP.ThirdPractice) {
      list.push({
        id: 'fp3',
        name: 'PRACTICE 3',
        shortName: 'FP3',
        session: currentGP.ThirdPractice,
        date: currentGP.ThirdPractice.date,
        time: currentGP.ThirdPractice.time,
      });
    }

    if (currentGP.SprintQualifying) {
      list.push({
        id: 'sprint_qualifying',
        name: 'SPRINT QUALIFYING',
        shortName: 'SQ',
        session: currentGP.SprintQualifying,
        date: currentGP.SprintQualifying.date,
        time: currentGP.SprintQualifying.time,
      });
    }

    if (currentGP.Sprint) {
      list.push({
        id: 'sprint',
        name: 'SPRINT RACE',
        shortName: 'SPRINT',
        session: currentGP.Sprint,
        date: currentGP.Sprint.date,
        time: currentGP.Sprint.time,
      });
    }

    if (currentGP.Qualifying) {
      list.push({
        id: 'qualifying',
        name: 'QUALIFYING',
        shortName: 'QUALI',
        session: currentGP.Qualifying,
        date: currentGP.Qualifying.date,
        time: currentGP.Qualifying.time,
      });
    }

    // Grand Prix Race Session
    list.push({
      id: 'race',
      name: 'GRAND PRIX RACE',
      shortName: 'RACE',
      date: currentGP.date,
      time: currentGP.time,
    });

    return list;
  }, [currentGP]);

  // Set default selected session to RACE or first available
  useEffect(() => {
    if (sessions.length > 0 && !sessions.find((s) => s.id === selectedSessionId)) {
      setSelectedSessionId(sessions[sessions.length - 1].id);
    }
  }, [sessions, selectedSessionId]);

  const selectedSession = useMemo(() => {
    return sessions.find((s) => s.id === selectedSessionId) || sessions[sessions.length - 1];
  }, [sessions, selectedSessionId]);

  // Calculate selected session status
  const sessionStatus = useMemo(() => {
    if (!selectedSession || !selectedSession.date) return 'UPCOMING';
    const timeStr = selectedSession.time
      ? selectedSession.time.endsWith('Z')
        ? selectedSession.time
        : `${selectedSession.time}Z`
      : '00:00:00Z';
    const startTime = new Date(`${selectedSession.date}T${timeStr}`).getTime();
    const endTime = startTime + 2 * 60 * 60 * 1000; // ~2 hours duration
    const currentTime = now.getTime();

    if (currentTime >= startTime && currentTime <= endTime) {
      return 'LIVE';
    } else if (currentTime > endTime) {
      return 'ENDED';
    }
    return 'UPCOMING';
  }, [selectedSession, now]);

  // Query Race Results if available
  const { data: raceResultsData } = useRaceResults(
    currentGP?.season || '2026',
    currentGP?.round || '1'
  );

  const resultsList = raceResultsData?.Results;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetchCalendar();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const formatLocalTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return 'TBA';
    const fullStr = timeStr
      ? timeStr.endsWith('Z')
        ? `${dateStr}T${timeStr}`
        : `${dateStr}T${timeStr}Z`
      : `${dateStr}T00:00:00Z`;
    const d = new Date(fullStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'TBA';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <div className="livefeed-dashboard">
      {/* Header */}
      <header className="livefeed-header">
        <div className="livefeed-header-top">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft size={22} />
          </button>
          <div className="livefeed-header-titles">
            <h1 className="brand-badge font-mono">LIVE RACE CENTER</h1>
            <p className="championship-sub font-mono">FORMULA 1 TELEMETRY & RESULTS</p>
          </div>
        </div>

        <button
          className={`refresh-action-btn font-mono ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleManualRefresh}
        >
          <RefreshCw size={12} /> REFRESH
        </button>
      </header>

      {/* Main Body */}
      {isCalLoading ? (
        <div className="skeleton-container">
          <div className="skeleton hero-skeleton" />
          <div className="skeleton nav-skeleton" />
          <div className="skeleton list-skeleton" />
        </div>
      ) : calError || !currentGP ? (
        <div className="error-card font-mono">
          <p>LIVE DATA UNAVAILABLE</p>
          <button className="retry-btn font-mono" onClick={handleManualRefresh}>
            <RefreshCw size={12} /> TRY AGAIN
          </button>
        </div>
      ) : (
        <>
          {/* CURRENT GRAND PRIX & SESSION HERO CARD */}
          <section className="live-hero-card">
            <div className="live-hero-top">
              <div className="status-indicator-badge font-mono">
                {sessionStatus === 'LIVE' ? (
                  <span className="badge-live">
                    <span className="live-pulsing-dot" /> LIVE SESSION
                  </span>
                ) : sessionStatus === 'ENDED' ? (
                  <span className="badge-ended">SESSION ENDED</span>
                ) : (
                  <span className="badge-upcoming">UPCOMING SESSION</span>
                )}
              </div>
              <span className="round-badge font-mono">RD {String(currentGP.round).padStart(2, '0')}</span>
            </div>

            <div className="live-hero-body">
              <div className="live-hero-info">
                <h2 className="gp-title font-heading">{currentGP.raceName}</h2>
                <div className="gp-meta font-mono">
                  <span className="gp-meta-item">
                    <MapPin size={12} className="icon-red" />
                    {currentGP.Circuit.Location.country}
                  </span>
                  <span className="gp-meta-item text-muted">{currentGP.Circuit.circuitName}</span>
                </div>

                <div className="selected-session-box font-mono">
                  <span className="ss-name">{selectedSession?.name}</span>
                  <div className="ss-time-row">
                    <span className="ss-time-item">
                      <CalendarIcon size={10} /> {formatDate(selectedSession?.date)}
                    </span>
                    <span className="ss-time-item">
                      <Clock size={10} /> {formatLocalTime(selectedSession?.date, selectedSession?.time)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Circuit Track SVG */}
              <div className="gp-track-container">
                <CircuitTrack
                  circuitId={currentGP.Circuit.circuitId}
                  circuitName={currentGP.Circuit.circuitName}
                  country={currentGP.Circuit.Location.country}
                  raceName={currentGP.raceName}
                  variant="hero"
                />
              </div>
            </div>
          </section>

          {/* WEEKEND SESSIONS NAV TABS */}
          {sessions.length > 0 && (
            <section className="sessions-nav-section">
              <span className="nav-section-lbl font-mono">RACE WEEKEND SESSIONS</span>
              <div className="sessions-tabs-scroll">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    className={`session-tab-btn font-mono ${selectedSessionId === s.id ? 'active' : ''}`}
                    onClick={() => setSelectedSessionId(s.id)}
                  >
                    {s.shortName}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* CLASSIFICATION OR LIVE TIMING STANDBY */}
          <section className="timing-feed-section">
            <div className="timing-feed-header">
              <h3 className="section-title font-mono">
                {selectedSessionId === 'race' && resultsList && resultsList.length > 0
                  ? 'RACE CLASSIFICATION'
                  : 'TIMING & TELEMETRY'}
              </h3>
            </div>

            {selectedSessionId === 'race' && resultsList && resultsList.length > 0 ? (
              <div className="classification-list">
                {resultsList.map((res) => (
                  <div key={res.position} className="classification-card">
                    <div className="class-pos font-mono">
                      {res.position === '1' ? (
                        <span className="pos-p1">P1</span>
                      ) : (
                        <span>P{res.position}</span>
                      )}
                    </div>

                    <div className="class-driver-details">
                      <span className="class-driver-name font-heading">
                        {res.Driver.givenName.charAt(0)}. <strong>{res.Driver.familyName}</strong>
                      </span>
                      <span className="class-team font-mono">{res.Constructor.name}</span>
                    </div>

                    <div className="class-stats font-mono">
                      <span className="class-laps">LAPS {res.laps}</span>
                      <span className="class-time">
                        {res.Time?.time || (res.position === '1' ? 'WINNER' : res.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="timing-standby-card">
                <div className="radio-icon-box">
                  <Radio size={36} className="radio-icon" />
                  <span className="radio-ping-dot" />
                </div>
                <h4 className="standby-title font-heading">LIVE TIMING STANDBY</h4>
                <p className="standby-desc font-mono">
                  Official live telemetry and sector speeds connect automatically during active Formula 1 sessions.
                </p>
                <div className="standby-status-pill font-mono">
                  {sessionStatus === 'LIVE' ? (
                    <span className="status-live-txt">CONNECTING TO LIVE FEED...</span>
                  ) : (
                    <span>AWAITING SESSION START</span>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default LiveFeed;
