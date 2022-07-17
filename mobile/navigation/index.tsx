/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Image } from "react-native";

import Layout from "../constants/Layout";

import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import HomeScreen from "../screens/HomeScreen";
import NewsScreen from "../screens/NewsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Theme } from "../types";

export default function Navigation({ theme }: { theme: Theme }) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      // Show the labels on large devices
      screenOptions={{ tabBarShowLabel: Layout.isLargeDevice }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" color={color} size={27} />
          ),
        }}
      />
      <BottomTab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: "News",
          // Fix icon styling on large screens. React Navigation cuts off the icon since it's wide.
          // I fixed it by setting the width and then moving the icon closer to the text
          tabBarIconStyle: { width: 30, marginRight: -10 },
          tabBarIcon: ({ color }) => (
            <FontAwesome name="newspaper-o" color={color} size={27} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Activities"
        component={NewsScreen}
        options={{
          title: "Activities",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="sports-handball" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/images/placeholder-profile.jpeg")}
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                borderColor: color,
                borderWidth: 2,
              }}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
