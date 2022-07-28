import { StyleSheet, Platform } from "react-native";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";
import { Surface, Text, Caption } from "react-native-paper";
import * as React from "react";
import ImageModal from "react-native-image-modal";
import SkeletonContent from "@03balogun/react-native-skeleton-content";

interface PortfolioItemProps {
  title: string;
  content: string;
  dateUpdated: Date;
  imageURL: string;
  width: number;
  imageBackground: string;
}

export default function PortfolioItem({
  title,
  content,
  dateUpdated,
  width,
  imageURL,
  imageBackground,
}: PortfolioItemProps) {
  const [imageEncoding, setImageEncoding] = React.useState<string | null>(null);

  if (Platform.OS != "android") {
    React.useEffect(() => {
      const reader = new FileReader();
      fetch(imageURL)
        .then((resp) => resp.blob())
        .then((blob) => {
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            setImageEncoding(reader.result as string);
          };
        });
    }, []);

    return (
      <Surface style={{ ...styles.container, width: width }}>
        <View style={styles.bodyContainer}>
          <View style={styles.titleContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{title}</Text>
            <Caption>
              {dateUpdated.toLocaleString("en-us", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Caption>
          </View>
          <Markdown
            rules={MarkdownRenderRules}
            style={{ link: { color: "#4286f4" } }}
          >
            {content}
          </Markdown>
        </View>
        <SkeletonContent
          isLoading={imageURL == null}
          containerStyle={{ ...styles.image, width: width }}
        >
          <View style={{ ...styles.image, width: width }}>
            <ImageModal
              resizeMode="contain"
              modalImageResizeMode="contain"
              imageBackgroundColor={imageBackground}
              isTranslucent={true}
              // Maintain 16:9 aspect ratio-ish
              style={{
                ...styles.image,
                width: width,
              }}
              source={{
                // Type casting, since Skeleton content will only render when
                // imageEncoding is a string anyway
                uri: imageEncoding as string,
              }}
            />
          </View>
        </SkeletonContent>
      </Surface>
    );
  } else {
    return (
      <Surface style={{ ...styles.container, width: width }}>
        <View style={styles.bodyContainer}>
          <View style={styles.titleContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{title}</Text>
            <Caption>
              {dateUpdated.toLocaleString("en-us", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Caption>
          </View>
          <Markdown
            rules={MarkdownRenderRules}
            style={{ link: { color: "#4286f4" } }}
          >
            {content}
          </Markdown>
        </View>
        <View style={{ ...styles.image, width: width }}>
          <ImageModal
            resizeMode="contain"
            modalImageResizeMode="contain"
            imageBackgroundColor={imageBackground}
            isTranslucent={true}
            // Maintain 16:9 aspect ratio-ish
            style={{
              ...styles.image,
              width: width,
            }}
            source={{
              // Type casting, since Skeleton content will only render when
              // imageEncoding is a string anyway
              uri: imageURL,
            }}
          />
        </View>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    elevation: 12,
    height: 400,
    borderRadius: 15,
    justifyContent: "space-between",
    marginVertical: 20,
    marginHorizontal: 10,
    alignSelf: "center",
  },
  bodyContainer: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  titleContainer: {
    flexDirection: "column",
  },
  image: {
    height: 200,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: "hidden",
  },
});
