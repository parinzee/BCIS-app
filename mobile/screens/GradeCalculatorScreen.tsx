import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import {
  Text as ReactNativeText,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  ActivityIndicator,
  Surface,
  Text,
  DataTable,
  Title,
  Subheading,
  TextInput,
  Button,
  Colors,
  Divider,
} from "react-native-paper";
import { useSelector } from "react-redux";
import useLayout, { layout } from "../hooks/useLayout";
import {
  useLazyGetGPAScoreQuery,
  usePostGPAScoreMutation,
} from "../slices/apiSlice";
import { RootState } from "../store";
import * as React from "react";
import { getTokens } from "../utils/AWSCognito";
import { Controller, useForm, Control } from "react-hook-form";

const Tab = createMaterialTopTabNavigator();

type TopTabParamList = {
  ElementaryCalculator: { layout: layout };
};

type TopTabScreenProps<Screen extends keyof TopTabParamList> =
  MaterialTopTabScreenProps<TopTabParamList, Screen>;

type ElementaryFormValues = {
  math: number;
  science: number;
  english: number;
  social: number;
};

type HSFormValues = {
  core1: number;
  core2: number;
  core3: number;
  core4: number;
  elec1: number;
  elec2: number;
  elec3: number;
  elec4: number;
  elec5: number;
  elec6: number;
};

function ConvertScaleStandard(grade: number) {
  if (grade >= 93) {
    return 4.0;
  } else if (grade >= 90) {
    return 3.7;
  } else if (grade >= 87) {
    return 3.3;
  } else if (grade >= 83) {
    return 3.0;
  } else if (grade >= 80) {
    return 2.7;
  } else if (grade >= 77) {
    return 2.3;
  } else if (grade >= 73) {
    return 2.0;
  } else if (grade >= 70) {
    return 1.7;
  } else if (grade >= 67) {
    return 1.3;
  } else if (grade >= 63) {
    return 1.0;
  } else if (grade >= 60) {
    return 0.7;
  } else {
    return 0;
  }
}

function ConvertScaleHonors(grade: number) {
  if (grade >= 93) {
    return 4.5;
  } else if (grade >= 90) {
    return 4.2;
  } else if (grade >= 87) {
    return 3.8;
  } else if (grade >= 83) {
    return 3.5;
  } else if (grade >= 80) {
    return 3.2;
  } else if (grade >= 77) {
    return 2.8;
  } else if (grade >= 73) {
    return 2.5;
  } else if (grade >= 70) {
    return 2.2;
  } else if (grade >= 67) {
    return 1.8;
  } else if (grade >= 63) {
    return 1.5;
  } else if (grade >= 60) {
    return 1.2;
  } else {
    return 0;
  }
}

function GPADatatable() {
  // This page is only shown when user is authenticated, so email is always a string
  const userEmail = useSelector(
    (state: RootState) => state.user.email
  ) as string;
  const [trigger, result] = useLazyGetGPAScoreQuery();

  React.useEffect(() => {
    const fetchData = async () => {
      const { accessToken } = await getTokens();
      trigger({ userEmail, accessToken });
    };

    fetchData();
  }, []);

  let content = <ActivityIndicator size={30} />;
  if (
    !result.isFetching &&
    !result.isError &&
    result.currentData?.length != 0
  ) {
    content = (
      <View style={{ flex: 1 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>GPA</DataTable.Title>
            <DataTable.Title>Date Entered</DataTable.Title>
          </DataTable.Header>
          {result.currentData?.map((value) => (
            <DataTable.Row key={value.date_added}>
              <DataTable.Cell>{parseFloat(value.gpa)}</DataTable.Cell>
              <DataTable.Cell>
                {new Date(value.date_added).toLocaleDateString("en-us", {
                  dateStyle: "medium",
                })}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    );
  } else if (result.currentData?.length == 0) {
    content = (
      <Title style={{ textAlign: "center", width: 200, alignSelf: "center" }}>
        Previously entered scores will show up here
      </Title>
    );
  }

  return <Surface style={styles.gpaSurface}>{content}</Surface>;
}

function GradeInput({
  control,
  labelName,
  fieldName,
}: {
  control:
    | Control<ElementaryFormValues, object>
    | Control<HSFormValues, object>;
  labelName: string;
  fieldName: keyof ElementaryFormValues | keyof HSFormValues;
}) {
  return (
    <Controller
      // Control will always be valid
      // @ts-ignore
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          mode="outlined"
          label={labelName}
          value={value == undefined ? value : value.toString()}
          onChangeText={(text) => {
            if (isNaN(parseInt(text))) {
              onChange(text);
            } else {
              onChange(parseInt(text));
            }
          }}
          onBlur={onBlur}
          keyboardType="numeric"
          style={{ marginVertical: 10 }}
        />
      )}
      // Name here will also always be valid
      // @ts-ignore
      name={fieldName}
    />
  );
}

function GPADisplay({ gpa }: { gpa: string }) {
  return (
    <View
      style={{
        width: 110,
        backgroundColor: Colors.green200,
        alignSelf: "center",
        marginVertical: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <ReactNativeText
        style={{
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "Poppins_600SemiBold",
          textAlign: "center",
        }}
      >
        {gpa}
      </ReactNativeText>
    </View>
  );
}

function ElementaryCalculator({
  route,
}: TopTabScreenProps<"ElementaryCalculator">) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ElementaryFormValues>();
  const userEmail = useSelector(
    (state: RootState) => state.user.email
  ) as string;

  const [calculatedGrade, setCalculatedGrade] = React.useState<null | number>(
    null
  );

  const [postGPA, result] = usePostGPAScoreMutation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView style={{ flex: 1 }}>
        <Surface style={styles.calculatorSurface}>
          <Title style={{ textAlign: "center" }}>
            Elementary Grade Calculator
          </Title>
          <GradeInput labelName="Math" fieldName="math" control={control} />
          <GradeInput
            labelName="Science"
            fieldName="science"
            control={control}
          />
          <GradeInput
            labelName="Reading/English"
            fieldName="english"
            control={control}
          />
          <GradeInput
            labelName="Social Studies"
            fieldName="social"
            control={control}
          />
          <Button
            mode="contained"
            style={{ marginVertical: 10 }}
            onPress={handleSubmit(async (data) => {
              const { accessToken } = await getTokens();
              const gpa =
                (data.english + data.math + data.science + data.social) / 4;
              setCalculatedGrade(gpa);
              postGPA({
                userEmail: userEmail,
                accessToken: accessToken,
                dateAdded: new Date(),
                gpa: gpa,
              });
            })}
          >
            Calculate
          </Button>
          {calculatedGrade != null ? (
            <GPADisplay gpa={`${calculatedGrade}%`} />
          ) : null}
        </Surface>
        <GPADatatable />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function HSStandardsCalculator({
  route,
}: TopTabScreenProps<"ElementaryCalculator">) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HSFormValues>();
  const userEmail = useSelector(
    (state: RootState) => state.user.email
  ) as string;

  const [calculatedGrade, setCalculatedGrade] = React.useState<null | number>(
    null
  );

  const [postGPA, result] = usePostGPAScoreMutation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView style={{ flex: 1 }}>
        <Surface style={styles.calculatorSurface}>
          <Title style={{ textAlign: "center" }}>
            HS Grade Calculator (G7-9 & Standards Class)
          </Title>
          <Subheading style={{ textAlign: "center" }}>
            Core subjects are Math, Science, LA, and History. Electives are
            everything else.
          </Subheading>
          <GradeInput
            labelName="Core Subject 1"
            fieldName="core1"
            control={control}
          />
          <GradeInput
            labelName="Core Subject 2"
            fieldName="core2"
            control={control}
          />
          <GradeInput
            labelName="Core Subject 3"
            fieldName="core3"
            control={control}
          />
          <GradeInput
            labelName="Core Subject 4"
            fieldName="core4"
            control={control}
          />
          <Divider />
          <GradeInput
            labelName="Elective Subject 1"
            fieldName="elec1"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 2"
            fieldName="elec2"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 3"
            fieldName="elec3"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 4"
            fieldName="elec4"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 5"
            fieldName="elec5"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 6"
            fieldName="elec6"
            control={control}
          />
          <Button
            mode="contained"
            style={{ marginVertical: 10 }}
            onPress={handleSubmit(async (data) => {
              const { accessToken } = await getTokens();
              const coreSubjects = [
                data.core1,
                data.core2,
                data.core3,
                data.core4,
              ];

              const electiveSubjects = [
                data.elec1,
                data.elec2,
                data.elec3,
                data.core4,
                data.elec5,
                data.elec6,
              ];

              let coreSum = 0;

              coreSubjects.forEach((val) => {
                coreSum += ConvertScaleStandard(val);
              });

              let electiveSum = 0;
              electiveSubjects.forEach((val) => {
                electiveSum += ConvertScaleStandard(val);
              });

              const gpa = (coreSum * 0.5 + electiveSum * 0.25) / 3.5;

              setCalculatedGrade(parseFloat(gpa.toFixed(3)));
              postGPA({
                userEmail: userEmail,
                accessToken: accessToken,
                dateAdded: new Date(),
                gpa: parseFloat(gpa.toFixed(3)),
              });
            })}
          >
            Calculate
          </Button>
          {calculatedGrade != null ? (
            <GPADisplay gpa={`${calculatedGrade}`} />
          ) : null}
        </Surface>
        <GPADatatable />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function HSHonorsCalculator({
  route,
}: TopTabScreenProps<"ElementaryCalculator">) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<HSFormValues>();
  const userEmail = useSelector(
    (state: RootState) => state.user.email
  ) as string;

  const [calculatedGrade, setCalculatedGrade] = React.useState<null | number>(
    null
  );

  const [postGPA, result] = usePostGPAScoreMutation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView style={{ flex: 1 }}>
        <Surface style={styles.calculatorSurface}>
          <Title style={{ textAlign: "center" }}>
            HS Grade Calculator (G10-12)
          </Title>
          <Subheading style={{ textAlign: "center" }}>
            Core subjects are Math, Science, LA, and History. Electives are
            everything else.
          </Subheading>
          <GradeInput
            labelName="Core Subject 1"
            fieldName="core1"
            control={control}
          />
          <GradeInput
            labelName="Core Subject 2"
            fieldName="core2"
            control={control}
          />
          <GradeInput
            labelName="Core Subject 3"
            fieldName="core3"
            control={control}
          />
          <GradeInput
            labelName="Core Subject 4"
            fieldName="core4"
            control={control}
          />
          <Divider />
          <GradeInput
            labelName="Elective Subject 1"
            fieldName="elec1"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 2"
            fieldName="elec2"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 3"
            fieldName="elec3"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 4"
            fieldName="elec4"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 5"
            fieldName="elec5"
            control={control}
          />
          <GradeInput
            labelName="Elective Subject 6"
            fieldName="elec6"
            control={control}
          />
          <Button
            mode="contained"
            style={{ marginVertical: 10 }}
            onPress={handleSubmit(async (data) => {
              const { accessToken } = await getTokens();
              const coreSubjects = [
                data.core1,
                data.core2,
                data.core3,
                data.core4,
              ];

              const electiveSubjects = [
                data.elec1,
                data.elec2,
                data.elec3,
                data.core4,
                data.elec5,
                data.elec6,
              ];

              let coreSum = 0;

              coreSubjects.forEach((val) => {
                coreSum += ConvertScaleHonors(val);
              });

              let electiveSum = 0;
              electiveSubjects.forEach((val) => {
                electiveSum += ConvertScaleStandard(val);
              });

              const gpa = (coreSum * 0.5 + electiveSum * 0.25) / 3.5;

              setCalculatedGrade(parseFloat(gpa.toFixed(3)));
              postGPA({
                userEmail: userEmail,
                accessToken: accessToken,
                dateAdded: new Date(),
                gpa: parseFloat(gpa.toFixed(3)),
              });
            })}
          >
            Calculate
          </Button>
          {calculatedGrade != null ? (
            <GPADisplay gpa={`${calculatedGrade}`} />
          ) : null}
        </Surface>
        <GPADatatable />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function GradeCalculatorScreen() {
  const layout = useLayout();
  return (
    <Tab.Navigator initialLayout={layout.window} style={{ flex: 1 }}>
      <Tab.Screen name="Elementary" component={ElementaryCalculator} />
      <Tab.Screen
        name="Highschool (G7-9 or Standards)"
        component={HSStandardsCalculator}
      />
      <Tab.Screen name="Highschool (G10-12)" component={HSHonorsCalculator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 500,
    // Take into account the top tabs
    paddingBottom: 0,
    alignSelf: "center",
  },
  gpaSurface: {
    height: 240,
    elevation: 8,
    marginHorizontal: 15,
    overflow: "hidden",
    marginVertical: 20,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  calculatorSurface: {
    elevation: 8,
    marginHorizontal: 15,
    overflow: "hidden",
    marginVertical: 20,
    borderRadius: 10,
    padding: 20,
  },
});
