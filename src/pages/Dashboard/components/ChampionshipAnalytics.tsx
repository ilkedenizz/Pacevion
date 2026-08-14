import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, type TooltipProps } from 'recharts';
import { useDriverStandings } from '../../../hooks/useF1Data';
import Card from '../../../components/ui/Card';
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
          <span className="tooltip-pts-lbl">POINTS</span>
        </div>
      </div>
    );
  }
  return null;
};

const ChampionshipAnalytics: React.FC = () => {
  const { data: standings, isLoading, isError, refetch } = useDriverStandings();

  if (isLoading) {
    return (
      <Card title="Championship Standings Comparison" className="analytics-card-loading">
        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="Championship Standings Comparison">
        <ErrorState message="Could not load analytics." onRetry={refetch} />
      </Card>
    );
  }

  const chartData: ChartDataItem[] = standings
    ? standings.slice(0, 6).map((item) => ({
        name: item.Driver.code || item.Driver.familyName.slice(0, 3).toUpperCase(),
        points: parseInt(item.points, 10),
        fullName: `${item.Driver.givenName} ${item.Driver.familyName}`,
        team: item.Constructors[0]?.name || 'N/A',
      }))
    : [];

  return (
    <Card title="Driver Standings Comparison" className="championship-analytics-card">
      <div className="chart-container" style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#8a8a8f"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#27272A' }}
            />
            <YAxis
              stroke="#8a8a8f"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#27272A' }}
              tickFormatter={(val) => String(val)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
            <Bar dataKey="points" radius={[2, 2, 0, 0]}>
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#e10600' : 'rgba(255, 255, 255, 0.15)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ChampionshipAnalytics;
