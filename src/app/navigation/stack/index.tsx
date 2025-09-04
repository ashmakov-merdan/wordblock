import { createNativeStackNavigator, NativeStackHeaderProps } from "@react-navigation/native-stack";
import { CreateWord } from "features/words";
import { HomeScreen, StatisticsScreen, SettingsScreen, WordListScreen, LearningScreen } from "screens";
import { Header } from "shared/ui";

const Stack = createNativeStackNavigator();

const StackHeader = (props: NativeStackHeaderProps) => <Header {...props} />;
const CreateWordForm = () => <CreateWord />;

const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: StackHeader
      }}>
      <Stack.Screen name={"Home"} component={HomeScreen} options={{
        headerShown: false,
      }} />
      <Stack.Screen
        name={"Statistics"}
        component={StatisticsScreen}
        options={{
          title: 'Statistics'
        }} />
      <Stack.Screen
        name={"Settings"}
        component={SettingsScreen}
        options={{
          title: 'Settings'
        }}
      />
      <Stack.Screen
        name={'WordList'}
        component={WordListScreen}
        options={{
          title: 'Word List',
          headerRight: CreateWordForm
        }}
      />
      <Stack.Screen
        name={'Learning'}
        component={LearningScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
};

export default StackNavigation;