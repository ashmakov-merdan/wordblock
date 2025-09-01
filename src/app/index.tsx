import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationProvider } from "./provider";
import { StackNavigation } from "./navigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { blockingService } from "shared/lib/services/blocking-service";
import { blockingEventService } from "shared/lib/services/blocking-event-service";
import { storageService } from "shared/lib/storage";

const Main = () => {
  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       console.log('Initializing WordBlock app...');
        
  //       // Initialize blocking event service
  //       blockingEventService.initialize();
        
  //       // Check if blocking is enabled and start monitoring
  //       const settings = await storageService.getBlockingSettings();
  //       if (settings.isEnabled) {
  //         console.log('Blocking is enabled, starting background monitoring...');
  //         await blockingService.startBackgroundMonitoring();
  //       } else {
  //         console.log('Blocking is disabled');
  //       }
        
  //       // Add listener for block events
  //       blockingEventService.addListener(async (event) => {
  //         console.log('Block event received in main app:', event);
  //         // The blocking service will handle the block trigger
  //         // You could also navigate to the block screen here if needed
  //       });
        
  //       console.log('App initialization complete');
  //     } catch (error) {
  //       console.error('Error initializing app:', error);
  //     }
  //   };

  //   initializeApp();

  //   // Cleanup on unmount
  //   return () => {
  //     blockingEventService.cleanup();
  //   };
  // }, []);

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