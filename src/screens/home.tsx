import { View, StyleSheet, ScrollView, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Button } from "shared/ui";
import React, { useCallback, useState } from "react";
import { SummaryList } from "features/summary";
import logo from 'shared/assets/images/logo.png';
import { GearSixIcon } from "phosphor-react-native";
import { HeroDescription, WordBlocks } from "features/hero";
import { theme } from "shared/theme";
import { useWordsStore, populateWithMockData } from "entities/words";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [_refreshKey, setRefreshKey] = useState(0);
  const { addWord, words, clearAllWords } = useWordsStore();

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const handleStartLearning = () => {
    navigation.navigate('WordList' as never);
  };

  const handleViewStatistics = useCallback(() => {
    navigation.navigate('Statistics' as never);
  }, [navigation]);

  const handleSettings = useCallback(() => {
    navigation.navigate('Settings' as never);
  }, [navigation]);

  const handleAddMockData = useCallback(() => {
    populateWithMockData(addWord);
  }, [addWord]);

  const handleClearMockData = useCallback(() => {
    clearAllWords();
  }, [clearAllWords]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Image
            source={logo}
            alt={'logo'}
            style={styles.logo}
          />
          <Button
            icon={GearSixIcon}
            isIconOnly
            color={'neutral'}
            variant={'outlined'}
            onPress={handleSettings}
          />
        </View>

        <View style={styles.hero}>
          <HeroDescription />
          <WordBlocks key={_refreshKey} />
        </View>

        <View style={styles.content}>
          <SummaryList />
          
          {/* Mock Data Section for Testing */}
          <View style={styles.mockDataSection}>
            <Text style={styles.mockDataTitle}>
              Testing Tools ({words.length} words)
            </Text>
            <View style={styles.mockDataButtons}>
              <Button
                title="Add Test Words"
                subtitle="Add sample words to test the learning screen"
                onPress={handleAddMockData}
                size={'sm'}
                variant={'outlined'}
                color={'neutral'}
              />
              {words.length > 0 && (
                <Button
                  title="Clear All Words"
                  subtitle="Remove all words from the store"
                  onPress={handleClearMockData}
                  size={'sm'}
                  variant={'outlined'}
                  color={'error'}
                />
              )}
            </View>
          </View>
          
          <View style={styles.statistics}>
            <Button
              title="View statistics"
              size={'sm'}
              onPress={handleViewStatistics}
              variant={'outlined'}
              color={'neutral'}
            />
          </View>

          <View>
            <Button
              title="Start Learning"
              subtitle="Browse words and start learning"
              onPress={handleStartLearning}
              size={'sm'}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
  },
  logo: {
    width: 160,
    height: 33,
  },
  header: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hero: {
    minHeight: 300,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: 24,
    gap: 20
  },
  statistics: {
    maxWidth: 200,
    width: '100%',
    margin: 'auto',
  },
  mockDataSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  mockDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  mockDataButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
});

export default HomeScreen;