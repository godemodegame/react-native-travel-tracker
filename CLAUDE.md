# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React Native travel tracking application built with Expo and TypeScript. Users can mark countries as visited or on their wishlist, track multiple visits with flexible date granularity, and view their travel history.

## Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run web      # Web browser (requires react-dom and react-native-web)
npm run android  # Android emulator/device
npm run ios      # iOS simulator/device
```

## Architecture

### State Management Pattern

The app uses React's built-in state management with `useState` hooks. All state is managed in `App.tsx` (within `AppContent` component) and passed down to child components:

- `countryStatuses`: Record<string, CountryStatus> - Tracks visited/wishlist/none status per country
- `visitDates`: Record<string, VisitDate[]> - Stores all visit records with dates, transportation, and notes
- Active tab, search query, and navigation state are also managed here

State is lifted to the top level to enable data sharing across screens (main list, history timeline, country details).

### Navigation Pattern

Uses conditional rendering rather than a navigation library:
- `showHistoryScreen` boolean toggles between main screen and history timeline
- `showCountryDetail` boolean shows country detail modal
- Screens are rendered conditionally based on these flags

### Theme System

Implemented via React Context (`src/theme/ThemeContext.tsx`):
- Light and dark theme color definitions in `src/theme/colors.ts`
- All components use `useTheme()` hook to access current colors
- Styles are created dynamically via `createStyles(colors)` functions
- Theme toggle available in app header (moon/sun icon)

**Important**: When adding new components or modifying styles, always use theme colors via `useTheme()` hook. Never hardcode color values.

### Data Structure

#### Visit Dates
Supports flexible date granularity (year-only, year+month, or full date):
```typescript
interface VisitDate {
  id: string;
  arrivalDate: { year: number; month?: number; day?: number };
  departureDate?: { year: number; month?: number; day?: number };
  granularity: 'year' | 'month' | 'day';
  transportation?: 'plane' | 'train' | 'car' | 'bus';
  note?: string;
}
```

#### Country Data
195 countries organized into 22 detailed geographical subregions (Western Asia, Eastern Europe, etc.) defined in `src/data/countries.ts`.

### Mock Data

Development mode (`__DEV__`) automatically loads mock travel data from `src/data/mockTravelData.ts`. This data is NOT loaded in production builds. When adding new features that need sample data, update the mock data file.

### Component Organization

- **App.tsx**: Main container, state management, tab switching, country list with SectionList
- **src/screens/**: Full-screen views (HistoryScreen, CountryDetailScreen)
- **src/components/**: Reusable UI (CountryCard, DateModal, DatePicker)
- **src/data/**: Static data and mock data
- **src/theme/**: Theme system (colors, context)
- **src/types/**: TypeScript type definitions
- **src/utils/**: Utility functions (date formatting)

### Date Formatting

The `formatVisitDate()` utility in `src/utils/dateFormatter.ts` handles all date display logic, respecting the granularity field to show year-only, year+month, or full dates.

## Key Technical Details

### Country List Grouping
Uses React Native's `SectionList` to group countries by region with sticky headers. The grouping logic is in `App.tsx` using `useMemo` for performance.

### Modal-Based UI
DateModal uses React Native's `Modal` component with ScrollView to handle form inputs and list of existing visits.

### TypeScript
Strict typing throughout. Main types defined in `src/types/index.ts`. Use proper typing for all new code.

### Styling Pattern
All styles use `StyleSheet.create()` wrapped in a `createStyles(colors)` function that accepts theme colors. This pattern ensures theme support and better performance.
