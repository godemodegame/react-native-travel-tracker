export type Theme = 'light' | 'dark';

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceAlt: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border colors
  border: string;
  borderLight: string;

  // Overlay
  overlay: string;

  // Card colors
  card: string;
  cardHighlight: string;
}

export const lightTheme: ThemeColors = {
  background: '#f2f2f7',
  surface: '#ffffff',
  surfaceAlt: '#f2f2f7',

  text: '#000000',
  textSecondary: '#6e6e73',
  textTertiary: '#8e8e93',

  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#E5F0FF',

  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

  border: '#c6c6c8',
  borderLight: '#e5e5ea',

  overlay: 'rgba(0, 0, 0, 0.4)',

  card: '#ffffff',
  cardHighlight: '#f2f2f7',
};

export const darkTheme: ThemeColors = {
  background: '#000000',
  surface: '#1c1c1e',
  surfaceAlt: '#2c2c2e',

  text: '#ffffff',
  textSecondary: '#aeaeb2',
  textTertiary: '#8e8e93',

  primary: '#0A84FF',
  primaryDark: '#0051D5',
  primaryLight: '#1e3a5f',

  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',

  border: '#38383a',
  borderLight: '#48484a',

  overlay: 'rgba(0, 0, 0, 0.6)',

  card: '#1c1c1e',
  cardHighlight: '#2c2c2e',
};

export const getTheme = (theme: Theme): ThemeColors => {
  return theme === 'dark' ? darkTheme : lightTheme;
};
