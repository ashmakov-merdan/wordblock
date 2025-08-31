import { FC } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import Svg, { G, Rect, Text as SvgText } from "react-native-svg";
import { theme } from "shared/theme";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
};

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  width?: number;
  title?: string;
  subtitle?: string;
  maxValue?: number;
  showValues?: boolean;
  barSpacing?: number;
  barWidth?: number;
};

const { width: screenWidth } = Dimensions.get('window');

const BarChart: FC<BarChartProps> =({
  data,
  height = 200,
  width = screenWidth - 48,
  title,
  subtitle,
  maxValue,
  showValues = true,
  barSpacing = 8,
  barWidth = 40,
}) => {
  const chartHeight = height - 60; // Space for labels and values
  const chartWidth = width - 40; // Space for margins
  const availableWidth = chartWidth - (data.length - 1) * barSpacing;
  const calculatedBarWidth = Math.min(barWidth, availableWidth / data.length);
  
  const maxDataValue = maxValue || Math.max(...data.map(d => d.value));
  const scale = maxDataValue > 0 ? chartHeight / maxDataValue : 1;

  return (
    <View style={styles.container}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      
      <Svg width={width} height={height}>
        <G>
          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = item.value * scale;
            const x = 20 + index * (calculatedBarWidth + barSpacing);
            const y = chartHeight - barHeight + 20;
            
            return (
              <G key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={calculatedBarWidth}
                  height={barHeight}
                  fill={item.color || theme.semanticColors.brand}
                  rx={4}
                  ry={4}
                />
                
                {/* Value label */}
                {showValues && (
                  <SvgText
                    x={x + calculatedBarWidth / 2}
                    y={y - 8}
                    fontSize={12}
                    fontWeight="600"
                    textAnchor="middle"
                    fill={theme.semanticColors.textPrimary}
                  >
                    {item.value}
                  </SvgText>
                )}
                
                {/* X-axis label */}
                <SvgText
                  x={x + calculatedBarWidth / 2}
                  y={chartHeight + 35}
                  fontSize={12}
                  fontWeight="500"
                  textAnchor="middle"
                  fill={theme.semanticColors.textSecondary}
                >
                  {item.label}
                </SvgText>
              </G>
            );
          })}
          
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = 20 + (1 - ratio) * chartHeight;
            const value = Math.round(maxDataValue * ratio);
            
            return (
              <G key={`grid-${index}`}>
                <SvgText
                  x={10}
                  y={y + 4}
                  fontSize={10}
                  fontWeight="500"
                  textAnchor="end"
                  fill={theme.semanticColors.textTertiary}
                >
                  {value}
                </SvgText>
                <Rect
                  x={20}
                  y={y}
                  width={chartWidth}
                  height={1}
                  fill={theme.semanticColors.borderLight}
                  opacity={0.3}
                />
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    ...theme.typography.text.h4,
    color: theme.semanticColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.text.bodySmall,
    color: theme.semanticColors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
});

BarChart.displayName = 'BarChart';

export default BarChart;
