# App Usage Statistics System

This system provides comprehensive tracking and analytics for app usage, including screen time, session duration, and usage patterns.

## 🚀 Features

### 1. **App Session Tracking**
- Automatically tracks when the app is opened and closed
- Records session duration and timing
- Tracks which screens were visited during each session

### 2. **Screen Time Analytics**
- Monitors time spent on each screen
- Records visit frequency and last visit timestamps
- Provides ranking of most-used screens

### 3. **Usage Pattern Analysis**
- Daily, weekly, and monthly usage trends
- Peak usage times and patterns
- Average session duration insights

## 📱 Components

### AppUsageCard
Displays overview of app usage statistics:
- Total app time
- Number of sessions
- Average session duration
- Most used screen
- Daily usage preview with mini charts

### AppUsageChart
Shows usage patterns over time:
- Daily usage (last 7 days)
- Weekly usage (last 6 weeks)
- Monthly usage (last 6 months)
- Interactive filters and summary statistics

### ScreenTimeBreakdown
Detailed breakdown of screen usage:
- Time spent per screen
- Visit counts
- Last visit timestamps
- Visual progress bars for comparison

## 🔧 Usage

### Basic Integration

```tsx
import { useAppUsageTracking } from 'entities/sessions';

const MyScreen = () => {
  // Automatically tracks screen usage
  useAppUsageTracking('MyScreen');
  
  return (
    // Your screen content
  );
};
```

### Manual Tracking (if needed)

```tsx
import { useStudySessionStore } from 'entities/sessions';

const MyScreen = () => {
  const { startAppSession, endAppSession, trackScreenEnter, trackScreenExit } = useStudySessionStore();
  
  useEffect(() => {
    startAppSession();
    trackScreenEnter('MyScreen');
    
    return () => {
      trackScreenExit('MyScreen');
      endAppSession();
    };
  }, []);
  
  return (
    // Your screen content
  );
};
```

## 📊 Data Structure

### AppSession
```typescript
interface IAppSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  screensVisited: string[];
  totalScreenTime: number;
}
```

### ScreenTime
```typescript
interface IScreenTime {
  screenName: string;
  timeSpent: number;
  visits: number;
  lastVisited: number;
}
```

### AppUsageStats
```typescript
interface IAppUsageStats {
  totalAppSessions: number;
  totalAppTime: number;
  averageSessionTime: number;
  mostUsedScreen: string;
  totalScreenVisits: number;
  dailyUsage: Array<{ date: string; time: number }>;
  weeklyUsage: Array<{ week: string; time: number }>;
  monthlyUsage: Array<{ month: string; time: number }>;
}
```

## 🎯 Best Practices

### 1. **Screen Naming**
Use consistent, descriptive screen names:
- `Home` instead of `Screen1`
- `WordList` instead of `List`
- `Settings` instead of `Config`

### 2. **Integration Points**
Add tracking to:
- Main navigation screens
- Modal screens
- Tab screens
- Any screen with significant user interaction

### 3. **Performance**
The system is designed to be lightweight:
- Data is persisted locally
- Minimal memory overhead
- Efficient data aggregation

## 🔄 Data Flow

1. **Screen Focus** → `trackScreenEnter()`
2. **Screen Blur** → `trackScreenExit()`
3. **App Background** → `endAppSession()`
4. **App Foreground** → `startAppSession()`
5. **Data Aggregation** → Real-time statistics

## 📈 Analytics Insights

### What You Can Track
- **User Engagement**: How long users stay in the app
- **Feature Usage**: Which screens are most popular
- **Session Patterns**: When and how often users return
- **Drop-off Points**: Where users tend to leave

### Use Cases
- **Product Development**: Identify most/least used features
- **User Experience**: Optimize navigation and screen flow
- **Retention Analysis**: Understand user behavior patterns
- **Performance Monitoring**: Track app usage over time

## 🛠️ Customization

### Adding New Metrics
Extend the `IAppUsageStats` interface and update the store methods to track additional data points.

### Custom Visualizations
Create new chart components using the existing data structures and theme system.

### Filtering and Sorting
Modify the existing filter logic or add new filter types for different data views.

## 🚨 Important Notes

- **Privacy**: All data is stored locally on the device
- **Battery**: Minimal impact on device battery life
- **Storage**: Data is automatically managed and persisted
- **Performance**: Designed for real-time updates without lag

## 🔍 Troubleshooting

### Common Issues
1. **No data showing**: Ensure `useAppUsageTracking` is called in your screen
2. **Incorrect timing**: Check that screen focus/blur events are working
3. **Missing screens**: Verify screen names are consistent across the app

### Debug Mode
Enable console logging in the store to see tracking events in real-time.
