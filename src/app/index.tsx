import { StatusBar } from "react-native";
import { NavigationProvider } from "./provider";
import { StackNavigation } from "./navigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Main = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationProvider>
          <StatusBar barStyle={'dark-content'} />
          <StackNavigation />
        </NavigationProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
};

export default Main;