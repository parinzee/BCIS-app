/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";
import { getInitialURL, subscribe } from "../utils/Notifications";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: "home",
          News: "news",
          Portfolio: "portfolio",
          Activities: "activity",
          Profile: "profile",
        },
      },
      Login: "login",
      RegisterInfo: "registerInfo",
      Modal: "modal",
    },
  },
  getInitialURL,
  subscribe,
};

export default linking;
