import { useState, useMemo } from 'react';
import { Search, Filter, Edit2, Trash2, Calendar, X } from 'lucide-react';
import { formatTimestamp, getDateKey, getTimeOfDay } from '../utils/dateUtils';
import { getQuadrantColor } from '../utils/moodUtils';
import { deleteMoodEntry } from '../utils/storage';
import EmptyState from './EmptyState';

export default function MoodHistory({ entries, onEdit, onDelete, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEntries = useMemo(() => {
    let filtered = [...entries].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        (entry.note || '').toLowerCase().includes(query) ||
        (entry.selectedEmotion || '').toLowerCase().includes(query)
      );
    }

    // Quadrant filter
    if (selectedQuadrant !== 'all') {
      filtered = filtered.filter(entry => entry.quadrant === selectedQuadrant);
    }

    // Activity filter
    if (selectedActivity !== 'all') {
      filtered = filtered.filter(entry =>
        (entry.activities || []).includes(selectedActivity)
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= cutoff);
    }

    return filtered;
  }, [entries, searchQuery, selectedQuadrant, selectedActivity, dateRange]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteMoodEntry(id);
      onRefresh();
    }
  };

  const activities = ['work', 'exercise', 'social', 'sleep', 'eating', 'commute', 'entertainment', 'other'];
  const quadrants = ['all', 'yellow', 'red', 'blue', 'green'];

  if (entries.length === 0) {
    return <EmptyState type="history" />;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes and emotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>

        {showFilters && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={() => {
                  setSelectedQuadrant('all');
                  setSelectedActivity('all');
                  setDateRange('all');
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quadrant
              </label>
              <select
                value={selectedQuadrant}
                onChange={(e) => setSelectedQuadrant(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Quadrants</option>
                <option value="yellow">High Energy + Pleasant</option>
                <option value="red">High Energy + Unpleasant</option>
                <option value="blue">Low Energy + Unpleasant</option>
                <option value="green">Low Energy + Pleasant</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activity
              </label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Activities</option>
                {activities.map(activity => (
                  <option key={activity} value={activity}>
                    {activity.charAt(0).toUpperCase() + activity.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredEntries.length} of {entries.length} entries
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <EmptyState 
            type="search" 
            onAction={() => {
              setSearchQuery('');
              setSelectedQuadrant('all');
              setSelectedActivity('all');
              setDateRange('all');
            }}
          />
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: getQuadrantColor(entry.quadrant) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeOfDay(entry.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        E: {entry.energy}% | P: {entry.pleasantness}%
                      </span>
                    </div>
                  </div>

                  {entry.selectedEmotion && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm font-medium">
                        {entry.selectedEmotion}
                      </span>
                    </div>
                  )}

                  {entry.note && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                      {entry.note}
                    </p>
                  )}

                  {entry.activities && entry.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.activities.map(activity => (
                        <span
                          key={activity}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onEdit(entry)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

