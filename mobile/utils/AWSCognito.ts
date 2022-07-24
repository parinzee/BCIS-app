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
const region = "ap-southeast-1";
const poolID = `${region}_bzlNrqEFt`;
const redirectURI = linking.prefixes[0] + "login";

const userPool = new CognitoUserPool({
  UserPoolId: poolID,
  ClientId: clientId,
});

const URLConfiguration = {
  baseURL: `https://bcis-app.auth.${region}.amazoncognito.com/`,
  hostedUiURL: `https://bcis-app.auth.${region}.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+profile&redirect_uri=${redirectURI}`,
  googleURL: `https://bcis-app.auth.${region}.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectURI}&response_type=CODE&client_id=${clientId}&scope=aws.cognito.signin.user.admin email openid profile`,
  tokenURL: `https://bcis-app.auth.${region}.amazoncognito.com/oauth2/token`,
  cognitoAPIURL: `https://cognito-idp.${region}.amazonaws.com/`,
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

  // Set last refresh
  await SecureStore.setItemAsync("last_refresh", new Date().toISOString());
};

const getUserAttributes = async (access_token: string) => {
  let attr: { [key: string]: string | null } = {
    sub: null,
    identities: null,
    email_verified: null,
    name: null,
    email: null,
    picture: null,
  };

  const data = await fetch(URLConfiguration.cognitoAPIURL, {
    method: "POST",
    headers: {
      "Content-Type": " application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser",
    },
    body: JSON.stringify({ AccessToken: access_token }),
  }).then((resp) => resp.json());

  data["UserAttributes"].forEach((element: { [key: string]: string }) => {
    attr[element["Name"]] = element["Value"];
  });

  return attr;
};

const handleGoogleCognitoCallback = async (event: Linking.EventType) => {
  const { code } = Linking.parse(event.url).queryParams;
  await downloadTokens(code);
};

const handleCogntioRegister = async (email: string, password: string) => {
  await userPool.signUp(email, password, [], [], (err, result) => {});

  // Artificial delay for Cogntio to process user
  setTimeout(() => {
    handleCogntioLogin(email, password);
  }, 1500);
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
    onFailure: (err) => {
      Alert.alert(
        "Login Failed",
        "Please check email/password and internet connection"
      );
    },
  });
};

const getTokens = async () => {
  const currDate = new Date();
  const lastRefresh = new Date(
    (await SecureStore.getItemAsync("last_refresh")) as string
  );

  const refreshToken = (await SecureStore.getItemAsync(
    "refresh_token"
  )) as string;

  // If more than one day since last refresh, then refresh tokens
  if (
    (currDate.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60 * 24) >=
    1
  ) {
    await refreshTokens(refreshToken);
  }

  const idToken = (await SecureStore.getItemAsync("id_token")) as string;
  const accessToken = (await SecureStore.getItemAsync(
    "access_token"
  )) as string;

  return { idToken, accessToken };
};

const clearAuthTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync("id_token"),
    SecureStore.deleteItemAsync("access_token"),
    SecureStore.deleteItemAsync("refresh_token"),
    SecureStore.deleteItemAsync("last_refresh"),
  ]);
};

export {
  URLConfiguration,
  handleGoogleCognitoCallback,
  handleCogntioRegister,
  handleCogntioLogin,
  refreshTokens,
  getUserAttributes,
  getTokens,
  clearAuthTokens,
};
