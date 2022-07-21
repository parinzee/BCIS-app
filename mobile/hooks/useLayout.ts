import { useWindowDimensions } from "react-native";

interface layout {
  window: {
    height: number;
    width: number;
  };
  isLargeDevice: boolean;
  isMediumDevice: boolean;
  isSmallDevice: boolean;
}

export default function useLayout(): layout {
  const { height, width } = useWindowDimensions();

  return {
    window: {
      height,
      width,
    },
    // Breakpoint styling
    isLargeDevice: width > 775,
    isMediumDevice: width > 740 && width <= 775,
    isSmallDevice: width < 350,
  };
}

export { layout };
