import { Linking, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Surface, TouchableRipple } from "react-native-paper";

interface FeaturedItemProps {
  redirect_uri: string;
  bgColors: string[];
  emoji: string;
  title: string;
}

export default function FeaturedItem({
  redirect_uri,
  bgColors,
  emoji,
  title,
}: FeaturedItemProps) {
  return (
    <TouchableRipple
      onPress={() => Linking.openURL(redirect_uri)}
      rippleColor="rgba(0, 0, 0, .32)"
      style={styles.container}
    >
      <Surface style={styles.container}>
        <LinearGradient
          colors={bgColors}
          style={styles.innerContainer}
          start={[0, 0]}
          end={[1, 0]}
        >
          <Text
            style={{
              fontSize: 40,
              marginRight: 2,
            }}
          >
            {emoji}
          </Text>
          <Text
            style={{
              fontWeight: "900",
              color: "#f2f2f7",
              fontSize: 25,
              fontFamily: "Poppins_700Bold",
              maxWidth: 210,
            }}
          >
            {title}
          </Text>
        </LinearGradient>
      </Surface>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 120,
    borderRadius: 15,
    elevation: 12,
    alignSelf: "center",
  },
  innerContainer: {
    width: 300,
    height: 120,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
