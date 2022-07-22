import ActivityItem from "./ActivityItem";
import { useGetActivitiesQuery } from "../slices/apiSlice";
import { layout } from "../hooks/useLayout";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { StyleSheet, View } from "react-native";

interface TopNewsProps {
  layout: layout;
}

export default function TopActivity({ layout }: TopNewsProps) {
  const { data: activities, isSuccess } = useGetActivitiesQuery();

  const itemWidth = layout.isSmallDevice ? 315 : 350;

  let content = (
    <SkeletonContent
      isLoading={true}
      containerStyle={{
        width: itemWidth,
        height: 150,
        borderRadius: 10,
        marginVertical: 20,
        alignSelf: "center",
      }}
      layout={[
        {
          width: itemWidth,
          height: 150,
          borderRadius: 10,
        },
      ]}
    />
  );

  if (isSuccess) {
    if (layout.isMediumDevice || layout.isLargeDevice) {
      content = (
        <View style={styles.horizontalContainer}>
          <ActivityItem
            key="top activity 1"
            title={activities[0].title}
            emoji={activities[0].emoji}
            content={activities[0].content}
            dateUpdated={new Date(activities[0].date_updated)}
            activityDate={new Date(activities[0].activity_date)}
            thumbnailURL={
              activities[0].thumbnail_URL != null
                ? activities[0].thumbnail_URL
                : activities[0].thumbnail_File
            }
            videoURL={activities[0].video_URL}
            width={itemWidth}
          />
          <ActivityItem
            key="top activity 2"
            title={activities[1].title}
            emoji={activities[1].emoji}
            content={activities[1].content}
            dateUpdated={new Date(activities[1].date_updated)}
            activityDate={new Date(activities[1].activity_date)}
            thumbnailURL={
              activities[1].thumbnail_URL != null
                ? activities[1].thumbnail_URL
                : activities[1].thumbnail_File
            }
            videoURL={activities[1].video_URL}
            width={itemWidth}
          />
        </View>
      );
    } else {
      content = (
        <ActivityItem
          key="top activity"
          title={activities[0].title}
          emoji={activities[0].emoji}
          content={activities[0].content}
          dateUpdated={new Date(activities[0].date_updated)}
          activityDate={new Date(activities[0].activity_date)}
          thumbnailURL={
            activities[0].thumbnail_URL != null
              ? activities[0].thumbnail_URL
              : activities[0].thumbnail_File
          }
          videoURL={activities[0].video_URL}
          width={itemWidth}
        />
      );
    }
  }

  return content;
}

const styles = StyleSheet.create({
  horizontalContainer: {
    width: 740,
    flexDirection: "row",
  },
});
