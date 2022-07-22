import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import ActivityItem from "../components/ActivityItem";
import useLayout from "../hooks/useLayout";
import { ActivityIndicator, Colors, Title } from "react-native-paper";
import { useGetActivitiesQuery } from "../slices/apiSlice";

export default function ActivityScreen() {
  const layout = useLayout();
  const itemWidth = layout.isSmallDevice ? 315 : 350;

  const {
    data: activities,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    refetch,
  } = useGetActivitiesQuery();

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
        // Specify an arbitary key to force FlatList refresh
        // when layout.isNotSmallDevice may change when rotating screens
        key={layout.isMediumDevice || layout.isLargeDevice ? "_" : "#"}
        data={activities}
        numColumns={layout.isMediumDevice || layout.isLargeDevice ? 2 : 1}
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
          <ActivityItem
            key={item.title}
            title={item.title}
            emoji={item.emoji}
            content={item.content}
            dateUpdated={new Date(item.date_updated)}
            activityDate={new Date(item.activity_date)}
            thumbnailURL={item.thumbnail_URL}
            videoURL={item.video_URL}
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
