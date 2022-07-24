import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { serverURL } from "./API";
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

const getInitialURL = async () => {
  // First, you may want to do the default deep link handling
  // Check if app was opened from a deep link
  let url = await Linking.getInitialURL();

  if (url != null) {
    return url;
  }

  // Handle URL from expo push notifications
  const response = await Notifications.getLastNotificationResponseAsync();
  url = response?.notification.request.content.data.url as string;

  return url;
};

const subscribe = (listener: (url: string) => void) => {
  const onReceiveURL = ({ url }: { url: string }) => listener(url);

  // Listen to incoming links from deep linking
  Linking.addEventListener("url", onReceiveURL);

  // Listen to expo push notifications
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const url = response.notification.request.content.data.url as string;

      // Let React Navigation handle the URL
      listener(url);
    }
  );

  return () => {
    // Clean up the event listeners
    Linking.removeEventListener("url", onReceiveURL);
    subscription.remove();
  };
};

export { registerForPushNotificationsAsync, subscribe, getInitialURL };
