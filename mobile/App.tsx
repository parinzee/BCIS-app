import "expo-dev-client";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { registerForPushNotificationsAsync } from "./utils/Notifications";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import useTheme from "./hooks/useTheme";
import store from "./store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const theme = useTheme();
  if (!isLoadingComplete) {
    return null;
  }

  React.useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ReduxProvider store={store}>
          <PaperProvider theme={theme}>
            <Navigation theme={theme} />
            <StatusBar />
          </PaperProvider>
        </ReduxProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
