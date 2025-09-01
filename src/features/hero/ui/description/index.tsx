import { StyleSheet, Text, View } from "react-native";
import { theme } from "shared/theme";

const HeroDescription = () => {
  return (
    <View>
      <Text style={styles.text}>
        Learn{' '}
        <Text style={styles.playball}>words</Text>{' '}
        and{'      '}
        <Text>managing</Text>{' '}
        <Text style={[styles.text, styles.screen]}>screen</Text>
        {' '}time
      </Text>
    </View>
  )
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: theme.colors.text.primary
  },
  playball: {
    fontFamily: 'Playball-Regular',
    fontSize: 38,
    color: theme.colors.primary[500]
  },
  screen: {
    color: theme.colors.purple[500]
  }
})

HeroDescription.displayName = 'HeroDescription';

export default HeroDescription;