import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, type TooltipProps } from 'recharts';
import { useDriverStandings } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
import './ChampionshipAnalytics.css';

interface ChartDataItem {
  name: string;
  points: number;
  fullName: string;
  team: string;
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
    ? standings.slice(0, 6).map((item) => ({
        name: item.Driver.code || item.Driver.familyName.slice(0, 3).toUpperCase(),
        points: parseInt(item.points, 10),
        fullName: `${item.Driver.givenName} ${item.Driver.familyName}`,
        team: item.Constructors[0]?.name || 'N/A',
      }))
    : [];

  const leader = chartData.length > 0 ? chartData[0] : null;

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
      {leader && (
        <div className="leader-info-block">
          <span className="leader-label">CHAMPIONSHIP LEADER</span>
          <span className="leader-name">{leader.fullName}</span>
          <div className="leader-pts-block">
            <span className="leader-pts-val">{leader.points}</span>
            <span className="leader-pts-lbl">PTS</span>
          </div>
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
