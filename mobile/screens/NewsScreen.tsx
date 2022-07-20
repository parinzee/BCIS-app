import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import NewsItem from "../components/NewsItem";
import useLayout from "../hooks/useLayout";
import { useGetNewsQuery } from "../slices/apiSlice";
import { ActivityIndicator, Colors, Title } from "react-native-paper";

export default function NewsScreen() {
  const layout = useLayout();
  const ItemWidth = layout.isLargeDevice
    ? layout.window.width / 1.5
    : layout.window.width - 50;

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
        size={layout.isLargeDevice ? 70 : 40}
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
            content={item.content}
            dateUpdated={new Date(item.date_updated)}
            department={item.department}
            width={ItemWidth}
          />
        )}
        style={{ width: layout.window.width }}
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
