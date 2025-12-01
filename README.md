# Mood Meter Tracker

A comprehensive, interactive mood tracking web application built with React and Tailwind CSS. Track your emotional well-being with precision and gain valuable insights into your mood patterns over time.

## Features

### 🎯 Core Mood Tracking
- **Interactive Quadrant Grid**: 500x500px mood grid with four color-coded quadrants
  - 🟡 Yellow: High Energy + Pleasant (joyful, excited, energized, happy)
  - 🔴 Red: High Energy + Unpleasant (angry, frustrated, anxious, stressed)
  - 🔵 Blue: Low Energy + Unpleasant (sad, lonely, tired, depressed)
  - 🟢 Green: Low Energy + Pleasant (calm, peaceful, relaxed, content)
- Click anywhere on the grid to log your mood with exact coordinates
- Visual feedback on hover with smooth transitions

### 📊 Data Tracking & Persistence
- Uses `window.storage` API for data persistence
- Full CRUD operations (Create, Read, Update, Delete)
- Export data to CSV and JSON formats
- Import data from JSON files
- Delete all data option with confirmation

### 📝 Mood Logging Interface
- Modal interface after grid click with:
  - Selected mood position visualization
  - Optional note textarea (unlimited characters)
  - Activity tags: Work, Exercise, Social, Sleep, Eating, Commute, Entertainment, Other
  - Quick emotion word suggestions based on quadrant
  - Edit past entries from history view

### 📜 History & Timeline
- Chronological list of all mood entries (most recent first)
- Each entry shows: timestamp, mood dot, note preview, activity tags
- Advanced filters:
  - By date range (7/30/90 days, all time)
  - By quadrant
  - By activity
- Search functionality for notes
- Relative timestamps ("X days ago")
- Click to view full details or edit

### 📈 Analytics & Insights
- **Mood Distribution**: Pie chart showing % time in each quadrant
- **Mood Timeline**: Line chart showing energy and pleasantness over time
- **Heatmap Calendar**: GitHub-style contribution grid colored by daily mood
- **Time Patterns**: Bar chart showing mood by time of day
- **Statistics Cards**:
  - Total check-ins
  - Current streak (consecutive days)
  - Most common mood
  - Average energy level
  - Average pleasantness level

### 🧘 Mood Regulation Features
- **4-7-8 Breathing Exercise**: Interactive breathing timer with visual feedback
- **Gratitude Journal**: Prompts and space for gratitude entries
- **Coping Tools**: Personalized activity suggestions based on recent mood
- Contextual suggestions for Red and Blue quadrant moods

### 🎮 Gamification
- Check-in streak tracking
- Badge system:
  - First Check-in
  - 7-Day Streak
  - 30-Day Streak
  - 100 Check-ins
- Daily goal tracking
- Progress visualization

### ⚙️ Settings & Preferences
- Dark/light mode toggle
- Daily reminder settings with time picker
- Privacy mode (hide notes in preview)
- Customize activity tags
- Set daily check-in goals
- Data management (export, import, delete)

### 🎨 UI/UX
- Modern, clean interface with smooth animations
- Fully responsive (mobile, tablet, desktop)
- Tailwind CSS with custom color palette
- Tab-based navigation: Track | History | Analytics | Insights | Settings
- Floating "Check In" button always visible
- Dark mode support
- Loading states and empty states
- Welcome screen with onboarding

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
moodtracker/
├── src/
│   ├── components/
│   │   ├── Analytics.jsx          # Analytics dashboard with charts
│   │   ├── FloatingCheckIn.jsx    # Floating action button
│   │   ├── MoodEntryModal.jsx     # Mood logging modal
│   │   ├── MoodGrid.jsx           # Interactive mood grid
│   │   ├── MoodHistory.jsx        # History view with filters
│   │   ├── MoodRegulation.jsx     # Coping tools and exercises
│   │   ├── Navigation.jsx         # Main navigation
│   │   ├── Settings.jsx            # Settings page
│   │   ├── StreakBadge.jsx        # Streak and badges display
│   │   └── WelcomeScreen.jsx     # Onboarding screen
│   ├── utils/
│   │   ├── dateUtils.js           # Date formatting utilities
│   │   ├── exportUtils.js         # CSV/JSON export/import
│   │   ├── moodUtils.js           # Mood calculation utilities
│   │   └── storage.js             # window.storage API wrapper
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Data Storage

The app uses `window.storage` API for data persistence. Data is stored as JSON with the following keys:

- `mood-entries`: Array of all mood entries
- `user-preferences`: User settings and preferences
- `user-stats`: Statistics and badges
- `has-seen-welcome`: Welcome screen flag

## Technologies Used

- **React 18+**: UI framework with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for analytics
- **Lucide React**: Icon library
- **date-fns**: Date manipulation utilities
- **Vite**: Build tool and dev server

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

