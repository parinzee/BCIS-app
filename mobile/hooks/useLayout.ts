import { useWindowDimensions } from "react-native";

interface layout {
  window: {
    height: number;
    width: number;
  };
  isLargeDevice: boolean;
}

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

export { layout };
