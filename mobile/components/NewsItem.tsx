import { View, StyleSheet } from "react-native";
import { Divider, Surface, Title } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";

interface NewsItemProps {
  emoji: string;
  title: string;
  description: string;
  width: number;
}

export default function NewsItem({
  emoji,
  title,
  description,
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
      <Divider />
      <Markdown rules={MarkdownRenderRules} style={styles}>
        {description}
      </Markdown>
    </Surface>
  );
}

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  surface: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
    height: 150,
    maxWidth: 700,
  },
  surfaceLarge: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
    height: 150,
  },
  link: {
    color: "#4286f4",
  },
});
