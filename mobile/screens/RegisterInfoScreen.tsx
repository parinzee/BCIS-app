import { useForm, Controller } from "react-hook-form";
import { Button, TouchableRipple } from "react-native-paper";
import {
  getTokens,
  getUserAttributes,
  handleCogntioLogin,
  handleCogntioRegister,
} from "../utils/AWSCognito";
import { useHeaderHeight } from "@react-navigation/elements";
import { RootStackScreenProps } from "../types";
import {
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import {
  Caption,
  HelperText,
  Subheading,
  TextInput,
  Text,
} from "react-native-paper";
import LottieView from "lottie-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as React from "react";
import useTheme from "../hooks/useTheme";
import { Feather } from "@expo/vector-icons";
import { registerAPIUser } from "../utils/API";
import { useDispatch } from "react-redux";
import { login } from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";

export default function RegisterInfoScreen() {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [userTypeDropdownOpen, setUserTypeDropdownOpen] = React.useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] =
    React.useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      userType: null,
      department: null,
      teamColor: null,
    },
  });

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior="padding"
        keyboardVerticalOffset={
          StatusBar?.currentHeight == undefined
            ? headerHeight
            : headerHeight + StatusBar.currentHeight
        }
      >
        <LottieView
          source={require("../assets/lottie/register.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <View>
          <Text style={styles.subheading}>
            Please enter kindly enter some more info about yourself
          </Text>
        </View>
        <Controller
          control={control}
          rules={{
            required: true,
            maxLength: 50,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Name"
              mode="outlined"
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              style={styles.textInput}
              autoCapitalize="words"
            />
          )}
          name="name"
        />
        <HelperText type="error" visible={errors.name != undefined}>
          {errors.name?.type == "required"
            ? "Name is required"
            : "Name must not be longer than 50 characters"}
        </HelperText>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DropDownPicker
              placeholder="Select a user type"
              multiple={false}
              value={value}
              setValue={(callback) => onChange(callback(value))}
              items={[
                { label: "Student", value: "S" },
                { label: "Parent", value: "P" },
                { label: "Teacher/Staff", value: "T" },
              ]}
              open={userTypeDropdownOpen}
              setOpen={setUserTypeDropdownOpen}
              theme={theme.dark ? "DARK" : "LIGHT"}
              containerStyle={styles.textInput}
            />
          )}
          name="userType"
        />
        <HelperText type="error" visible={errors.userType?.type == "required"}>
          User Type is required
        </HelperText>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <DropDownPicker
              placeholder="Select a department"
              multiple={false}
              value={value}
              setValue={(callback) => onChange(callback(value))}
              items={[
                { label: "Kindergarten", value: "K" },
                { label: "Elementary", value: "E" },
                { label: "Highschool", value: "H" },
              ]}
              open={departmentDropdownOpen}
              setOpen={setDepartmentDropdownOpen}
              theme={theme.dark ? "DARK" : "LIGHT"}
              containerStyle={styles.textInput}
              dropDownDirection="BOTTOM"
              zIndex={4000}
            />
          )}
          name="department"
        />
        <HelperText
          type="error"
          visible={errors.department?.type == "required"}
        >
          Deparment is required
        </HelperText>
        <TouchableRipple
          onPress={handleSubmit(async (data) => {
            const { accessToken } = await getTokens();
            const { email, picture } = await getUserAttributes(accessToken);
            await registerAPIUser(
              accessToken,
              data.name,
              // Email is guranteed to be exist on UserAttributes
              email as string,
              data.userType,
              data.department,
              data.teamColor
            )
              .then(() =>
                dispatch(
                  login({
                    name: data.name,
                    email: email,
                    profileURL: picture,
                    department: data.department,
                  })
                )
              )
              .catch(() => {
                Alert.alert(
                  "Signup Failed",
                  "Please check your internet or try again later."
                );
              });
            // navigation.navigate("Root");
          })}
          rippleColor="rgba(0, 0, 0, .32)"
          style={{ marginTop: 10, borderRadius: 45 }}
        >
          <Feather
            name="arrow-right-circle"
            size={45}
            color={theme.colors.primary}
          />
        </TouchableRipple>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 175,
    height: 175,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: 250,
    height: 48,
    marginVertical: 5,
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
