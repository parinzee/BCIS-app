import SkeletonContent from "@03balogun/react-native-skeleton-content";
import * as React from "react";
import { Alert } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import useLayout from "../hooks/useLayout";
import { useGetFeaturedQuery } from "../slices/apiSlice";
import FeaturedItem from "./FeaturedItem";

export default function FeaturedItemCarousel() {
  const layout = useLayout();
  const {
    data: featured,
    isLoading,
    isSuccess,
    isError,
    isFetching,
  } = useGetFeaturedQuery();

  let content = (
    <SkeletonContent
      isLoading={true}
      containerStyle={{ width: 300, height: 120 }}
    />
  );

  if (isSuccess) {
    content = (
      <Carousel
        mode="parallax"
        snapEnabled={true}
        data={featured}
        width={layout.window.width}
        modeConfig={{
          parallaxScrollingOffset: 150,
          parallaxScrollingScale: 0.8,
        }}
        autoPlay={true}
        autoPlayInterval={2000}
        height={130}
        loop={true}
        scrollAnimationDuration={800}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        renderItem={({ item, index }) => (
          <FeaturedItem
            title={item.title}
            emoji={item.emoji}
            redirect_uri={item.redirect_URI}
            bgColors={[item.bg_color1, item.bg_color2]}
          />
        )}
      />
    );
  } else if (isError) {
    Alert.alert("Unable to Fetch Data", "Please check network connection");
  }

  return content;
}
