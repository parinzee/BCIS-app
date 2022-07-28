import { StyleSheet, Platform } from "react-native";
import WebView from "react-native-webview";
import { RootStackScreenProps } from "../types";
import * as React from "react";
import { ActivityIndicator, Colors } from "react-native-paper";
import useTheme from "../hooks/useTheme";
import * as Linking from "expo-linking";

export default function WebviewScreen({
  navigation,
  route,
}: RootStackScreenProps<"Webview">) {
  const [loading, setIsloading] = React.useState(true);
  const theme = useTheme();

  React.useEffect(() => {
    if (Platform.OS == "android") {
      navigation.navigate("Root");
      Linking.openURL(route.params.url);
    } else {
      navigation.setOptions({ title: route.params.title });
    }
  }, []);

  return (
    <>
      <WebView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        originWhitelist={["*"]}
        source={{ uri: route.params.url }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoad={() => {
          setIsloading(false);
        }}
      />
      {loading ? (
        <ActivityIndicator
          color={Colors.blue200}
          style={styles.activityIndicator}
          size={60}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
