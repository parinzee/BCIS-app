import { View, StyleSheet } from "react-native";
import { Caption, Colors, Surface, Title } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import MarkdownRenderRules from "../constants/MarkdownRenderRules";

interface NewsItemProps {
  emoji: string;
  title: string;
  content: string;
  dateUpdated: Date;
  width: number;
  department: "K" | "E" | "H" | null;
}

export default function NewsItem({
  emoji,
  title,
  content,
  dateUpdated,
  width,
  department,
}: NewsItemProps) {
  let borderColor;

  if (department == "K") {
    borderColor = Colors.orange600;
  } else if (department == "E") {
    borderColor = Colors.green600;
  } else if (department == "H") {
    borderColor = Colors.lightBlue600;
  } else {
    borderColor = "#7e7e7e";
  }

  return (
    <Surface
      style={{
        ...styles.surface,
        width: width,
      }}
    >
      <View style={{ ...styles.titleBar, borderBottomColor: borderColor }}>
        <Title>{title}</Title>
        <Title>{emoji}</Title>
      </View>
      <View style={styles.body}>
        <Markdown
          rules={MarkdownRenderRules}
          style={{
            paragraph: { marginTop: 0, marginBottom: 0 },
          }}
        >
          {content}
        </Markdown>
        <Caption style={styles.datePosted}>
          Posted{" "}
          {dateUpdated.toLocaleString("en-us", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
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
  },
  surface: {
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 8,
    height: 150,
    maxWidth: 700,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  datePosted: {
    textAlign: "right",
  },
  link: {
    color: "#4286f4",
  },
});
