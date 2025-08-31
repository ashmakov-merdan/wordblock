export const colors = {
  primary: {  
    calmBlue: '#3A7CA5',
    softSky: '#9EC9E2',
  },

  secondary: {
    mintGreen: '#71C9B8',
    goldenSand: '#E8C07D',
  },

  neutral: {
    snowWhite: '#F9FAFB',
    coolGray: '#E5E7EB',
    slateGray: '#374151',
    ashGray: '#6B7280',
  },

  feedback: {
    success: '#4CAF50',
    warning: '#F59E0B',
    error: '#EF4444',
  },
} as const;

export const semanticColors = {
  brand: {
    primary: colors.primary.calmBlue,
    secondary: colors.primary.softSky,
  },

  text: {
    primary: colors.neutral.slateGray,
    secondary: colors.neutral.ashGray,
    inverse: colors.neutral.snowWhite,
  },

  background: {
    primary: colors.neutral.snowWhite,
    secondary: colors.neutral.coolGray,
    accent: colors.primary.softSky,
  },

  interactive: {
    primary: colors.primary.calmBlue,
    secondary: colors.secondary.mintGreen,
    highlight: colors.secondary.goldenSand,
  },

  status: {
    success: colors.feedback.success,
    warning: colors.feedback.warning,
    error: colors.feedback.error,
  },

  border: {
    primary: colors.neutral.coolGray,
    secondary: colors.primary.softSky,
  },
} as const;

export type ColorPalette = typeof colors;
export type SemanticColors = typeof semanticColors;
