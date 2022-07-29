import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
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
import * as WebBrowser from "expo-web-browser";

export default function SignInWithGoogle() {
  // Using the hook for component reusability
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  return (
    <View style={{ ...styles.container, marginTop: 10 }}>
      <TouchableOpacity
        style={styles.container}
        onPress={async () => {
          const result = await WebBrowser.openAuthSessionAsync(
            encodeURI(URLConfiguration.googleURL),
            "bcis:///login"
          );
          if (result.type == "success" && result.url != undefined) {
            setIsLoading(true);
            await handleGoogleCognitoCallback(result).then(async () => {
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
                setIsLoading(false);
                navigation.navigate("Root");
              }
            });
          } else {
            setIsLoading(false);
            Alert.alert(
              "Login Failed",
              "Please check your internet and/or credentials."
            );
          }
        }}
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
