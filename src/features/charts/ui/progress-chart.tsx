import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { theme } from 'shared/theme';

interface ProgressChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
  color?: string;
}

const { width: screenWidth } = Dimensions.get('window');

const ProgressChart: React.FC<ProgressChartProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  title,
  subtitle,
  color = theme.semanticColors.brand,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.semanticColors.borderLight}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
        {/* Center text */}
        <SvgText
          x={center}
          y={center - 8}
          fontSize={size * 0.2}
          fontWeight="700"
          textAnchor="middle"
          fill={theme.semanticColors.textPrimary}
        >
          {Math.round(percentage)}%
        </SvgText>
      </Svg>
      {(title || subtitle) && (
        <View style={styles.textContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: theme.spacing[3],
  },
  title: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.text.caption,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
});

export default ProgressChart;
