# WordBlock - Screen Time Management with Learning

A React Native app that helps users manage screen time by requiring learning sessions when device usage limits are reached.

## 🎯 Core Features Implemented

### ✅ **Blocking Flow** 
- **Configurable intervals**: 15, 20, 30, 60 minutes, or 1 day
- **Block Screen**: Shows when threshold is crossed with countdown timer
- **Learning Screen**: Requires 20 seconds minimum or "I learned it" confirmation
- **Platform-specific flows**:
  - Android: "Open & Learn" button directly launches learning screen
  - iOS: Notification-based flow (placeholder for DeviceActivity integration)

### ✅ **Word Management**
- **Word List Screen**: View, search, and filter words
- **Add/Delete words**: Full CRUD operations
- **Mark as learned**: Track learning progress
- **Search & Filter**: Client-side search by word/definition, filter by learned status

### ✅ **Statistics & Progress**
- **Comprehensive stats**: Total words, learned words, time spent, blocks triggered
- **Charts**: Progress charts, bar charts, line charts
- **Progress tracking**: Streaks, session analysis, learning efficiency

### ✅ **Storage & Data**
- **AsyncStorage**: Local persistence for all data
- **Word data**: 10+ sample words with difficulty levels
- **Progress tracking**: Study sessions, learning history
- **Settings**: Blocking intervals, app preferences

### ✅ **Android Screen Time Integration**
- **UsageStatsManager**: Native Kotlin implementation
- **Permission handling**: Usage access settings navigation
- **Usage tracking**: Current app usage, top apps, interval-based stats

## 🏗️ Architecture

### Clean Architecture Structure
```
src/
├── app/                    # App-level components
│   ├── navigation/         # Navigation setup
│   └── provider/          # Context providers
├── features/              # Feature modules
│   ├── charts/           # Chart components
│   └── statistics/       # Statistics components
├── native/               # Native bridge modules
│   └── android/          # Android native code
├── screens/              # Screen components
├── shared/               # Shared utilities
│   ├── lib/             # Core libraries
│   │   ├── configs/     # Configuration
│   │   ├── data/        # Data services
│   │   ├── services/    # Business logic services
│   │   ├── storage/     # Storage service
│   │   └── types/       # TypeScript types
│   ├── theme/           # Design system
│   └── ui/              # Reusable UI components
└── widgets/             # Widget components
```

### Key Services
- **StorageService**: AsyncStorage-based data persistence
- **BlockingService**: Screen time monitoring and blocking logic
- **WordDataService**: Word management and data operations

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- React Native 0.81.1
- Android Studio (for Android development)
- Xcode (for iOS development, optional)

### Installation
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Android Setup
1. Enable Developer Options on your device
2. Grant "Usage Access" permission to the app
3. The app will guide you to settings if permission is not granted

## 📱 Usage Flow

### 1. **Home Screen**
- View progress summary
- Access word list
- Configure settings
- Test blocking flow

### 2. **Word List**
- Browse all words with search and filters
- Mark words as learned
- Delete words
- View word details and difficulty

### 3. **Blocking Flow**
- **Trigger**: App detects screen time limit exceeded
- **Block Screen**: Shows countdown and learning requirement
- **Learning Screen**: 20-second minimum or confirmation required
- **Completion**: Returns to normal device usage

### 4. **Settings**
- Configure blocking intervals (15min - 1 day)
- Enable/disable blocking
- Manage notifications and sound
- Reset statistics or clear data

### 5. **Statistics**
- View comprehensive learning analytics
- Track progress over time
- Monitor blocking effectiveness
- Analyze learning patterns

## 🔧 Configuration

### Blocking Intervals
- 15 minutes
- 20 minutes  
- 30 minutes
- 1 hour
- 1 day

### Storage Choice: AsyncStorage
**Why AsyncStorage?**
- **Simplicity**: Easy to implement and debug
- **Performance**: Sufficient for word list and user data
- **Offline-first**: Works without internet connection
- **Cross-platform**: Consistent behavior on iOS and Android
- **No setup**: No database configuration required

**Alternative considerations:**
- **SQLite**: Better for complex queries and large datasets
- **Realm**: Good for real-time data and complex relationships
- **WatermelonDB**: Excellent for performance and offline sync

## 🧪 Testing the Blocking Flow

1. **Manual Test**: Use "Test Block Flow" button on home screen
2. **Simulated Blocking**: Blocking service simulates usage checks
3. **Learning Session**: Complete 20-second learning requirement
4. **Progress Tracking**: View statistics and learning history

## 📊 Current Status

### ✅ **Completed**
- [x] Blocking flow with configurable intervals
- [x] Learning screen with 20-second requirement
- [x] Word list with search and filters
- [x] Statistics and progress tracking
- [x] Settings and configuration
- [x] Android UsageStatsManager integration
- [x] Clean architecture implementation
- [x] AsyncStorage data persistence

### 🔄 **In Progress**
- [ ] iOS DeviceActivity/FamilyControls integration
- [ ] 10,000+ word dataset integration
- [ ] Performance optimization for large word lists

### 📋 **Future Enhancements**
- [ ] Backend sync and cloud storage
- [ ] Advanced analytics and insights
- [ ] Custom word difficulty algorithms
- [ ] Social features and sharing
- [ ] Gamification elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include device/OS information for bugs

---

**Note**: iOS DeviceActivity integration requires a real device for testing. The current implementation includes placeholder logic for iOS blocking flow.
