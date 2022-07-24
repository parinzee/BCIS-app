import * as React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  Text,
  List,
  Avatar,
  Title,
  Divider,
  TouchableRipple,
  Subheading,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import FastImage from "react-native-fast-image";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { logout } from "../slices/userSlice";
import { Feather } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import { clearAuthTokens } from "../utils/AWSCognito";

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

function AuthenticatedView() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const NavigationItems: NavigationItemProps[] = [
    {
      title: "Grade Calculator",
      icon: "calculator",
      onPress: () => {
        navigation.navigate("GradeCalculator");
      },
    },
    {
      title: "My Rewards",
      icon: "medal",
      onPress: () => {
        navigation.navigate("MyRewards");
      },
    },
    {
      title: "Anonymous Feedback",
      icon: "chat-question",
      onPress: () => {
        Linking.openURL("https://forms.gle/VkWpj68KLUCwEc1C7");
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

function UnauthenticatedView() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <LottieView
        source={require("../assets/lottie/giftbox.json")}
        style={{ width: 100, height: 100 }}
        autoPlay
        loop
      />
      <Title>Sign In / Register</Title>
      <Subheading>To Access Numerous Benefits!</Subheading>
      <View style={{ marginVertical: 10 }}>
        <Text style={{ ...styles.text, fontWeight: "bold" }}>
          ✅ Grade Calculator
        </Text>
        <Text style={styles.text}>✅ Reward System</Text>
        <Text style={styles.text}>✅ Anonymous Feedback</Text>
        <Text style={styles.text}>
          ✅ Easy Access to{" "}
          <Text style={{ ...styles.text, fontWeight: "bold" }}>
            School Calendar
          </Text>
        </Text>
        <Text style={styles.text}>✅ Easy Access to Student Handbook</Text>
      </View>
      <TouchableRipple
        style={{ borderRadius: 45, marginTop: 10 }}
        onPress={() => navigation.navigate("Login")}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <Feather
          name="arrow-right-circle"
          color={theme.colors.primary}
          size={45}
        />
      </TouchableRipple>
    </View>
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
      {user.email != null ? <AuthenticatedView /> : <UnauthenticatedView />}
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
