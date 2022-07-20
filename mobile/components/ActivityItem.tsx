import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { Caption, Headline, Surface, Text, Title } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";
import * as React from "react";
import SkeletonContent from "@03balogun/react-native-skeleton-content";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";

interface ActivityItemProps {
  thumbnailURL: string;
  emoji: string;
  title: string;
  activityDate: Date;
  updatedDate: Date;
  videoURL: string | null;
  description: string;
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
  updatedDate,
  description,
  videoURL,
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
      <Surface style={styles.surface}>
        <SkeletonContent
          isLoading={imageEncoding == null}
          containerStyle={styles.thumbnail}
        >
          <ImageBackground
            // Here we type cast, since SkeletonContent won't render the component if
            // isLoading is true
            source={{ uri: imageEncoding as string }}
            style={styles.thumbnail}
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
                  {updatedDate.toLocaleString("en-us", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Caption>
                <View style={{ width: 240 }}>
                  <Markdown rules={MarkdownRenderRules} style={styles}>
                    {description}
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
  },
  surface: {
    marginVertical: 20,
    borderRadius: 10,
    elevation: 8,
    height: 300,
    width: 350,
    maxWidth: 700,
    alignSelf: "center",
    overflow: "hidden",
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
    marginVertical: 0,
    textAlign: "center",
  },
  dateTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
});
