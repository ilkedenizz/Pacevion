import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, type TooltipProps } from 'recharts';
import { useDriverStandings } from '../../../hooks/useF1Data';
import ErrorState from '../../../components/ui/ErrorState';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
          <span className="tooltip-pts-lbl">POINTS</span>
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

  // Loading state
  if (isLoading) {
    return (
      <div className="analytics-container loading">
        <div className="analytics-header">
          <h3 className="analytics-title">Championship Standings Comparison</h3>
        </div>
        <div className="chart-skeleton">
          <div className="skeleton" style={{ width: '100%', height: '180px' }} />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="analytics-container error">
        <div className="analytics-header">
          <h3 className="analytics-title">Championship Standings Comparison</h3>
        </div>
        <ErrorState message="Could not load analytics." onRetry={refetch} />
      </div>
    );
  }

  // Main content
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h3 className="analytics-title">Driver Standings Comparison</h3>
        <Link to="/standings" className="view-all-link">
          <span>FULL STANDINGS</span>
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="chart-container" style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#8a8a8f"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#27272A' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
            <Bar 
              dataKey="points" 
              radius={[2, 2, 0, 0]} 
              isAnimationActive={true}
              animationDuration={600}
              label={{ position: 'top', fill: 'var(--color-text-primary)', fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-heading)' }}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? 'var(--color-accent)' : '#4a4a4c'}
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
