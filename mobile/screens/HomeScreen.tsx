import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import FeaturedItemCarousel from "../components/FeaturedItemCarousel";
import VerseOfDay from "../components/VerseOfDay";
import useLayout from "../hooks/useLayout";

import { RootTabScreenProps } from "../types";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const layout = useLayout();
  return (
    <View style={styles.container}>
      <FeaturedItemCarousel layout={layout} />
      <View
        style={
          layout.isMediumDevice || layout.isLargeDevice
            ? { marginHorizontal: 100 }
            : null
        }
      >
        <Text style={styles.greeting}> Hello there,</Text>
        <VerseOfDay />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 10,
    fontSize: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
