import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, type TooltipProps } from 'recharts';
import { useDriverStandings } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
import { getDriverVisual, getTeamVisual } from '../../../data/assets';
import './ChampionshipAnalytics.css';

interface ChartDataItem {
  name: string;
  points: number;
  fullName: string;
  team: string;
  id: string;
  teamId: string;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="custom-tooltip-analytics">
        <span className="tooltip-title">{data.fullName}</span>
        <span className="tooltip-team">{data.team}</span>
        <div className="tooltip-pts-row">
          <span className="tooltip-pts-val">{data.points}</span>
          <span className="tooltip-pts-lbl">PTS</span>
        </div>
      </div>
    );
  }
  return null;
};

const ChampionshipAnalytics: React.FC = () => {
  const { data: standings, isLoading, isError, refetch } = useDriverStandings();

  const chartData: ChartDataItem[] = standings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? standings.slice(0, 6).map((item: any) => ({
        name: item.Driver.code || item.Driver.familyName.slice(0, 3).toUpperCase(),
        points: parseInt(item.points, 10),
        fullName: `${item.Driver.givenName} ${item.Driver.familyName}`,
        team: item.Constructors[0]?.name || 'N/A',
        id: item.Driver.driverId,
        teamId: item.Constructors[0]?.constructorId || ''
      }))
    : [];

  const leaderData = chartData.length > 0 ? chartData[0] : null;
  const leaderVisual = leaderData ? getDriverVisual(leaderData.id, leaderData.teamId) : null;
  const leaderCarVisual = leaderData ? getTeamVisual(leaderData.teamId) : null;

  if (isLoading) {
    return (
      <div className="analytics-container loading">
        <div className="skeleton" style={{ width: '100%', height: '220px' }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="analytics-container error">
        <ErrorState message="Could not load analytics." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {leaderData && (
        <div className="leader-info-block">
          {leaderCarVisual && (
            <img src={leaderCarVisual} alt="Team Car" className="leader-car-bg" />
          )}
          <div className="leader-text">
            <span className="leader-label">CHAMPIONSHIP LEADER</span>
            <span className="leader-name">{leaderData.fullName}</span>
            <div className="leader-pts-block">
              <span className="leader-pts-val">{leaderData.points}</span>
              <span className="leader-pts-lbl">PTS</span>
            </div>
          </div>
          {leaderVisual && (
            <div className="leader-visual">
              <img src={leaderVisual} alt={leaderData.fullName} className="leader-img" />
            </div>
          )}
        </div>
      )}
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="var(--color-text-muted)"
              fontSize={10}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              tick={{ fill: 'var(--color-text-secondary)', fontWeight: 700 }}
              dy={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Bar 
              dataKey="points" 
              isAnimationActive={true}
              animationDuration={600}
              label={{ position: 'top', fill: 'var(--color-text-primary)', fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-heading)', dy: -5 }}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? 'var(--color-accent)' : 'var(--color-border)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChampionshipAnalytics;
