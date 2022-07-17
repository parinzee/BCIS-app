import { StyleSheet, View } from "react-native";
import NewsItem from "../components/NewsItem";
import useLayout from "../hooks/useLayout";

export default function NewsScreen() {
  const Layout = useLayout();
  const ItemWidth = Layout.isLargeDevice
    ? Layout.window.width / 1.5
    : Layout.window.width - 50;

  console.log(ItemWidth);
  return (
    <View style={styles.container}>
      <View>
        <NewsItem
          title="Urgent News"
          emoji="😁"
          description={
            "This is some nice ***text***.\n And a [link!](https://google.com)"
          }
          width={ItemWidth}
        />
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
});
