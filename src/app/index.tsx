import React from "react";
import { StatusBar } from "react-native";
import { NavigationProvider } from "./provider";
import { StackNavigation } from "./navigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

const Main = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <BottomSheetModalProvider>
          <NavigationProvider>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent />
            <StackNavigation />
          </NavigationProvider>
        </BottomSheetModalProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
};

export default Main;