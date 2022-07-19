import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { Colors } from "react-native-paper";

export default function SignInWithGoogle() {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={require("../assets/images/g-normal.png")}
        style={styles.logo}
      />
      <Text style={styles.text}>Sign In With Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: 230,
    backgroundColor: Colors.white,
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 46,
    width: 46,
  },
  text: {
    marginLeft: 5,
    fontSize: 15,
    color: Colors.black,
    fontWeight: "bold",
  },
});
