import * as Yup from "yup";
import { Audio } from "expo-av";
import { Camera, PermissionStatus } from "expo-camera";
import * as Linking from "expo-linking";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters")
    .label("Email"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(24, "Password must be at most 24 characters")
    .matches(
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      /^(?=.*[a-z])(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .label("Password"),
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be at most 255 characters")
    .label("Email"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .label("Password"),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Confirm Password must match Password")
    .label("Confirm Password"),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("Please enter a registered email")
    .label("Email")
    .email("Enter a valid email"),
});

export const checkVoicePermissions = async () => {
  const { status } = await Audio.requestPermissionsAsync();

  try {
    if (status === "undetermined") {
      console.log("Requesting permission..");
      await Audio.requestPermissionsAsync();
      return status;
    } else if (status === "denied") {
      return status;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    return status;
  } catch (err) {
    console.error("Failed to start recording", err);
  }
};

export const checkCamPermissions = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();

  try {
    if (status === "undetermined") {
      console.log("Requesting permission..");
      await Camera.requestCameraPermissionsAsync();
      return status;
    } else if (status === "denied") {
      return status;
    }
    return status;
  } catch (err) {
    console.error("Failed to start camera", err);
  }
};

export const getPermissions = async (
  type: "camera" | "voice"
): Promise<"granted" | "denied"> => {
  let permission: PermissionStatus | undefined;

  if (type === "camera") {
    permission = await checkCamPermissions();
  } else {
    permission = await checkVoicePermissions();
  }

  // Handle undefined or unexpected PermissionStatus cases
  if (permission === "granted") {
    return "granted";
  } else {
    return "denied"; // Map undefined or unexpected values to 'denied'
  }
};

export const handleOpenAppSettings = () => {
  openApplicationSettings();
};

export const openApplicationSettings = () => {
  Linking.openSettings();
};

export const wordValidationSchema = Yup.object().shape({
  words: Yup.string()
    .matches(
      /^[\p{L}]+(,\s*[\p{L}]+)*$/u,
      "Please enter valid words separated by commas (e.g., apple, orange, grape)"
    )
    .required("Words input is required"),
});