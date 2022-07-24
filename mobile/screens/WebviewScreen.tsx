import { StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { RootStackScreenProps } from "../types";
import * as React from "react";

export default function WebviewScreen({
  navigation,
  route,
}: RootStackScreenProps<"WebviewScreen">) {
  React.useEffect(() => {
    navigation.setOptions({ title: route.params.title });
  }, []);
  return (
    <WebView
      style={styles.webview}
      originWhitelist={["*"]}
      source={{ uri: route.params.url }}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
