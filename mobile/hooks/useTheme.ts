import { LightTheme, DarkTheme } from "../constants/Theme";
import { useColorScheme } from "react-native";

export default function useTheme() {
  const colorScheme = useColorScheme();

  if (colorScheme == "light" || colorScheme == null) {
    return LightTheme;
  } else {
    return DarkTheme;
  }
}
