import * as Yup from 'yup';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import * as Linking from 'expo-linking';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password')
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match password.')
    .required('Confirm Password is required.')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .label('Email')
    .email('Enter a valid email')
});

export const checkVoicePermissions = async () => {
  const {status} = await Audio.requestPermissionsAsync();

  try {
    if (status === 'undetermined') {
      console.log('Requesting permission..');
      await Audio.requestPermissionsAsync();
      return status;
    }
    else if (status === 'denied') {
      return status;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    return status;
  } catch (err) {
    console.error('Failed to start recording', err);
  }
};

export const checkCamPermissions = async () => {
  const {status} = await Camera.requestCameraPermissionsAsync();

  try {
    if (status === 'undetermined') {
      console.log('Requesting permission..');
      await Camera.requestCameraPermissionsAsync();
      return status;
    }
    else if (status === 'denied') {
      return status;
    }
    return status;
  } catch (err) {
    console.error('Failed to start camera', err);
  }
};

export const openApplicationSettings = () => {
  Linking.openSettings()
};
