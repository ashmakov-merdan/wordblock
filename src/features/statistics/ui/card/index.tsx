import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  color = '#007AFF',
  size = 'medium',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          card: styles.smallCard,
          title: styles.smallTitle,
          value: styles.smallValue,
          subtitle: styles.smallSubtitle,
        };
      case 'large':
        return {
          card: styles.largeCard,
          title: styles.largeTitle,
          value: styles.largeValue,
          subtitle: styles.largeSubtitle,
        };
      default:
        return {
          card: styles.mediumCard,
          title: styles.mediumTitle,
          value: styles.mediumValue,
          subtitle: styles.mediumSubtitle,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[sizeStyles.card, { borderLeftColor: color }]}>
      <Text style={sizeStyles.title}>{title}</Text>
      <Text style={[sizeStyles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={sizeStyles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  // Small size
  smallCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  smallTitle: {
    fontSize: 13,
    color: '#6D6D70',
    marginBottom: 4,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  smallValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  smallSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '400',
  },

  // Medium size (default)
  mediumCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  mediumTitle: {
    fontSize: 15,
    color: '#6D6D70',
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  mediumValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: -0.5,
  },
  mediumSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },

  // Large size
  largeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  largeTitle: {
    fontSize: 17,
    color: '#6D6D70',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  largeValue: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  largeSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
});

export default StatisticsCard;
