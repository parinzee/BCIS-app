import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
import linking from "../navigation/LinkingConfiguration";

const clientId = "23ae5q6guet1m77chghqcfjda";
const poolID = "ap-southeast-1_bzlNrqEFt";
const redirectURI = linking.prefixes[0] + "login";

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
    console.log(value);
    if (typeof value == "string") await SecureStore.setItemAsync(key, value);
  }
};

const handleGoogleCognitoCallback = async (event: Linking.EventType) => {
  const { code } = Linking.parse(event.url).queryParams;
  await downloadTokens(code);
};

const userPool = new CognitoUserPool({
  UserPoolId: poolID,
  ClientId: clientId,
});

export { URLConfiguration, handleGoogleCognitoCallback };
