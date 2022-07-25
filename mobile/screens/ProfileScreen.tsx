import * as React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  Text,
  List,
  Avatar,
  Title,
  Divider,
  TouchableRipple,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import FastImage from "react-native-fast-image";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../slices/userSlice";
import { clearAuthTokens } from "../utils/AWSCognito";
import SignupBenefits from "../components/SignupBenefits";

interface NavigationItemProps {
  title: string;
  icon: string;
  onPress: () => void;
}

interface AvatarWrapperProps {
  user: RootState["user"];
}
function Item({ title, icon, onPress }: NavigationItemProps) {
  return (
    <TouchableRipple onPress={onPress} rippleColor="rgba(0, 0, 0, .32)">
      <List.Item
        title={title}
        left={(props) => <List.Icon {...props} icon={icon} />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
    </TouchableRipple>
  );
}

function AvatarWrapper({ user }: AvatarWrapperProps) {
  if (user.profileURL != null) {
    return (
      <FastImage source={{ uri: user.profileURL }} style={styles.avatar} />
    );
  } else if (user.name != null) {
    return (
      <Avatar.Text label={user.name[0]} size={100} style={styles.avatar} />
    );
  } else {
    return <Avatar.Text label="G" size={100} style={styles.avatar} />;
  }
}

function AuthenticatedView({ user }: { user: RootState["user"] }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  let handbookURL = "https://www.bcis.ac.th/academic/download/";
  if (user.department == "K") {
    handbookURL =
      "https://www.bcis.ac.th/wp-content/uploads/2021/08/BICN-Parents-Handbook-SY2021-2022.pdf";
  } else if (user.department == "E") {
    handbookURL =
      "https://www.bcis.ac.th/wp-content/uploads/2021/08/Copy-of-Elementary-Handbook-2021-2022.pdf";
  } else if (user.department == "H") {
    handbookURL =
      "https://www.bcis.ac.th/wp-content/uploads/2021/08/HS-Parent-Student-Handbook-2021-2022.pdf";
  }

  const NavigationItems: NavigationItemProps[] = [
    {
      title: "Grade Calculator",
      icon: "calculator",
      onPress: () => {
        navigation.navigate("GradeCalculator");
      },
    },
    {
      title: "School Calendar",
      icon: "calendar",
      onPress: () => {
        navigation.navigate("Webview", {
          title: "School Calendar",
          url: "https://bcis-app.s3.ap-southeast-1.amazonaws.com/2022-2023+Tentative+BCIS+Calendar.pdf",
        });
      },
    },
    {
      title: "Student Handbook",
      icon: "book-account",
      onPress: () => {
        navigation.navigate("Webview", {
          title: "Student Handbook",
          url: handbookURL,
        });
      },
    },
    {
      title: "Feedback",
      icon: "chat-question",
      onPress: () => {
        navigation.navigate("Webview", {
          title: "Feedback",
          url: "https://forms.gle/VkWpj68KLUCwEc1C7",
        });
      },
    },
    {
      title: "Logout",
      icon: "logout-variant",
      onPress: async () => {
        await clearAuthTokens();
        dispatch(logout());
      },
    },
  ];

  return (
    <FlatList
      data={NavigationItems}
      renderItem={({ item }) => (
        <Item title={item.title} icon={item.icon} onPress={item.onPress} />
      )}
      keyExtractor={(item) => item.title}
    />
  );
}

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <View style={styles.container}>
      <AvatarWrapper user={user} />
      {user.name != null ? (
        <Title style={styles.name}>{user.name}</Title>
      ) : (
        <Title style={styles.name}>Guest User</Title>
      )}
      <Divider />
      {user.email != null ? (
        <AuthenticatedView user={user} />
      ) : (
        <SignupBenefits />
      )}
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
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
  name: {
    alignSelf: "center",
    paddingVertical: 10,
  },
  settingsView: {
    paddingLeft: 15,
  },
  text: {
    fontSize: 17,
    marginVertical: 5,
  },
});
