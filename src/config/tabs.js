import { Home, History, TrendingUp, Heart, Settings } from 'lucide-react';

export const TAB_IDS = ['track', 'history', 'analytics', 'insights', 'settings'];

export const TABS = [
  {
    id: 'track',
    label: 'Track',
    icon: Home,
    pageTitle: 'Track your mood',
    pageDescription: 'Tap the mood meter or use a quick log button.',
    documentTitle: 'Track',
  },
  {
    id: 'history',
    label: 'History',
    icon: History,
    pageTitle: 'Mood history',
    pageDescription: 'Search and filter your past check-ins.',
    documentTitle: 'History',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: TrendingUp,
    pageTitle: 'Analytics',
    pageDescription: 'See patterns and trends over time.',
    documentTitle: 'Analytics',
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Heart,
    pageTitle: 'Insights',
    pageDescription: 'Breathing, gratitude, and regulation tools.',
    documentTitle: 'Insights',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    pageTitle: 'Settings',
    pageDescription: 'Appearance, reminders, and your data.',
    documentTitle: 'Settings',
  },
];

export function getTabMeta(tabId) {
  return TABS.find((t) => t.id === tabId) ?? TABS[0];
}
