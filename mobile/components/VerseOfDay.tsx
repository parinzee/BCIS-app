import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";
import { layout } from "../hooks/useLayout";
import { useGetVerseOfDayQuery } from "../slices/apiSlice";

interface VerseOfDayProps {
  layout: layout;
}

export default function VerseOfDay({ layout }: VerseOfDayProps) {
  const { data: votd, isSuccess } = useGetVerseOfDayQuery();
  let itemWidth = 350;

  if (layout.isSmallDevice) {
    itemWidth = 315;
  } else if (layout.isMediumDevice || layout.isLargeDevice) {
    itemWidth = 720;
  }

  let content = (
    <SkeletonContent isLoading={true} containerStyle={styles.container} />
  );

  if (isSuccess) {
    content = (
      <Surface
        style={{ ...styles.container, width: itemWidth, marginBottom: 20 }}
      >
        <ImageBackground
          source={{ uri: votd.bg_URL }}
          style={{ ...styles.container, overflow: "hidden", width: itemWidth }}
        >
          <View style={styles.innerContainer}>
            <Text
              style={{
                fontSize: 17,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
              numberOfLines={5}
            >
              {votd.votd.content}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: "white",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              {votd.votd.display_ref}
            </Text>
          </View>
        </ImageBackground>
      </Surface>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    alignSelf: "center",
    elevation: 8,
    borderRadius: 10,
  },
  innerContainer: {
    height: 200,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
