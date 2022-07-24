/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import useLayout from "../hooks/useLayout";

import LoginScreen from "../screens/LoginScreen";
import ModalScreen from "../screens/ModalScreen";
import HomeScreen from "../screens/HomeScreen";
import NewsScreen from "../screens/NewsScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import ActivityScreen from "../screens/ActivityScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Theme } from "../types";
import RegisterInfoScreen from "../screens/RegisterInfoScreen";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FastImage from "react-native-fast-image";
import { Avatar } from "react-native-paper";
import WebviewScreen from "../screens/WebviewScreen";

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
    <Stack.Navigator initialRouteName="Root">
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WebviewScreen"
        component={WebviewScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="RegisterInfo"
        component={RegisterInfoScreen}
        options={{ headerShown: true, title: "Registration Info" }}
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
  const Layout = useLayout();
  const user = useSelector((state: RootState) => state.user);
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
          tabBarIcon: ({ color }) => (
            <FontAwesome name="newspaper-o" color={color} size={22.5} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          title: "Student Portoflio & Certificates",
          tabBarLabel: "Portfolios",
          // Fix icon styling on large screens. React Navigation cuts off the icon since it's wide.
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="certificate"
              color={color}
              size={27}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Activities"
        component={ActivityScreen}
        options={{
          title: "Activities",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="handball" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => {
            if (user.profileURL != null) {
              return (
                <FastImage
                  source={{ uri: user.profileURL }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    borderColor: color,
                    borderWidth: 2,
                  }}
                />
              );
            } else if (user.name != null) {
              return (
                <Avatar.Text
                  label={user.name[0]}
                  size={30}
                  style={{ backgroundColor: color }}
                />
              );
            } else {
              return (
                <Avatar.Text
                  label="G"
                  size={30}
                  style={{ backgroundColor: color }}
                />
              );
            }
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
