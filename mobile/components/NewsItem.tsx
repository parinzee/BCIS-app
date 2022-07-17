import { View, StyleSheet } from "react-native";
import { Caption, Surface, Title } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";

interface NewsItemProps {
  emoji: string;
  title: string;
  description: string;
  dateUpdated: Date;
  width: number;
}

export default function NewsItem({
  emoji,
  title,
  description,
  dateUpdated,
  width,
}: NewsItemProps) {
  return (
    <Surface
      style={{
        ...styles.surface,
        width: width,
      }}
    >
      <View style={styles.titleBar}>
        <Title>{title}</Title>
        <Title>{emoji}</Title>
      </View>
      <View style={styles.body}>
        <Markdown rules={MarkdownRenderRules} style={styles}>
          {description}
        </Markdown>
        <Caption style={styles.datePosted}>
          Posted{" "}
          {`${dateUpdated.getDate()}/${dateUpdated.getMonth()}/${dateUpdated.getFullYear()}`}
        </Caption>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1.25,
    borderBottomColor: "#7e7e7e",
  },
  surface: {
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
    height: 150,
    maxWidth: 700,
    alignSelf: "center",
  },
  surfaceLarge: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
    height: 150,
  },
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  datePosted: {
    flex: 0,
    textAlign: "right",
  },
  link: {
    color: "#4286f4",
  },
});
