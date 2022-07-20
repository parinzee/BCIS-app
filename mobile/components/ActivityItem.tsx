import { StyleSheet, View, ImageBackground, Pressable } from "react-native";
import { Caption, Surface, Title } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";
import * as React from "react";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { layout } from "../hooks/useLayout";

interface ActivityItemProps {
  thumbnailURL: string;
  emoji: string;
  title: string;
  activityDate: Date;
  dateUpdated: Date;
  videoURL: string | null;
  content: string;
  layout: layout;
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
  layout,
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
      <Surface
        style={layout.isLargeDevice ? styles.surfaceLarge : styles.surface}
      >
        <SkeletonContent
          isLoading={imageEncoding == null}
          containerStyle={
            layout.isLargeDevice ? styles.thumbnailLarge : styles.thumbnail
          }
        >
          <ImageBackground
            // Here we type cast, since SkeletonContent won't render the component if
            // isLoading is true
            source={{ uri: imageEncoding as string }}
            style={
              layout.isLargeDevice ? styles.thumbnailLarge : styles.thumbnail
            }
          >
            {videoURL != null ? (
              <FontAwesome name="play" size={50} color="red" />
            ) : null}
          </ImageBackground>
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
                <View
                  style={layout.isLargeDevice ? { width: 340 } : { width: 240 }}
                >
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
            <Title style={styles.dateText}>{activityDate.getDay()}</Title>
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
    width: 350,
    height: 140,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  thumbnailLarge: {
    width: 450,
    height: 240,
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
    width: 350,
    maxWidth: 700,
    alignSelf: "center",
    flexDirection: "column",
  },
  surfaceLarge: {
    marginVertical: 20,
    borderRadius: 10,
    elevation: 8,
    height: 400,
    width: 450,
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
