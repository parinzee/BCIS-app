import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Image,
  StatusBar,
} from "react-native";
import * as React from "react";
import SignInWithGoogle from "../components/SignInWithGoogle";
import {
  Caption,
  HelperText,
  Subheading,
  TextInput,
  Title,
  Text,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { Button } from "react-native-paper";
import {
  handleCogntioLogin,
  handleCogntioRegister,
} from "../constants/AWSCognito";
import { useHeaderHeight } from "@react-navigation/elements";

export default function LoginScreen() {
  const headerHeight = useHeaderHeight();
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={
        StatusBar?.currentHeight == undefined
          ? headerHeight
          : headerHeight + StatusBar.currentHeight
      }
    >
      <Image
        source={require("../assets/images/bcis_logo.png")}
        style={styles.logo}
      />
      <View>
        <Subheading style={styles.title}>BCIS SC — LINK</Subheading>
        <Text style={styles.subheading}>By Parin</Text>
      </View>
      <Controller
        control={control}
        rules={{
          pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
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
            autoCapitalize="none"
          />
        )}
        name="email"
      />
      <HelperText type="error" visible={errors.email?.type == "pattern"}>
        Email is invalid
      </HelperText>

      <Controller
        control={control}
        rules={{
          required: true,
          minLength: 8,
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
      <HelperText type="error" visible={errors.password?.type == "minLength"}>
        Password must be more than 8 characters
      </HelperText>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit((data) => {
            handleCogntioLogin(data.email, data.password);
          })}
        >
          Sign In
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit((data) => {
            handleCogntioRegister(data.email, data.password);
          })}
        >
          Sign Up
        </Button>
      </View>
      <View>
        <Caption style={styles.caption}>Or</Caption>
      </View>
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
    width: 150,
    height: 150,
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
  helperText: {
    textAlign: "left",
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
  },
  subheading: {
    textAlign: "center",
  },
  caption: {
    fontSize: 15,
    textAlign: "center",
  },
});
