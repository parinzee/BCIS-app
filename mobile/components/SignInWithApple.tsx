import { Platform, Alert, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import useTheme from "../hooks/useTheme";
import {
  getTokens,
  getUserAttributes,
  handleGoogleCognitoCallback,
  URLConfiguration,
} from "../utils/AWSCognito";
import * as WebBrowser from "expo-web-browser";
import { APIUserExists, getAPIUser } from "../utils/API";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { login } from "../slices/userSlice";

export default function SignInWithApple() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  if (Platform.OS == "ios") {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={
          theme.dark
            ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
        }
        style={{ height: 48, width: 230, marginTop: 10 }}
        onPress={async () => {
          const result = await WebBrowser.openAuthSessionAsync(
            encodeURI(URLConfiguration.appleURL),
            "bcis:///login",
            { preferEphemeralSession: true }
          );
          if (result.type == "success" && result.url != undefined) {
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
                navigation.navigate("Root");
              }
            });
          } else {
            Alert.alert(
              "Login Failed",
              "Please check your internet and/or credentials."
            );
          }

          // Custom implementation of auth (work-in-progress)
          //   const { state } = await fetch(
          //     encodeURI(URLConfiguration.appleURL)
          //   ).then((resp) => Linking.parse(resp.url).queryParams);

          //   console.log(state);

          //   // Make sure we get the state
          //   if (state == null) {
          //     Alert.alert(
          //       "Unable to Connect to Sever",
          //       "Please check your internet or try again later."
          //     );
          //     return;
          //   }

          //   const credential = await AppleAuthentication.signInAsync({
          //     requestedScopes: [
          //       AppleAuthentication.AppleAuthenticationScope.EMAIL,
          //     ],
          //   });
          //   console.log(credential);

          //   if (credential.authorizationCode != null) {
          //     const result = await fetch(
          //       encodeURI(URLConfiguration.idpResponse),
          //       {
          //         method: "POST",
          //         headers: {
          //           "content-type": "application/x-www-form-urlencoded",
          //           "cache-control": "no-cache",
          //           origin: "https://appleid.apple.com",
          //           referer: "https://appleid.apple.com",
          //           pragma: "no-cache",
          //         },
          //         // body: `code=${encodeURIComponent(
          //         //   credential.authorizationCode
          //         // )}`,
          //         // body: `state=${state}&code=${encodeURIComponent(
          //         //   credential.authorizationCode
          //         // )}`,
          //       }
          //     ).catch((reason) => console.log(reason));
          //     console.log(result.url);
          //     console.log(await result.json());
          //   }
        }}
      />
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  appleAuthContainer: {
    height: 48,
    width: 230,
    marginTop: 10,
  },
});
