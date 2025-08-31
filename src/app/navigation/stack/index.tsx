import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen, StatisticsScreen } from "screens";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"Home"} component={HomeScreen} />
      <Stack.Screen name={"Statistics"} component={StatisticsScreen} />
    </Stack.Navigator>
  )
};

export default StackNavigation;