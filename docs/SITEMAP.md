# Mood Meter Tracker — App Sitemap

Single-page app (SPA). All routes use URL hashes after the welcome flow.

## Public URLs (`public/sitemap.xml`)

| URL | Tab | Purpose |
|-----|-----|---------|
| `/` | — | Landing; welcome screen for first visit |
| `/#track` | Track | Mood grid, quick log, streak, trends |
| `/#history` | History | Searchable mood entry list |
| `/#analytics` | Analytics | Charts and statistics |
| `/#insights` | Insights | Mood regulation tools (breathing, gratitude) |
| `/#settings` | Settings | Preferences, export/import, data management |

## First-visit flow

```
/ → WelcomeScreen → Get Started → /#track + OnboardingOverlay (first time)
```

## Track tab sections (top to bottom)

1. Mood grid + quick mood buttons + streak badge
2. Quadrant trends chart (7-day)
3. Recent reflections
4. Time-of-day patterns
5. Recent check-in chips

## Modals & overlays (not separate URLs)

- **MoodEntryModal** — note, activities, emotion word after grid selection
- **MoodPromptModal** — post-save quadrant prompt
- **ShiftCard** — regulation / breathing after prompt
- **FloatingCheckIn** — FAB returns to Track
- **Toast / BottomToast / Celebration** — feedback layers

## Static assets

- `/images/moodmeter.png` — branding
- `/sitemap.xml`, `/robots.txt` — SEO
