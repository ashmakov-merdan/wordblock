export const colors = {
  // Primary colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#007AFF', // Main brand color
    600: '#1976D2',
    700: '#1565C0',
    800: '#0D47A1',
    900: '#0A3D91',
  },

  // Success colors
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#34C759', // Main success color
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Warning colors
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FF9500', // Main warning color
    600: '#FF8F00',
    700: '#FF6F00',
    800: '#E65100',
    900: '#BF360C',
  },

  // Error colors
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#FF3B30', // Main error color
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  // Purple colors (for statistics)
  purple: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#AF52DE', // Main purple color
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },

  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Gray colors (iOS-style)
  gray: {
    50: '#F2F2F7',
    100: '#E5E5EA',
    200: '#D1D1D6',
    300: '#C7C7CC',
    400: '#AEAEB2',
    500: '#8E8E93',
    600: '#6D6D70',
    700: '#48484A',
    800: '#3A3A3C',
    900: '#1C1C1E',
  },

  // Background colors
  background: {
    primary: '#F2F2F7',
    secondary: '#FFFFFF',
    tertiary: '#F8F9FA',
    card: '#FFFFFF',
    modal: '#FFFFFF',
  },

  // Text colors
  text: {
    primary: '#1C1C1E',
    secondary: '#6D6D70',
    tertiary: '#8E8E93',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#E5E5EA',
    medium: '#C7C7CC',
    dark: '#8E8E93',
  },

  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.12)',
    dark: 'rgba(0, 0, 0, 0.15)',
    primary: 'rgba(0, 122, 255, 0.3)',
  },
} as const;

// Semantic color aliases for easy access
export const semanticColors = {
  // Brand colors
  brand: colors.primary[500],
  brandLight: colors.primary[100],
  brandDark: colors.primary[700],

  // Status colors
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  info: colors.primary[500],

  // UI colors
  background: colors.background.primary,
  surface: colors.background.secondary,
  card: colors.background.card,
  modal: colors.background.modal,

  // Text colors
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,
  textTertiary: colors.text.tertiary,
  textDisabled: colors.text.disabled,
  textInverse: colors.text.inverse,

  // Border colors
  borderLight: colors.border.light,
  borderMedium: colors.border.medium,
  borderDark: colors.border.dark,

  // Shadow colors
  shadowLight: colors.shadow.light,
  shadowMedium: colors.shadow.medium,
  shadowDark: colors.shadow.dark,
  shadowPrimary: colors.shadow.primary,
} as const;

export type ColorScheme = typeof colors;
export type SemanticColors = typeof semanticColors;
