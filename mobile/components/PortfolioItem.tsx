import { Image, StyleSheet } from "react-native";
import { View } from "react-native";
import { Surface, Text } from "react-native-paper";

interface PortfolioItemProps {
  title: string;
  content: string;
  emoji: string;
  width: number;
}

export default function PortfolioItem({
  title,
  content,
  emoji,
  width,
}: PortfolioItemProps) {
  return (
    <Surface style={{ ...styles.container, width: width }}>
      <View style={styles.titleContainer}>
        <Text>{title}</Text>
        <Text>{emoji}</Text>
      </View>
      <Text>{content}</Text>
      <Image source={{}} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 12,
    height: 400,
  },
  titleContainer: {
    justifyContent: "space-between",
  },
  image: {},
});
