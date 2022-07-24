import "expo-dev-client";
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { registerForPushNotificationsAsync } from "./utils/Notifications";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import useTheme from "./hooks/useTheme";
import store, { persistor } from "./store";
import { View } from "react-native";

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

  React.useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <PaperProvider theme={theme}>
          <ReduxProvider store={store}>
            <PersistGate
              loading={
                <View
                  style={{ flex: 1, backgroundColor: theme.colors.background }}
                />
              }
              persistor={persistor}
            >
              <Navigation theme={theme} />
              <StatusBar />
            </PersistGate>
          </ReduxProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
