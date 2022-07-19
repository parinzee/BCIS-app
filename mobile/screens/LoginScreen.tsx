import { KeyboardAvoidingView, StyleSheet, View, Image } from "react-native";
import * as React from "react";
import SignInWithGoogle from "../components/SignInWithGoogle";
import { Caption, Divider, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Button } from "react-native-paper";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={require("../assets/images/bcis_logo.png")}
        style={styles.logo}
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email"
            mode="outlined"
            onBlur={onBlur}
            value={value}
            onChangeText={onChange}
            style={styles.textInput}
            textContentType="emailAddress"
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Password"
            mode="outlined"
            onBlur={onBlur}
            value={value}
            onChangeText={onChange}
            style={styles.textInput}
            textContentType="password"
            secureTextEntry={true}
          />
        )}
        name="password"
      />
      <View style={styles.buttonContainer}>
        <Button mode="contained">Sign In</Button>
        <Button mode="contained">Sign Up</Button>
      </View>
      <Caption style={{ fontSize: 15 }}>Or</Caption>
      <SignInWithGoogle />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  textInput: {
    width: 230,
    height: 48,
    marginVertical: 5,
  },
  buttonContainer: {
    width: 230,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
