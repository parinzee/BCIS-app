import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import FeaturedItemCarousel from "../components/FeaturedItemCarousel";
import TopNews from "../components/TopNews";
import TopActivity from "../components/TopActivity";
import VerseOfDay from "../components/VerseOfDay";
import useLayout from "../hooks/useLayout";

import { RootTabScreenProps } from "../types";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const layout = useLayout();
  return (
    <ScrollView style={styles.container}>
      <FeaturedItemCarousel layout={layout} />
      <View
        style={
          layout.isMediumDevice || layout.isLargeDevice
            ? { width: 740, alignSelf: "center" }
            : null
        }
      >
        <Text style={styles.greeting}> Hello there,</Text>
        <VerseOfDay layout={layout} />
        <TopNews layout={layout} />
        <TopActivity layout={layout} />
      </View>
    </ScrollView>
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
    marginBottom: 10,
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
