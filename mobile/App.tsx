import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider as PaperProvider } from "react-native-paper";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";

import useTheme from "./hooks/useTheme";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const theme = useTheme();
  console.log(theme);
  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Navigation theme={theme} />
        <StatusBar />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
