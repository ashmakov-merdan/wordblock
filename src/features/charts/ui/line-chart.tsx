import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText, Line } from 'react-native-svg';
import { theme } from 'shared/theme';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  height?: number;
  width?: number;
  title?: string;
  subtitle?: string;
  color?: string;
  showGrid?: boolean;
  showPoints?: boolean;
  showLabels?: boolean;
  smooth?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  width = screenWidth - 48,
  title,
  subtitle,
  color = theme.semanticColors.brand,
  showGrid = true,
  showPoints = true,
  showLabels = true,
  smooth = true,
}) => {
  const chartHeight = height - 60;
  const chartWidth = width - 40;
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = 20 + (index / (data.length - 1)) * chartWidth;
    const y = 20 + chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
    return { x, y, label: item.label, value: item.value };
  });

  // Create path for the line
  const createPath = () => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    if (smooth && points.length > 2) {
      // Create smooth curve
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        
        if (next) {
          const cp1x = prev.x + (curr.x - prev.x) * 0.5;
          const cp1y = prev.y;
          const cp2x = curr.x - (next.x - curr.x) * 0.5;
          const cp2y = curr.y;
          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        } else {
          path += ` L ${curr.x} ${curr.y}`;
        }
      }
    } else {
      // Create straight lines
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
      }
    }
    
    return path;
  };

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
          {/* Grid lines */}
          {showGrid && [0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = 20 + (1 - ratio) * chartHeight;
            const value = Math.round(minValue + valueRange * ratio);
            
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
                <Line
                  x1={20}
                  y1={y}
                  x2={20 + chartWidth}
                  y2={y}
                  stroke={theme.semanticColors.borderLight}
                  strokeWidth={1}
                  opacity={0.3}
                />
              </G>
            );
          })}
          
          {/* Line path */}
          <Path
            d={createPath()}
            stroke={color}
            strokeWidth={3}
            fill="transparent"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {showPoints && points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={color}
              stroke={theme.semanticColors.surface}
              strokeWidth={2}
            />
          ))}
          
          {/* Labels */}
          {showLabels && points.map((point, index) => (
            <SvgText
              key={`label-${index}`}
              x={point.x}
              y={height - 10}
              fontSize={10}
              fontWeight="500"
              textAnchor="middle"
              fill={theme.semanticColors.textSecondary}
            >
              {point.label}
            </SvgText>
          ))}
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

export default LineChart;
