# Cleaner Air, Better Lives Dashboard

Interactive data visualization dashboard showcasing the economic value of linking climate action to public health in Edinburgh.

## Features

- 🎨 Modern, responsive design with green & blue theme (environment + health)
- 📖 **Scroll-based storytelling** with 5 narrative sections:
  - The Challenge (Understanding the problem)
  - Breathing Better (Air quality improvements)
  - Lives Changed (Health impact)
  - The Business Case (Economic benefits)
  - A Vision for Tomorrow (Future outlook)
- ✨ **Advanced animations**:
  - Scroll progress indicator
  - Intersection Observer animations
  - Parallax effects on charts
  - Floating particles
  - Shimmer effects on cards
  - Rotating icons with progress
- 📊 4 chart placeholders ready for data visualization:
  - Line chart for air quality trends
  - Bar chart for health impact comparison
  - Pie chart for economic value distribution
  - Area chart for regional comparison
- 🔍 Interactive filters (Year, Metric, Region)
- 📱 Fully responsive (desktop, tablet, mobile)
- 🎯 Clean UI focused on data storytelling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Main header with title & animated icons
│   ├── FilterPanel.jsx     # Year, metric, region filters
│   ├── StatsCards.jsx      # 4 key metrics cards with animations
│   ├── StorySection.jsx    # Scrolling storytelling sections
│   └── ChartContainer.jsx  # Reusable chart wrapper with parallax
├── App.jsx                 # Main app component with scroll tracking
├── App.css                 # App styles with scroll progress bar
├── main.jsx               # App entry point
└── index.css              # Global styles with smooth scroll
```

## Color Scheme

- Primary Green: `#2e7d32` (Climate/Environment)
- Primary Blue: `#1976d2` (Health/Water)
- Accent Green: `#66bb6a`
- Accent Orange: `#f57c00` (Economic)
- Accent Purple: `#7b1fa2` (Progress)
- Background: Light green-blue gradient

## Next Steps - Add Your Data

The dashboard is ready for your data! To populate the charts:

1. Add your data in a suitable format (CSV, JSON, or API)
2. Integrate Recharts components in `ChartContainer.jsx`
3. Update `StatsCards.jsx` with real metrics
4. Connect filters to data filtering logic

## Technologies

- React 18
- Vite
- Recharts (for charts)
- Lucide React (for icons)
