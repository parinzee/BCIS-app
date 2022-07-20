import { StyleSheet, View } from "react-native";
import ActivityItem from "../components/ActivityItem";
import useLayout from "../hooks/useLayout";

export default function ActivityScreen() {
  const layout = useLayout();
  return (
    <View style={styles.container}>
      <ActivityItem
        thumbnailURL="https://images.unsplash.com/photo-1594623274890-6b45ce7cf44a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4170&q=80"
        emoji="🏀"
        title="BCIS vs ASCOT"
        updatedDate={new Date()}
        activityDate={new Date()}
        content="HEY I WANT TO BREASKKKKKKK FREEEEEE I WANT TO BREAK FREEE AAAAAAAAAAAA AJKJKJKJJKJKJKJK "
        videoURL="https://www.youtube.com/watch?v=UJWk_KNbDHo&list=RDGTWqwSNQCcg&index=12"
        layout={layout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
