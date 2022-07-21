import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Surface } from "react-native-paper";
import { useGetVerseOfDayQuery } from "../slices/apiSlice";

export default function VerseOfDay() {
  const { data: votd, isSuccess } = useGetVerseOfDayQuery();
  let content = (
    <SkeletonContent isLoading={true} containerStyle={styles.container} />
  );

  if (isSuccess) {
    content = (
      <Surface style={styles.container}>
        <ImageBackground
          source={{ uri: votd.bg_URL }}
          style={{ ...styles.container, overflow: "hidden" }}
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
    width: 310,
    height: 200,
    alignSelf: "center",
    elevation: 8,
    borderRadius: 10,
  },
  innerContainer: {
    width: 310,
    height: 200,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
