import { View, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Button } from "shared/ui";
import React, { useCallback, useState } from "react";
import logo from 'shared/assets/images/logo.png';
import { GearSixIcon, TrendUpIcon } from "phosphor-react-native";
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
    navigation.navigate('Learning' as never);
  };

  const handleViewWords = useCallback(() => {
    navigation.navigate('WordList' as never);
  }, [navigation]);

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
          <View style={styles.headerButtons}>
            <Button
              icon={TrendUpIcon}
              isIconOnly
              size={'sm'}
              color={"neutral"}
              variant={'outlined'}
              onPress={handleViewStatistics}
            />
            <Button
              icon={GearSixIcon}
              isIconOnly
              size={'sm'}
              color={'neutral'}
              variant={'outlined'}
              onPress={handleSettings}
            />
          </View>

        </View>

        <View style={styles.hero}>
          <HeroDescription />
          <WordBlocks key={_refreshKey} />
        </View>

        <View style={styles.content}>
          <View>
            <Button
              title="Start Learning"
              onPress={handleStartLearning}
              size={'md'}
            />
          </View>
          <View>
            <Button
              title="Explore words"
              subtitle="Browse and create your own words"
              onPress={handleViewWords}
              size={'sm'}
              variant={'outlined'}
              color={'neutral'}
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
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
});

export default HomeScreen;