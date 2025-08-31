import { colors, semanticColors } from './colors';

export const theme = {
  colors,
  semanticColors,

  // Typography
  typography: {
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
      '6xl': 48,
    },

    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },

    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },

    // Letter spacing
    letterSpacing: {
      tight: -0.8,
      normal: 0,
      wide: 0.2,
      wider: 0.3,
    },

    // Text styles
    text: {
      h1: {
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -0.8,
      },
      h2: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
      },
      h3: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.3,
      },
      h4: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: -0.2,
      },
      body: {
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0,
      },
      bodyLarge: {
        fontSize: 18,
        fontWeight: '400',
        letterSpacing: 0.1,
      },
      bodySmall: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.1,
      },
      caption: {
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.2,
      },
      button: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.2,
      },
      buttonLarge: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
      },
    },
  },

  // Spacing
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },

  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },

  // Shadows
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: colors.shadow.light,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 6,
    },
    xl: {
      shadowColor: colors.shadow.dark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 8,
    },
    primary: {
      shadowColor: colors.shadow.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 6,
    },
  },

  // Layout
  layout: {
    // Screen padding
    screenPadding: 20,

    // Card padding
    cardPadding: 24,

    // Button padding
    buttonPadding: {
      sm: { horizontal: 12, vertical: 8 },
      base: { horizontal: 16, vertical: 12 },
      lg: { horizontal: 20, vertical: 16 },
      xl: { horizontal: 24, vertical: 18 },
    },

    // Container max widths
    containerMaxWidth: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // Animation
  animation: {
    duration: {
      fast: 150,
      base: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Z-index
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof theme;

// Helper function to get theme values
export const getThemeValue = (path: string) => {
  const keys = path.split('.');
  let value: any = theme;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Theme value not found: ${path}`);
      return undefined;
    }
  }

  return value;
};

// Export individual theme sections for convenience
export const { colors: themeColors, semanticColors: themeSemanticColors } =
  theme;
export const {
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  animation,
  zIndex,
} = theme;
