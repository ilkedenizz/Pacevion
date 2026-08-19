import React from 'react';
import { useLatestRaceResults } from '../hooks/useF1Data';
import { getTeamDetails } from '../data/teamDetails';
import { getDriverVisual } from '../data/assets';
import './LiveFeed.css';

export const LiveFeed: React.FC = () => {
  const { data: latestRace, isLoading, isError } = useLatestRaceResults();

  if (isLoading) {
    return (
      <div className="live-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="editorial-label">LOADING LATEST SESSION...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="live-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="editorial-label">UNABLE TO LOAD LATEST SESSION</h2>
      </div>
    );
  }

  if (!latestRace) {
    return (
      <div className="live-page fade-in" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="editorial-label">NO COMPLETED SESSION</h2>
      </div>
    );
  }

  const winner = latestRace.Results.find(r => r.position === '1');
  const fastestLapEntry = latestRace.Results.find(r => r.FastestLap?.rank === '1');

  return (
    <div className="live-page fade-in">
      <header className="live-header">
        <div className="lh-top">
          <div className="lh-badge">
            <span className="font-mono">LATEST SESSION</span>
          </div>
          <span className="font-mono editorial-num" style={{ fontSize: '24px' }}>ROUND {latestRace.round}</span>
        </div>
        <h1 className="font-heading editorial-headline">{latestRace.season} {latestRace.raceName}</h1>
        <h2 className="editorial-label" style={{ marginTop: '8px', opacity: 0.7 }}>RACE CLASSIFICATION</h2>
      </header>

      <div className="live-telemetry">
        <div className="lt-box">
          <span className="editorial-label">RACE WINNER</span>
          <span className="font-heading editorial-headline" style={{ color: winner ? getTeamDetails(winner.Constructor.constructorId).color : '#fff' }}>
            {winner ? winner.Driver.familyName : '—'}
          </span>
        </div>
        <div className="lt-box">
          <span className="editorial-label">FASTEST LAP</span>
          <div className="lt-val-group">
            <span className="font-heading editorial-headline" style={{ color: fastestLapEntry ? getTeamDetails(fastestLapEntry.Constructor.constructorId).color : '#fff' }}>
              {fastestLapEntry ? fastestLapEntry.Driver.familyName : '—'}
            </span>
            <span className="font-mono lt-val">{fastestLapEntry?.FastestLap?.Time.time || '—'}</span>
          </div>
        </div>
        <div className="lt-box">
          <span className="editorial-label">TOTAL LAPS</span>
          <span className="font-mono lt-val">{winner?.laps || '—'}</span>
        </div>
      </div>

      <div className="live-timing-board">
        <div className="ltb-header editorial-label">
          <span className="ltb-pos">P</span>
          <span className="ltb-driver">DRIVER</span>
          <span className="ltb-time">TIME / STATUS</span>
          <span className="ltb-gap">GRID</span>
        </div>

        {latestRace.Results.map((result) => {
          const isWinner = result.position === '1';
          const isFastestLap = result.FastestLap?.rank === '1';
          const teamColor = getTeamDetails(result.Constructor.constructorId).color || '#333';
          
          let displayTime = result.status; // Default to status (e.g. 'Retired', '+1 Lap')
          if (result.Time?.time) {
            displayTime = result.Time.time;
          }

          return (
            <div key={result.Driver.driverId} className="ltb-row">
              <span className="ltb-pos font-mono">{result.positionText}</span>
              <div className="ltb-driver-col">
                <div className="ltb-color" style={{ background: teamColor }} />
                <img src={getDriverVisual(result.Driver.driverId, 'portrait')} className="ltb-avatar" alt={result.Driver.familyName} />
                <div className="ltb-names">
                  <span className="font-heading editorial-headline" style={{ color: isFastestLap ? '#C98EE8' : '#fff' }}>
                    {result.Driver.familyName}
                  </span>
                  <span className="editorial-label" style={{ opacity: 0.5 }}>{result.Constructor.name}</span>
                </div>
              </div>
              <span className="ltb-time font-mono" style={{ color: isWinner ? teamColor : '#ccc' }}>
                {displayTime}
              </span>
              <span className="ltb-gap font-mono">{result.grid === '0' ? 'PIT' : `P${result.grid}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveFeed;
