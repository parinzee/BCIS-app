import ActivityItem from "./ActivityItem";
import { useGetActivitiesQuery } from "../slices/apiSlice";
import { layout } from "../hooks/useLayout";
import SkeletonContent from "@03balogun/react-native-skeleton-content";

interface TopNewsProps {
  layout: layout;
}

export default function TopActivity({ layout }: TopNewsProps) {
  const { data: activities, isSuccess } = useGetActivitiesQuery();

  const itemWidth = layout.isSmallDevice ? 315 : 350;

  let content = (
    <SkeletonContent
      isLoading={true}
      containerStyle={{ width: itemWidth, height: 150, borderRadius: 10 }}
    />
  );

  if (isSuccess) {
    content = (
      <ActivityItem
        key="top activity"
        title={activities[0].title}
        emoji={activities[0].emoji}
        content={activities[0].content}
        dateUpdated={new Date(activities[0].date_updated)}
        activityDate={new Date(activities[0].activity_date)}
        thumbnailURL={activities[0].thumbnail_URL}
        videoURL={activities[0].video_URL}
        width={itemWidth}
      />
    );
  }

  return content;
}
