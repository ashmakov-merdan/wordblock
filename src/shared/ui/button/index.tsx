import { IconWeight, Icon as PhosphorIcon } from "phosphor-react-native";
import { FC, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from "react-native";
import { colors } from "../../theme/colors";

// Button variants
type ButtonVariant = 'solid' | 'outlined' | 'ghost' | 'text';

// Button colors
type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';

// Button shapes
type ButtonShape = 'rounded' | 'pill' | 'square';

// Button sizes
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title?: string;
  subtitle?: string;
  icon?: PhosphorIcon;
  iconSize?: number;
  iconWeight?: IconWeight;
  onPress?: () => void;
  isIconOnly?: boolean;
  variant?: ButtonVariant;
  color?: ButtonColor;
  shape?: ButtonShape;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: FC<ButtonProps> = ({
  title,
  subtitle,
  icon,
  iconSize,
  iconWeight = 'regular',
  onPress,
  isIconOnly,
  variant = 'solid',
  color = 'primary',
  shape = 'rounded',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle
}) => {
  const Icon = icon;

  // Get dynamic icon size based on button size
  const getIconSize = () => {
    if (iconSize) return iconSize;
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 28;
      default: return 24;
    }
  };

  // Get button styles based on variant, color, shape, and size
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: size === 'sm' ? 8 : 16,
      borderWidth: variant === 'outlined' ? 1 : 0,
      paddingHorizontal: getPadding(),
      paddingVertical: getPadding(),
      minHeight: getMinHeight(),
      opacity: disabled ? 0.5 : 1,
    };

    // Add shape styles
    switch (shape) {
      case 'pill':
        baseStyles.borderRadius = 50;
        break;
      case 'square':
        baseStyles.borderRadius = 4;
        break;
      default: // rounded
        baseStyles.borderRadius = 12;
    }

    // Add width styles
    if (fullWidth) {
      baseStyles.width = '100%';
    }

    // Add variant and color styles
    const variantStyles = getVariantStyles(variant, color);

    return { ...baseStyles, ...variantStyles };
  };

  // Get text styles based on variant, color, and size
  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Add size styles
    switch (size) {
      case 'sm':
        baseStyles.fontSize = 14;
        break;
      case 'lg':
        baseStyles.fontSize = 20;
        break;
      default:
        baseStyles.fontSize = 18;
    }

    // Add variant and color styles
    const variantStyles = getTextVariantStyles(variant, color);

    return { ...baseStyles, ...variantStyles };
  };

  // Get subtitle styles
  const getSubtitleStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontWeight: '500',
      textAlign: 'center',
    };

    switch (size) {
      case 'sm':
        baseStyles.fontSize = 12;
        break;
      case 'lg':
        baseStyles.fontSize = 16;
        break;
      default:
        baseStyles.fontSize = 14;
    }

    const variantStyles = getTextVariantStyles(variant, color);
    variantStyles.opacity = 0.5;

    return { ...baseStyles, ...variantStyles };
  };

  const getPadding = useCallback(() => {
    switch (size) {
      case 'sm': return 12;
      case 'lg': return 24;
      default: return 16;
    }
  }, [size])

  const getMinHeight = () => {
    switch (size) {
      case 'sm': return 36;
      case 'lg': return 56;
      default: return 48;
    }
  };

  // Get variant styles
  const getVariantStyles = (variant: ButtonVariant, color: ButtonColor): ViewStyle => {
    const colorMap = {
      primary: colors.primary,
      secondary: colors.neutral,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      neutral: colors.gray,
    };

    const selectedColor = colorMap[color];

    switch (variant) {
      case 'solid':
        if (color === 'neutral') {
          return {
            backgroundColor: selectedColor[100],
          }
        };
        return {
          backgroundColor: selectedColor[500],
          borderColor: selectedColor[500],
        };
      case 'outlined':
        // Use darker border for neutral color for better contrast
        if (color === 'neutral') {
          return {
            backgroundColor: 'transparent',
            borderColor: selectedColor[200],
          };
        }
        return {
          backgroundColor: 'transparent',
          borderColor: selectedColor[500],
        };
      case 'ghost':
        return {
          backgroundColor: selectedColor[50],
          borderColor: 'transparent',
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  };

  // Get text variant styles
  const getTextVariantStyles = (variant: ButtonVariant, color: ButtonColor): TextStyle => {
    const colorMap = {
      primary: colors.primary,
      secondary: colors.neutral,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      neutral: colors.gray,
    };

    const selectedColor = colorMap[color];

    switch (variant) {
      case 'solid':
        if(color === 'neutral') {
          return {
            color: colors.text.primary,
          };
        };

        return {
          color: colors.text.inverse,
        };
      case 'outlined':
      case 'ghost':
      case 'text':
        // Use darker shades for better contrast, especially for neutral colors
        if (color === 'neutral') {
          return {
            color: selectedColor[700], // Use darker gray for better contrast
          };
        }
        return {
          color: selectedColor[500],
        };
      default:
        return {
          color: colors.text.primary,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled || loading}
    >
      {Icon && (
        <Icon
          size={getIconSize()}
          weight={iconWeight}
          color={getTextVariantStyles(variant, color).color as string}
        />
      )}
      {!isIconOnly && (
        <View style={styles.text}>
          {title && (
            <Text style={[getTextStyles(), textStyle]}>
              {loading ? 'Loading...' : title}
            </Text>
          )}
          {subtitle && (
            <Text style={getSubtitleStyles()}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    alignItems: 'center',
  },
});

Button.displayName = 'Button';

export default Button;
export type { ButtonProps, ButtonVariant, ButtonColor, ButtonShape, ButtonSize };