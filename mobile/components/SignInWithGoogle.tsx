import * as React from "react";
import * as Linking from "expo-linking";
import { StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";
import { URLConfiguration } from "../constants/AWSCognito";
import { handleGoogleCognitoCallback } from "../constants/AWSCognito";

export default function SignInWithGoogle() {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const subscription = Linking.addEventListener("url", async (event) => {
      setIsLoading(true);
      await handleGoogleCognitoCallback(event);
      setIsLoading(false);
    });

    return () => {
      subscription.remove();
    };
  });

  return (
    <View style={{ ...styles.container, marginTop: 10 }}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => Linking.openURL(URLConfiguration.googleURL)}
        disabled={isLoading}
      >
        <Image
          source={require("../assets/images/g-normal.png")}
          style={styles.logo}
        />
        {!isLoading ? (
          <Text style={styles.text}>Sign In With Google</Text>
        ) : (
          <ActivityIndicator />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: 230,
    backgroundColor: Colors.white,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 46,
    width: 46,
  },
  text: {
    marginLeft: 5,
    fontSize: 15,
    color: Colors.black,
    fontWeight: "bold",
  },
});
