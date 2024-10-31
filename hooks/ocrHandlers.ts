import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { processImage } from "./useOcrRecognition";
import LottieView from "lottie-react-native";
import { Dispatch, RefObject, SetStateAction } from "react";

export const takePhotoHandler = async (
  camera: { takePictureAsync: () => any } | null,
  cameraAnimationRef: RefObject<LottieView>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  mainFlag: string,
  setResultText: (text: string) => void
) => {
  if (camera) {
    const photo = await camera.takePictureAsync();
    playLottieHandler(photo.uri, cameraAnimationRef, setLoading, mainFlag, setResultText);
  }
};

export const pickImageHandler = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>,
  cameraAnimationRef: RefObject<LottieView>,
  mainFlag: string,
  setResultText: (text: string) => void
) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "We need permission to access your gallery.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    playLottieHandler(result.assets[0].uri, cameraAnimationRef, setLoading, mainFlag, setResultText);
  }
};

export const playLottieHandler = async (
  imageUri: string,
  cameraAnimationRef: RefObject<LottieView>,
  setLoading: (loading: boolean) => void,
  mainFlag: string,
  setResultText: (text: string) => void
) => {
  if (cameraAnimationRef.current) {
    cameraAnimationRef.current.reset();
    cameraAnimationRef.current.play();

    if (imageUri) {
      await processImage(imageUri, mainFlag, setLoading, setResultText);
    }
  }
};