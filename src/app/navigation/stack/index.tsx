import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen, StatisticsScreen, BlockScreen, LearningScreen, SettingsScreen, WordListScreen, AddWordScreen } from "screens";
import { Header } from "shared/ui";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        header: (props) => <Header {...props} />
      }}>
      <Stack.Screen name={"Home"} component={HomeScreen} />
      <Stack.Screen name={"Statistics"} component={StatisticsScreen} options={{
        title: 'Statistics',
        headerShown: true,
      }} />
      <Stack.Screen name={"Block"} component={BlockScreen} />
      <Stack.Screen name={"Learning"} component={LearningScreen} />
      <Stack.Screen name={"Settings"} component={SettingsScreen} />
      <Stack.Screen name={"WordList"} component={WordListScreen} />
      <Stack.Screen name={"AddWord"} component={AddWordScreen} />
    </Stack.Navigator>
  )
};

export default StackNavigation;