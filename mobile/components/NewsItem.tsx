import { View, StyleSheet } from "react-native";
import { Surface, Title } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";

interface NewsItemProps {
  emoji: string;
  title: string;
  description: string;
}

export default function NewsItem({ emoji, title, description }: NewsItemProps) {
  return (
    <Surface style={styles.surface}>
      <View style={styles.titleBar}>
        <Title>{title}</Title>
        <Title>{emoji}</Title>
      </View>
      <Markdown
        // @ts-ignore
        rules={MarkdownRenderRules}
      >
        {description}
      </Markdown>
    </Surface>
  );
}

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  surface: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
    minWidth: 300,
    height: 150,
  },
});
