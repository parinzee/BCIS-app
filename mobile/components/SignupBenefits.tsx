import * as React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Title, Subheading, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import useTheme from "../hooks/useTheme";

export default function SignupBenefits() {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("Login")}
    >
      <View style={styles.container}>
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
          <Text style={styles.text}>✅ Anonymous Feedback</Text>
          <Text style={{ ...styles.text, fontWeight: "bold" }}>
            ✅ Hall of Fame (Student Portfolios)
          </Text>
          <Text style={styles.text}>✅ Student Handbook</Text>
          <Text style={{ ...styles.text, fontWeight: "bold" }}>
            ✅ School Calendar
          </Text>
        </View>
        <Button
          mode="contained"
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate("Login")}
        >
          Continue
        </Button>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 17,
    marginVertical: 5,
  },
});
