import { StyleSheet, View, Pressable, Platform } from "react-native";
import { Caption, Surface, Title } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";
import * as React from "react";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import FastImage from "react-native-fast-image";

interface ActivityItemProps {
  thumbnailURL: string;
  emoji: string;
  title: string;
  activityDate: Date;
  dateUpdated: Date;
  videoURL: string | null;
  content: string;
  width: number;
}

const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export default function ActivityItem({
  thumbnailURL,
  emoji,
  title,
  activityDate,
  dateUpdated,
  content,
  videoURL,
  width,
}: ActivityItemProps) {
  const [imageEncoding, setImageEncoding] = React.useState<string | null>(null);

  React.useEffect(() => {
    const reader = new FileReader();
    fetch(thumbnailURL)
      .then((resp) => resp.blob())
      .then((blob) => {
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setImageEncoding(reader.result as string);
        };
      });
  }, []);

  return (
    <Pressable
      onPress={() => {
        if (videoURL != null) {
          Linking.openURL(videoURL);
        }
      }}
    >
      <Surface style={{ ...styles.surface, width: width }}>
        <SkeletonContent
          isLoading={imageEncoding == null}
          containerStyle={{ ...styles.thumbnail, width: width }}
        >
          <FastImage
            // Here we type cast, since SkeletonContent won't render the component if
            // isLoading is true
            source={{ uri: imageEncoding as string }}
            style={{ ...styles.thumbnail, width: width }}
            // https://github.com/DylanVann/react-native-fast-image/issues/710
            fallback={Platform.OS == "android" ? true : false}
          >
            {videoURL != null ? (
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome name="play" size={40} color="red" />
              </View>
            ) : null}
          </FastImage>
        </SkeletonContent>
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <View style={{ flexDirection: "row" }}>
              <Title style={styles.eventText}>{emoji}</Title>
              <View style={{ marginLeft: 5 }}>
                <Title style={styles.eventText}>{title}</Title>
                <Caption>
                  Posted{" "}
                  {dateUpdated.toLocaleString("en-us", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Caption>
                <View style={{ width: width - 90 }}>
                  <Markdown rules={MarkdownRenderRules} style={styles}>
                    {content}
                  </Markdown>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.dateTextContainer}>
            <Title style={styles.dateText}>
              {monthNames[activityDate.getMonth()]}
            </Title>
            <Title style={styles.dateText}>{activityDate.getDate()}</Title>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1.25,
    borderBottomColor: "#7e7e7e",
  },
  thumbnail: {
    height: 140,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  surface: {
    marginVertical: 20,
    borderRadius: 10,
    elevation: 8,
    height: 300,
    marginHorizontal: 10,
    maxWidth: 700,
    alignSelf: "center",
    flexDirection: "column",
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  body: {
    flexDirection: "column",
  },
  eventText: {
    fontWeight: "bold",
    marginVertical: 0,
  },
  dateText: {
    fontWeight: "900",
    marginVertical: -3,
    textAlign: "center",
  },
  dateTextContainer: {
    flexDirection: "column",
  },
});

export { styles };
