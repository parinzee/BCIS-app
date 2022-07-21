import NewsItem from "./NewsItem";
import { useGetNewsQuery } from "../slices/apiSlice";
import { layout } from "../hooks/useLayout";
import SkeletonContent from "@03balogun/react-native-skeleton-content";

interface TopNewsProps {
  layout: layout;
}

export default function TopNews({ layout }: TopNewsProps) {
  const { data: news, isSuccess } = useGetNewsQuery();

  const itemWidth = layout.isSmallDevice ? 315 : 350;

  let content = (
    <SkeletonContent
      isLoading={true}
      containerStyle={{ width: itemWidth, height: 150, borderRadius: 10 }}
    />
  );

  if (isSuccess) {
    content = (
      <NewsItem
        key="Top News"
        title={news[0].title}
        emoji={news[0].emoji}
        content={news[0].content}
        dateUpdated={new Date(news[0].date_updated)}
        department={news[0].department}
        width={itemWidth}
      />
    );
  }

  return content;
}
