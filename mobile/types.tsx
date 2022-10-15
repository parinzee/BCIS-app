/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LightTheme, DarkTheme } from "./constants/Theme";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  Login: undefined;
  RegisterInfo: undefined;
  Webview: { url: string; fallbackURL?: string; title: string };
  GradeCalculator: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  News: undefined;
  Portfolio: undefined;
  Activities: undefined;
  Profile: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type Theme = typeof LightTheme | typeof DarkTheme;

// Data types
export interface News {
  url: string;
  title: string;
  emoji: string;
  content: string;
  date_updated: string;
  department: "K" | "E" | "H" | null;
}

// Either thumbnail file or thumbnail url is specified
// Read models.py in backend for more info
export type Activity =
  | {
      url: string;
      title: string;
      emoji: string;
      content: string;
      date_updated: string;
      activity_date: string;
      thumbnail_URL: string;
      thumbnail_File: null;
      video_URL: string | null;
    }
  | {
      url: string;
      title: string;
      emoji: string;
      content: string;
      date_updated: string;
      activity_date: string;
      thumbnail_URL: null;
      thumbnail_File: string;
      video_URL: string | null;
    };

export interface Portfolio {
  url: string;
  title: string;
  content: string;
  date_updated: string;
  image_URL: string;
}

export interface Featured {
  url: string;
  title: string;
  emoji: string;
  redirect_URI: string;
  bg_color1: string;
  bg_color2: string;
}

export interface Votd {
  votd: {
    content: string;
    display_ref: string;
  };
  bg_URL: string;
}

export interface GPAScore {
  user: string;
  date_added: string;
  gpa: string;
}
