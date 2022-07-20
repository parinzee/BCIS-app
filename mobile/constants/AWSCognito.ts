import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import linking from "../navigation/LinkingConfiguration";
import { Alert } from "react-native";

const clientId = "23ae5q6guet1m77chghqcfjda";
const poolID = "ap-southeast-1_bzlNrqEFt";
const redirectURI = linking.prefixes[0] + "login";

const userPool = new CognitoUserPool({
  UserPoolId: poolID,
  ClientId: clientId,
});

const URLConfiguration = {
  baseURL: "https://bcis-app.auth.ap-southeast-1.amazoncognito.com/",
  hostedUiURL: `https://bcis-app.auth.ap-southeast-1.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=${redirectURI}`,
  googleURL: `https://bcis-app.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectURI}&response_type=CODE&client_id=${clientId}&scope=aws.cognito.signin.user.admin email openid profile`,
  tokenURL:
    "https://bcis-app.auth.ap-southeast-1.amazoncognito.com/oauth2/token",
};

const downloadTokens = async (code: string) => {
  const data = await fetch(
    "https://bcis-app.auth.ap-southeast-1.amazoncognito.com/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${code}&client_id=${clientId}&redirect_uri=${redirectURI}`,
    }
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  for (const [key, value] of Object.entries(data)) {
    if (typeof value == "string") await SecureStore.setItemAsync(key, value);
  }

  // Set last refresh
  await SecureStore.setItemAsync("last_refresh", new Date().toISOString());
};

const refreshTokens = async (refreshToken: string) => {
  const data = await fetch(
    "https://bcis-app.auth.ap-southeast-1.amazoncognito.com/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&redirect_uri=${redirectURI}`,
    }
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  for (const [key, value] of Object.entries(data)) {
    if (typeof value == "string") {
      await SecureStore.setItemAsync(key, value);
    }
  }
};

const handleGoogleCognitoCallback = async (event: Linking.EventType) => {
  const { code } = Linking.parse(event.url).queryParams;
  await downloadTokens(code);
};

const handleCogntioRegister = async (email: string, password: string) => {
  userPool.signUp(email, password, [], [], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

  await handleCogntioLogin(email, password);
};

const handleCogntioLogin = async (email: string, password: string) => {
  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  user.authenticateUser(authDetails, {
    onSuccess: async (session) => {
      const idToken = session.getIdToken().getJwtToken();
      const accessToken = session.getAccessToken().getJwtToken();
      const refreshToken = session.getRefreshToken().getToken();

      await Promise.all([
        SecureStore.setItemAsync("id_token", idToken),
        SecureStore.setItemAsync("access_token", accessToken),
        SecureStore.setItemAsync("refresh_token", refreshToken),
        SecureStore.setItemAsync("last_refresh", new Date().toISOString()),
      ]);
    },
    onFailure: () => {
      Alert.alert(
        "Login Failed",
        "Please check email/password and internet connection"
      );
    },
  });

  await refreshTokens(
    (await SecureStore.getItemAsync("refresh_token")) as string
  );
};

export {
  URLConfiguration,
  handleGoogleCognitoCallback,
  handleCogntioRegister,
  handleCogntioLogin,
};
