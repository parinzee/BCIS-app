import * as React from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";
import {
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
import { clearAuthTokens, getTokens } from "../utils/AWSCognito";
import SignupBenefits from "../components/SignupBenefits";
import { deleteAPIUser } from "../utils/API";

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
  let handbookFallbackURL = "https://www.bcis.ac.th/academic/download/";
  if (user.department == "K") {
    handbookURL =
      "https://www.bcis.ac.th/wp-content/uploads/2022/08/KG-Handbook2022-2023-1-1.pdf";
    handbookFallbackURL =
      "https://drive.google.com/file/d/1fPUY58_32AqzyO6EG9cj1c3-MdQNtXkf/view?usp=sharing";
  } else if (user.department == "E") {
    handbookURL =
      "https://www.bcis.ac.th/wp-content/uploads/2022/08/Elementary-Handbook-2022-2023.pdf";
    handbookFallbackURL =
      "https://drive.google.com/file/d/1WOzfUbZiYuysRWxtyd88cjYG3DJb0RLL/view?usp=sharing";
  } else if (user.department == "H") {
    handbookURL =
      "https://www.bcis.ac.th/wp-content/uploads/2022/08/HS-Parent-Student-Handbook-2022-2023.pdf";
    handbookFallbackURL =
      "https://drive.google.com/file/d/1iwD9GnYNmLh1Qx-7orV-GFtKmnyQhJ1x/view?usp=sharing";
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
          fallbackURL:
            "https://drive.google.com/file/d/1aT2L9wP43zSFvzDkQBFBtPz3Ujvb7mRH/view?usp=sharing",
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
          fallbackURL: handbookFallbackURL,
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
      title: "Privacy Policy",
      icon: "shield-check",
      onPress: () => {
        navigation.navigate("Webview", {
          title: "Privacy Policy",
          url: "https://github.com/parinzee/BCIS-app/blob/main/PRIVACY.md",
        });
      },
    },
    {
      title: "Delete Account",
      icon: "alert",
      onPress: async () => {
        Alert.alert(
          "This action is irreversible",
          "Are you sure you would like to DELETE ALL YOUR DATA?",
          [
            {
              text: "Delete all data",
              style: "destructive",
              onPress: async () => {
                const { accessToken } = await getTokens();
                await clearAuthTokens();
                // This can only be called when the user is logged in
                await deleteAPIUser(user.email as string, accessToken);
                dispatch(logout());
              },
            },
            { text: "Cancel" },
          ]
        );
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
