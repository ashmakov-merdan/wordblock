import { StatusBar, Text, View } from "react-native";
import { NavigationProvider } from "./provider";
import { colors } from "shared/theme";

const Main = () => {
  return (
    <NavigationProvider>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ flex: 1, backgroundColor: colors.primary.calmBlue }}>
        <Text>Hello World</Text>
      </View>
    </NavigationProvider>
  )
};

export default Main;