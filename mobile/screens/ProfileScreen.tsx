import * as React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { List, Avatar, Title, Divider } from "react-native-paper";

interface NavigationItem {
  title: string;
  icon: string;
}

const NavigationItems: NavigationItem[] = [
  {
    title: "Grade Calculator",
    icon: "calculator",
  },
  {
    title: "My Certificates",
    icon: "certificate",
  },
  {
    title: "Contact Us",
    icon: "chat-question",
  },
];

function Item({ title, icon }: NavigationItem) {
  return (
    <List.Item
      title={title}
      left={(props) => <List.Icon {...props} icon={icon} />}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
    />
  );
}

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Avatar.Image
        size={100}
        source={require("../assets/images/placeholder-profile.jpeg")}
        style={styles.avatar}
      />
      <Title style={styles.name}>Shiba "Doggo" Inu</Title>
      <Divider />
      <FlatList
        data={NavigationItems}
        renderItem={({ item }) => <Item title={item.title} icon={item.icon} />}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 20,
  },
  avatar: {
    alignSelf: "center",
  },
  name: {
    alignSelf: "center",
    paddingVertical: 10,
  },
});
