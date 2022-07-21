import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import NewsItem from "../components/NewsItem";
import useLayout from "../hooks/useLayout";
import { useGetNewsQuery } from "../slices/apiSlice";
import { ActivityIndicator, Colors, Title } from "react-native-paper";

export default function NewsScreen() {
  const layout = useLayout();
  const itemWidth = layout.isSmallDevice ? 315 : 350;

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
        // Arbitary key to force re-render when layout.isLargeDevice
        // may change due to device rotation
        key={layout.isMediumDevice || layout.isLargeDevice ? "$" : "%"}
        numColumns={layout.isMediumDevice || layout.isLargeDevice ? 2 : 1}
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
            key={item.title}
            title={item.title}
            emoji={item.emoji}
            content={item.content}
            dateUpdated={new Date(item.date_updated)}
            department={item.department}
            width={itemWidth}
          />
        )}
        style={{ width: layout.window.width }}
        contentContainerStyle={{ alignItems: "center" }}
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
