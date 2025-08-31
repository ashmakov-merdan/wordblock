import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, semanticColors } from '../../theme/colors';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  // Content
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Styling
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  
  // Custom styling
  style?: ViewStyle;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
  containerStyle,
  onPress,
  ...restProps
}) => {
  const isDisabled = disabled || loading;
  
  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  const subtitleStyles = [
    styles.subtitle,
    styles[`${size}Subtitle`],
    styles[`${variant}Subtitle`],
    isDisabled && styles.disabledText,
  ];

  const handlePress = isDisabled ? undefined : onPress;

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={buttonStyles}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isDisabled}
        {...restProps}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={getLoadingColor(variant)} 
          />
        ) : (
          <View style={styles.content}>
            {leftIcon && (
              <View style={styles.leftIcon}>
                {leftIcon}
              </View>
            )}
            
            <View style={styles.textContainer}>
              <Text style={textStyles}>{title}</Text>
              {subtitle && (
                <Text style={subtitleStyles}>{subtitle}</Text>
              )}
            </View>
            
            {rightIcon && (
              <View style={styles.rightIcon}>
                {rightIcon}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const getLoadingColor = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return semanticColors.textInverse;
    case 'secondary':
    case 'outline':
    case 'ghost':
      return semanticColors.textPrimary;
    case 'danger':
      return semanticColors.textInverse;
    case 'success':
      return semanticColors.textInverse;
    case 'warning':
      return semanticColors.textInverse;
    default:
      return semanticColors.textInverse;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },

  // Size variants
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },

  // Size text variants
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Size subtitle variants
  smallSubtitle: {
    fontSize: 10,
  },
  mediumSubtitle: {
    fontSize: 12,
  },
  largeSubtitle: {
    fontSize: 14,
  },

  // Primary variant
  primary: {
    backgroundColor: semanticColors.brand,
    shadowColor: semanticColors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryText: {
    color: semanticColors.textInverse,
  },
  primarySubtitle: {
    color: semanticColors.textInverse,
    opacity: 0.8,
  },

  // Secondary variant
  secondary: {
    backgroundColor: semanticColors.surface,
    borderWidth: 1,
    borderColor: semanticColors.borderLight,
    shadowColor: semanticColors.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  secondaryText: {
    color: semanticColors.textPrimary,
  },
  secondarySubtitle: {
    color: semanticColors.textSecondary,
  },

  // Outline variant
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: semanticColors.brand,
  },
  outlineText: {
    color: semanticColors.brand,
  },
  outlineSubtitle: {
    color: semanticColors.textSecondary,
  },

  // Ghost variant
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: semanticColors.brand,
  },
  ghostSubtitle: {
    color: semanticColors.textSecondary,
  },

  // Danger variant
  danger: {
    backgroundColor: semanticColors.error,
    shadowColor: colors.error[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerText: {
    color: semanticColors.textInverse,
  },
  dangerSubtitle: {
    color: semanticColors.textInverse,
    opacity: 0.8,
  },

  // Success variant
  success: {
    backgroundColor: semanticColors.success,
    shadowColor: colors.success[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    color: semanticColors.textInverse,
  },
  successSubtitle: {
    color: semanticColors.textInverse,
    opacity: 0.8,
  },

  // Warning variant
  warning: {
    backgroundColor: semanticColors.warning,
    shadowColor: colors.warning[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  warningText: {
    color: semanticColors.textInverse,
  },
  warningSubtitle: {
    color: semanticColors.textInverse,
    opacity: 0.8,
  },
});

Button.displayName = 'Button';

export default Button;