import { StatusBar } from "react-native";
import { NavigationProvider } from "./provider";
import { StackNavigation } from "./navigation";

const Main = () => {
  return (
      <NavigationProvider>
        <StatusBar barStyle={'dark-content'} />
        <StackNavigation />
      </NavigationProvider>
  )
};

export default Main;