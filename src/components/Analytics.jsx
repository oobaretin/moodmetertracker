import { useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Clock, Activity } from 'lucide-react';
import { getDateKey, getTimeOfDay, getDateRange } from '../utils/dateUtils';
import { getQuadrantColor, calculateStreak } from '../utils/moodUtils';
import EmptyState from './EmptyState';

export default function Analytics({ entries }) {
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        totalCheckIns: 0,
        streak: 0,
        mostCommonMood: null,
        avgEnergy: 0,
        avgPleasantness: 0,
        quadrantDistribution: { yellow: 0, red: 0, blue: 0, green: 0 },
        timePatterns: { morning: 0, afternoon: 0, evening: 0, night: 0 },
        timeline: [],
        heatmap: {},
      };
    }

    const quadrantCounts = { yellow: 0, red: 0, blue: 0, green: 0 };
    const timePatterns = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    let totalEnergy = 0;
    let totalPleasantness = 0;
    const heatmap = {};

    entries.forEach(entry => {
      quadrantCounts[entry.quadrant]++;
      totalEnergy += entry.energy;
      totalPleasantness += entry.pleasantness;
      
      const timeOfDay = getTimeOfDay(entry.timestamp);
      timePatterns[timeOfDay]++;

      const dateKey = getDateKey(entry.timestamp);
      if (!heatmap[dateKey]) {
        heatmap[dateKey] = { date: dateKey, count: 0, quadrants: { yellow: 0, red: 0, blue: 0, green: 0 } };
      }
      heatmap[dateKey].count++;
      heatmap[dateKey].quadrants[entry.quadrant]++;
    });

    const mostCommonMood = Object.entries(quadrantCounts).reduce((a, b) =>
      quadrantCounts[a[0]] > quadrantCounts[b[0]] ? a : b
    )[0];

    // Create timeline data (last 30 days)
    const timeline = [];
    const last30Days = getDateRange(30);
    const sortedEntries = [...entries]
      .filter(e => e.timestamp >= last30Days.start)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    sortedEntries.forEach(entry => {
      timeline.push({
        date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        energy: entry.energy,
        pleasantness: entry.pleasantness,
      });
    });

    return {
      totalCheckIns: entries.length,
      streak: calculateStreak(entries),
      mostCommonMood,
      avgEnergy: Math.round(totalEnergy / entries.length),
      avgPleasantness: Math.round(totalPleasantness / entries.length),
      quadrantDistribution: quadrantCounts,
      timePatterns,
      timeline,
      heatmap,
    };
  }, [entries]);

  const pieData = [
    { name: 'High Energy + Pleasant', value: stats.quadrantDistribution.yellow, color: '#FCD34D' },
    { name: 'High Energy + Unpleasant', value: stats.quadrantDistribution.red, color: '#F87171' },
    { name: 'Low Energy + Unpleasant', value: stats.quadrantDistribution.blue, color: '#60A5FA' },
    { name: 'Low Energy + Pleasant', value: stats.quadrantDistribution.green, color: '#34D399' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Morning', value: stats.timePatterns.morning },
    { name: 'Afternoon', value: stats.timePatterns.afternoon },
    { name: 'Evening', value: stats.timePatterns.evening },
    { name: 'Night', value: stats.timePatterns.night },
  ];

  if (entries.length === 0) {
    return <EmptyState type="analytics" />;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Check-ins</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalCheckIns}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.streak} days
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Most Common Mood</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-2 capitalize">
                {stats.mostCommonMood}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: getQuadrantColor(stats.mostCommonMood) }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Energy</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.avgEnergy}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Pleasantness</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.avgPleasantness}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Mood Distribution Pie Chart */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mood Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name, props) => {
                  const percent = props.payload.percent * 100;
                  return [`${value} entries (${percent.toFixed(1)}%)`, props.payload.name];
                }}
                labelFormatter={() => ''}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mood Timeline */}
      {stats.timeline.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mood Timeline (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Legend />
              <Line type="monotone" dataKey="energy" stroke="#FCD34D" strokeWidth={2} name="Energy" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pleasantness" stroke="#60A5FA" strokeWidth={2} name="Pleasantness" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Time Patterns */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Mood by Time of Day
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#111827' }}
                formatter={(value) => [`${value} check-ins`, '']}
              />
              <Bar dataKey="value" fill="#60A5FA" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap Calendar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Activity Heatmap (Last 30 Days)
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {Object.entries(stats.heatmap)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .slice(0, 30)
            .reverse()
            .map(([date, data]) => {
              const intensity = Math.min(data.count / 5, 1);
              const dominantQuadrant = Object.entries(data.quadrants).reduce((a, b) =>
                a[1] > b[1] ? a : b
              )[0];
              const color = getQuadrantColor(dominantQuadrant);
              
              return (
                <div
                  key={date}
                  className="aspect-square rounded border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:scale-110 hover:z-10 hover:shadow-lg relative group"
                  style={{
                    backgroundColor: color,
                    opacity: 0.3 + (intensity * 0.7),
                  }}
                  title={`${date}: ${data.count} check-ins`}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {data.count} {data.count === 1 ? 'entry' : 'entries'}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-gray-300" style={{ backgroundColor: getQuadrantColor('yellow'), opacity: 0.5 }} />
            <span>Less</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-gray-300" style={{ backgroundColor: getQuadrantColor('green'), opacity: 1 }} />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

