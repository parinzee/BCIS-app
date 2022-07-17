import { useWindowDimensions } from "react-native";

export default function useLayout() {
  const { height, width } = useWindowDimensions();

  return {
    window: {
      height,
      width,
    },
    isLargeDevice: width > 775,
  };
}
