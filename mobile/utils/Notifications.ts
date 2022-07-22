import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { serverURL } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";

const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }
    const token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "@parinzee/bcis-sc-app",
      })
    ).data;

    // If the key is not set, it means it is our first time
    const isFirstPush = (await AsyncStorage.getItem("@firstPush")) == null;

    if (isFirstPush) {
      await fetch(`${serverURL}/push-id/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ push_id: token }),
      }).then(async () => {
        AsyncStorage.setItem("@firstPush", "false");
      });
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

const addNotificationListener = async () => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (resp) => {
      const url = resp.notification.request.content.url;
      Linking.openURL(url);
    }
  );
  return subscription;
};

export { registerForPushNotificationsAsync };
