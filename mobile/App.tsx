import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <Navigation />
          <StatusBar />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}
