import React, { useMemo } from 'react';
import { getCircuitDetails } from '../data/circuitData';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { useParams, useNavigate } from 'react-router-dom';
import { useCalendar, useRaceResults, useQualifyingResults } from '../hooks/useF1Data';
import './RaceDetails.css';



const RaceDetails: React.FC = () => {
  const { season = '', round = '' } = useParams<{ season: string; round: string }>();
  const navigate = useNavigate();

  const { data: calendar, isLoading: calendarLoading, isError: calendarError } = useCalendar(season);
  const { data: raceResults, isLoading: resultsLoading, isError: resultsError } = useRaceResults(season, round);
  const { data: qualifyingResults, isLoading: qualyLoading } = useQualifyingResults(season, round);

  const raceInfo = useMemo(() => {
    if (!calendar || calendar.length === 0) return null;
    return calendar.find((r) => r.round === round) || null;
  }, [calendar, round]);

  const isCompleted = useMemo(() => {
    if (raceResults) return true;
    if (!raceInfo) return false;
    const now = new Date();
    const raceTimeStr = raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : `${raceInfo.time}Z`) : '00:00:00Z';
    const raceDate = new Date(`${raceInfo.date}T${raceTimeStr}`);
    return raceDate <= now;
  }, [raceResults, raceInfo]);

  

  const navigation = useMemo(() => {
    if (!calendar || calendar.length === 0) return { prev: null, next: null };
    const currentRoundIdx = calendar.findIndex(r => r.round === round);
    if (currentRoundIdx === -1) return { prev: null, next: null };
    return {
      prev: currentRoundIdx > 0 ? calendar[currentRoundIdx - 1] : null,
      next: currentRoundIdx < calendar.length - 1 ? calendar[currentRoundIdx + 1] : null
    };
  }, [calendar, round]);

  const isLoading = calendarLoading || resultsLoading || qualyLoading;

  if (isLoading) {
    return (
      <div className="race-details-page fade-in">
        <div className="skeleton" style={{ width: '100%', height: '300px' }} />
        <div className="skeleton" style={{ width: '100%', height: '400px', marginTop: '16px' }} />
      </div>
    );
  }

  if (calendarError || resultsError || !raceInfo) {
    return (
      <div className="race-details-page fade-in">
        <div className="rd-empty" style={{ marginTop: '50px' }}>
          Unable to load race details.
        </div>
      </div>
    );
  }

  let winnerStr = 'â€”';
  let poleStr = 'â€”';
  let fastestLapStr = 'â€”';
  let totalLapsStr = getCircuitDetails(raceInfo?.Circuit?.circuitId || '').laps.toString();

  if (raceResults?.Results && raceResults.Results.length > 0) {
    const winner = raceResults.Results.find(r => r.position === '1');
    if (winner) {
      winnerStr = `${winner.Driver.givenName} ${winner.Driver.familyName}`;
      
    }

    const fastest = raceResults.Results.find(r => r.FastestLap?.rank === '1');
    if (fastest) {
      fastestLapStr = `${fastest.Driver.givenName} ${fastest.Driver.familyName}`;
    }

    if (qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0) {
      const p1 = qualifyingResults.QualifyingResults[0];
      poleStr = `${p1.Driver.givenName} ${p1.Driver.familyName}`;
    } else {
      const gridP1 = raceResults.Results.find(r => r.grid === '1');
      if (gridP1) poleStr = `${gridP1.Driver.givenName} ${gridP1.Driver.familyName}`;
    }
  }

  return (
    <div className="race-details-page fade-in">
      <div className="rd-nav">
        <button 
          className="rd-nav-btn" 
          disabled={!navigation.prev} 
          onClick={() => navigation.prev && navigate(`/races/${season}/${navigation.prev.round}`)
}
        >
          â† PREVIOUS
        </button>
        <button 
          className="rd-nav-btn" 
          disabled={!navigation.next} 
          onClick={() => navigation.next && navigate(`/races/${season}/${navigation.next.round}`)}
        >
          NEXT â†’
        </button>
      </div>

      <div className="rd-header">
        <div className="rd-status-row font-mono">
          <span className="rd-round">ROUND {round}</span>
          <span className={`rd-status ${isCompleted ? 'completed' : 'upcoming'}`}>
            {isCompleted ? 'COMPLETED' : 'UPCOMING'}
          </span>
        </div>
        <h1 className="rd-title font-heading">{raceInfo.raceName}</h1>
        <div className="rd-circuit">{raceInfo.Circuit.circuitName}</div>
        <div className="rd-datetime font-mono">
          {raceInfo.date} â€˜ {raceInfo.time ? raceInfo.time.replace('Z', ' UTC') : ''}
        </div>
      </div>

       {isCompleted && raceResults?.Results ? (
        <>
          <div className="rd-summary">
            <div className="rd-summary-item">
              <span className="rd-sum-label">WINNER</span>
              <span className="rd-sum-value winner">{winnerStr}</span>
            </div>
            <div className="rd-summary-item">
              <span className="rd-sum-label">POLE</span>
              <span className="rd-sum-value">{poleStr}</span>
            </div>
            <div className="rd-summary-item">
              <span className="rd-sum-label">FASTEST LAP</span>
              <span className="rd-sum-value">{fastestLapStr}</span>
            </div>
            <div className="rd-summary-item">
              <span className="rd-sum-label">LAPS</span>
              <span className="rd-sum-value font-mono">{totalLapsStr}</span>
            </div>
          </div>

          <div className="rd-section">
            <h2 className="rd-section-title font-heading">RACE CLASSIFICATION</h2>
            <div className="rd-table-wrapper">
              <table className="rd-table">
                <thead>
                  <tr>
                    <th>POS</th>
                    <th>DRIVER</th>
                    <th>TEAM</th>
                    <th>GRID</th>
                    <th>FINISH</th>
                    <th>CHANGE</th>
                    <th>PTS</th>
                    <th>TIME/STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {raceResults.Results.map(res => {
                    const grid = parseInt(res.grid);
                    const pos = parseInt(res.position);
                    let changeStr = 'â€”';
                    let trendClass = 'same';
                    
                    if (grid > 0 && pos > 0) {
                      const change = grid - pos;
                      if (change > 0) {
                        changeStr = `â†${change}`;
                        trendClass = 'up';
                      } else if (change < 0) {
                        changeStr = `%i${Math.abs(change)}`;
                        trendClass = 'down';
                      }
                    }

                    return (
                      <tr key={res.Driver.driverId}>
                        <td className="rd-pos font-mono">{res.position}</td>
                        <td style={{ fontWeight: 600 }}>{res.Driver.givenName} {res.Driver.familyName}</td>
                        <td className="rd-team">{res.Constructor.name}</td>
                        <td className="font-mono">{res.grid}</td>
                        <td className="font-mono">{res.position}</td>
                        <td className={`rd-trend font-mono ${trendClass}`}>{res.grid === '0' ? 'PIT' : changeStr}</td>
                        <td className="rd-pts font-mono">{res.points}</td>
                        <td className="font-mono">{res.Time?.time || res.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {(() => {
            const flResult = raceResults.Results.find(r => r.FastestLap?.rank === '1');
            if (flResult && flResult.FastestLap) {
              return (
                <div className="rd-section">
                  <h2 className="rd-section-title font-heading">FASTEST LAP</h2>
                  <div className="rd-fastest-lap">
                    <div>
                      <div className="rd-fl-driver">{flResult.Driver.givenName} {flResult.Driver.familyName}</div>
                      <div className="rd-fl-meta">Lap {flResult.FastestLap.lap} â€˜ {flResult.FastestLap.AverageSpeed?.speed} {flResult.FastestLap.AverageSpeed?.units}</div>
                    </div>
                    <div className="rd-fl-time">{flResult.FastestLap.Time.time}</div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {qualifyingResults?.QualifyingResults && qualifyingResults.QualifyingResults.length > 0 && (
            <div className="rd-section">
              <h2 className="rd-section-title font-heading">QUALIFYING</h2>
              <div className="rd-table-wrapper">
                <table className="rd-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>DRIVER</th>
                      <th>Q1</th>
                      <th>Q2</th>
                      <th>Q3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualifyingResults.QualifyingResults.map(res => (
                      <tr key={res.Driver.driverId}>
                        <td className="rd-pos font-mono">{res.position}</td>
                        <td style={{ fontWeight: 600 }}>{res.Driver.givenName} {res.Driver.familyName}</td>
                        <td className="font-mono">{res.Q1 || 'â€”'}</td>
                        <td className="font-mono">{res.Q2 || 'â€”'}</td>
                        <td className="font-mono">{res.Q3 || 'â€”'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rd-section">
          <div className="rd-upcoming-box">
            <h2 className="editorial-headline" style={{ fontSize: '20px', marginBottom: '8px' }}>UPCOMING RACE</h2>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              {raceInfo.Circuit.circuitName}<br/>
              {raceInfo.date} â€˜ {raceInfo.time ? raceInfo.time.replace('Z', ' UTC') : ''}
            </div>
            
            {!isCompleted && raceInfo && (
  <CountdownTimer 
    targetDate={`${raceInfo.date}T${raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : raceInfo.time + 'Z') : '00:00:00Z'}`}
    className="rd-countdown"
  />
)}
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceDetails;
