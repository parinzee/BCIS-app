import { useWindowDimensions } from "react-native";

interface layout {
  window: {
    height: number;
    width: number;
  };
  isLargeDevice: boolean;
  isNotSmallDevice: boolean;
}

export default function useLayout(): layout {
  const { height, width } = useWindowDimensions();

  return {
    window: {
      height,
      width,
    },
    isLargeDevice: width > 775,
    isNotSmallDevice: width > 740,
  };
}

export { layout };
