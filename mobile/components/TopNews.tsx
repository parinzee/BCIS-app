import NewsItem from "./NewsItem";
import { useGetNewsQuery } from "../slices/apiSlice";
import { layout } from "../hooks/useLayout";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { View, StyleSheet } from "react-native";

interface TopNewsProps {
  layout: layout;
}

export default function TopNews({ layout }: TopNewsProps) {
  const { data: news, isSuccess } = useGetNewsQuery();

  const itemWidth = layout.isSmallDevice ? 315 : 350;

  let content = (
    <SkeletonContent
      isLoading={true}
      containerStyle={{
        width: itemWidth,
        height: 150,
        borderRadius: 10,
        marginVertical: 20,
      }}
    />
  );

  if (isSuccess) {
    if (layout.isLargeDevice || layout.isMediumDevice) {
      content = (
        <View style={styles.horizontalContainer}>
          <NewsItem
            key="Top News 1"
            title={news[0].title}
            emoji={news[0].emoji}
            content={news[0].content}
            dateUpdated={new Date(news[0].date_updated)}
            department={news[0].department}
            width={itemWidth}
          />
          <NewsItem
            key="Top News 2"
            title={news[1].title}
            emoji={news[1].emoji}
            content={news[1].content}
            dateUpdated={new Date(news[1].date_updated)}
            department={news[1].department}
            width={itemWidth}
          />
        </View>
      );
    } else {
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
  }

  return content;
}

const styles = StyleSheet.create({
  horizontalContainer: {
    width: 740,
    flexDirection: "row",
  },
});
