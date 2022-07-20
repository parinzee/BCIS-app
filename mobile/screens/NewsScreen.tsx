import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import NewsItem from "../components/NewsItem";
import useLayout from "../hooks/useLayout";
import { useGetNewsQuery } from "../slices/apiSlice";
import { ActivityIndicator, Colors, Title } from "react-native-paper";

export default function NewsScreen() {
  const Layout = useLayout();
  const ItemWidth = Layout.isLargeDevice
    ? Layout.window.width / 1.5
    : Layout.window.width - 50;

  const {
    data: news,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    refetch,
  } = useGetNewsQuery();

  let content;

  if (isLoading) {
    content = (
      <ActivityIndicator
        color={Colors.blue300}
        size={Layout.isLargeDevice ? 70 : 40}
      />
    );
  } else if (isSuccess) {
    content = (
      <FlatList
        data={news}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            tintColor={Colors.blue300}
            colors={[Colors.blue300]}
            // Add timeout to ease the pull-to-refresh
            onRefresh={refetch}
          />
        }
        renderItem={({ item }) => (
          <NewsItem
            title={item.title}
            emoji={item.emoji}
            description={item.content}
            dateUpdated={new Date(item.date_updated)}
            width={ItemWidth}
          />
        )}
        style={{ width: Layout.window.width }}
      />
    );
  } else if (isError) {
    content = <Title>Unable to get News</Title>;
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
