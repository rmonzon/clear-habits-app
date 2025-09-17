import { StatsCard } from '../StatsCard';
import { Target, TrendingUp, Flame, Calendar } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        title="Active Goals"
        value={12}
        description="Currently tracking"
        icon={Target}
      />
      <StatsCard 
        title="Completion Rate"
        value="85%"
        description="This month"
        icon={TrendingUp}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard 
        title="Longest Streak"
        value={28}
        description="days in a row"
        icon={Flame}
      />
      <StatsCard 
        title="Total Completions"
        value={156}
        description="All time"
        icon={Calendar}
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  );
}