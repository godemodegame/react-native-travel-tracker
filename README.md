# React Native Travel Tracker

A React Native application for tracking countries you've visited, built with Expo and TypeScript. Features iOS-style design, dark theme support, and comprehensive travel statistics.

## Features

- 🌍 Track visited countries and wishlist
- 📅 Record multiple visits with dates and notes
- 🚂 Track transportation methods (plane, train, car, bus)
- 📊 Comprehensive statistics and analytics
- 📖 Travel history timeline
- 💾 Persistent data storage (AsyncStorage)
- 🌗 Automatic dark/light theme based on system preferences
- 🎨 Native iOS design patterns

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the App

```bash
# Web
npm run web

# iOS
npm run ios

# Android
npm run android
```

## Deployment

### Vercel

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect the configuration
4. Deploy!

The app will be built using `expo export --platform web` and served from the `dist` directory.

### Manual Build

```bash
npm run build
```

This creates a production build in the `dist` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Main application screens
├── data/           # Static data and mock data
├── theme/          # Theme configuration and colors
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Technologies

- React Native
- Expo
- Expo Router (for navigation and static export)
- TypeScript
- React Context API (for theme management)
- AsyncStorage (for data persistence)

## License

Private
