import { StyleSheet, Text, View } from "react-native";
import NewsItem from "../components/NewsItem";

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <View>
        <NewsItem title="Urgent News" emoji="😁" description="Hello world" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
