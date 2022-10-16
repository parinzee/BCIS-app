import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import ActivityItem from "../components/ActivityItem";
import useLayout from "../hooks/useLayout";
import { ActivityIndicator, Colors, Title } from "react-native-paper";
import {
  useGetActivitiesQuery,
  useGetTeamScoresQuery,
} from "../slices/apiSlice";
import { Activity, TeamScores } from "../types";
import ScoreItem from "../components/ScoreItem";

function isActivity(item: Activity | TeamScores): item is Activity {
  return (item as Activity).title !== undefined;
}

export default function ActivityScreen() {
  const layout = useLayout();
  const itemWidth = layout.isSmallDevice ? 315 : 350;

  const {
    data: activities,
    isLoading: isActivityLoading,
    isSuccess: isActivitySuccess,
    isError: isActivityError,
    isFetching: isActivityFetching,
    refetch: activityRefresh,
  } = useGetActivitiesQuery();

  const {
    data: scores,
    isLoading: isScoreLoading,
    isSuccess: isScoreSuccess,
    isError: isScoreError,
    isFetching: isScoreFetching,
    refetch: scoreRefresh,
  } = useGetTeamScoresQuery();

  let activityContent;

  if (isActivityLoading || isScoreLoading) {
    activityContent = (
      <ActivityIndicator
        color={Colors.blue300}
        size={layout.isLargeDevice ? 70 : 40}
      />
    );
  } else if (isActivitySuccess && isScoreSuccess) {
    const data = [scores, ...activities];
    activityContent = (
      <FlatList
        // Specify an arbitary key to force FlatList refresh
        // when layout.isNotSmallDevice may change when rotating screens
        key={layout.isMediumDevice || layout.isLargeDevice ? "_" : "#"}
        data={data}
        numColumns={layout.isMediumDevice || layout.isLargeDevice ? 2 : 1}
        refreshControl={
          <RefreshControl
            refreshing={isActivityFetching || isScoreFetching}
            tintColor={Colors.blue300}
            colors={[Colors.blue300]}
            onRefresh={() => {
              scoreRefresh();
              activityRefresh();
            }}
          />
        }
        renderItem={({ item }) => {
          if (isActivity(item)) {
            return (
              <ActivityItem
                key={item.title}
                title={item.title}
                emoji={item.emoji}
                content={item.content}
                dateUpdated={new Date(item.date_updated)}
                activityDate={new Date(item.activity_date)}
                thumbnailURL={
                  item.thumbnail_URL == null
                    ? item.thumbnail_File
                    : item.thumbnail_URL
                }
                videoURL={item.video_URL}
                width={itemWidth}
              />
            );
          } else {
            return (
              <ScoreItem
                item={item}
                width={itemWidth}
                key={JSON.stringify(item)}
              />
            );
          }
        }}
        style={{ width: layout.window.width }}
        contentContainerStyle={{ alignItems: "center" }}
      />
    );
  } else if (isActivityError || isScoreError) {
    activityContent = (
      <Title>Unable to get Activities and Team Color Scores</Title>
    );
  }

  return <View style={styles.container}>{activityContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
