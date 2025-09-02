import { View, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Button } from "shared/ui";
import React, { useCallback, useState } from "react";
import { SummaryList } from "features/summary";
import logo from 'shared/assets/images/logo.png';
import { GearSixIcon } from "phosphor-react-native";
import { HeroDescription, WordBlocks } from "features/hero";
import { theme } from "shared/theme";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [_refreshKey, setRefreshKey] = useState(0);

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