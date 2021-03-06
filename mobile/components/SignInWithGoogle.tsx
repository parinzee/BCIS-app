import * as React from "react";
import * as Linking from "expo-linking";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";
import {
  getTokens,
  getUserAttributes,
  URLConfiguration,
} from "../utils/AWSCognito";
import { handleGoogleCognitoCallback } from "../utils/AWSCognito";
import FastImage from "react-native-fast-image";
import { APIUserExists, getAPIUser } from "../utils/API";
import { useDispatch } from "react-redux";
import { login } from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";

export default function SignInWithGoogle() {
  // Using the hook for component reusability
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const subscription = Linking.addEventListener("url", async (event) => {
      setIsLoading(true);
      await handleGoogleCognitoCallback(event).then(async () => {
        const { accessToken } = await getTokens();
        const { email, picture } = await getUserAttributes(accessToken);
        const userExists = await APIUserExists(email as string);
        if (!userExists) {
          navigation.navigate("RegisterInfo");
        } else {
          const APIUser = await getAPIUser(email as string, accessToken);
          dispatch(
            login({
              name: APIUser.name,
              email: email,
              department: APIUser.department,
              profileURL: picture,
            })
          );
          navigation.navigate("Root");
        }
      });
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
        <FastImage
          source={require("../assets/images/g-normal.png")}
          style={styles.logo}
        />
        {!isLoading ? (
          <Text style={styles.text}>Continue With Google</Text>
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
