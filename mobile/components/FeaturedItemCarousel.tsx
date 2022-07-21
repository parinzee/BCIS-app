import SkeletonContent from "@03balogun/react-native-skeleton-content";
import * as React from "react";
import { Alert } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { layout } from "../hooks/useLayout";
import { useGetFeaturedQuery } from "../slices/apiSlice";
import FeaturedItem from "./FeaturedItem";

interface FeaturedItemCarouselProps {
  layout: layout;
}

export default function FeaturedItemCarousel({
  layout,
}: FeaturedItemCarouselProps) {
  const { data: featured, isSuccess, isError } = useGetFeaturedQuery();

  let scrollingOffset = 150;

  if (layout.isMediumDevice || layout.isLargeDevice) {
    scrollingOffset = 490;
  }

  let content = (
    <SkeletonContent
      isLoading={true}
      containerStyle={{ width: 300, height: 120 }}
    />
  );

  if (isSuccess) {
    content = (
      <Carousel
        // Force re-render when rotating screen
        key={layout.window.height.toString() + layout.window.width.toString()}
        mode="parallax"
        snapEnabled={true}
        data={featured}
        width={layout.window.width}
        modeConfig={{
          parallaxScrollingOffset: scrollingOffset,
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
