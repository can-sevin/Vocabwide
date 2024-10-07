import React, { useRef, useState } from "react";
import { useCameraPermissions } from "expo-camera";
import {
  Alert,
  Button,
  Pressable,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import textRecognition, {
  TextRecognitionScript,
} from "@react-native-ml-kit/text-recognition";
import { ref, get, set } from "firebase/database";
import translate from "translate-google-api";
import { auth, database, Images } from "../../config";
import {
  Container,
  CameraContainer,
  BackButtonContainer,
  BackButtonIcon,
  ControlPanel,
  ControlPanelButtons,
  LottieAnimation,
  GalleryButton,
  WordView,
  WordText,
  HomeBtmView,
} from "./OcrScreen.style";
import ModalOcr from "../../components/ModalOcr";

export const OcrScreen = ({ navigation, route }) => {
  const mainFlag = route.params.main;
  const targetFlag = route.params.target;
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraAnimationRef = useRef<LottieView>(null);

  const selectedWords = async (word: string, index: number) => {
    setSelectedIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        return prevIndices.filter((i) => i !== index);
      } else {
        return [...prevIndices, index];
      }
    });

    try {
      const translation = await translate(word, { to: targetFlag });
      setSelectedWord(word);
      setTranslatedWord(translation[0]);
      setModalVisible(true);
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  const saveWordPair = async () => {
    if (!selectedWord || !translatedWord) {
      console.log("No word selected or translation is missing.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("No user is currently logged in.");
      return;
    }

    const userId = currentUser.uid;
    const originalWordsRef = ref(
      database,
      `users/${userId}/${mainFlag}${targetFlag}originalWords`
    );
    const translatedWordsRef = ref(
      database,
      `users/${userId}/${mainFlag}${targetFlag}translatedWords`
    );

    try {
      const originalSnapshot = await get(originalWordsRef);
      const translatedSnapshot = await get(translatedWordsRef);

      let currentOriginalWords = originalSnapshot.exists()
        ? originalSnapshot.val()
        : [];
      let currentTranslatedWords = translatedSnapshot.exists()
        ? translatedSnapshot.val()
        : [];

      if (!Array.isArray(currentOriginalWords)) currentOriginalWords = [];
      if (!Array.isArray(currentTranslatedWords)) currentTranslatedWords = [];

      if (currentOriginalWords.includes(selectedWord)) {
        console.log("The word already exists in the originalWords list.");
        setModalVisible(false);
        return;
      }

      const updatedOriginalWords = [...currentOriginalWords, selectedWord];
      const updatedTranslatedWords = [
        ...currentTranslatedWords,
        translatedWord,
      ];

      await set(originalWordsRef, updatedOriginalWords);
      await set(translatedWordsRef, updatedTranslatedWords);

      console.log("Saved successfully:", selectedWord, "->", translatedWord);

      setModalVisible(false);
      setSelectedWord(null);
      setTranslatedWord(null);
    } catch (error) {
      console.error("Error saving words to Firebase:", error);
    }
  };

  const playLottieHandler = async (imageUri?: string) => {
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current.reset();
      cameraAnimationRef.current.play();

      if (imageUri) {
        await processImage(imageUri);
      }
    }
  };

  const takePhotoHandler = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      playLottieHandler(photo.uri);
    }
  };

  const pickImageHandler = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need permission to access your gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      playLottieHandler(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      const result = await textRecognition.recognize(
        manipulatedImage.uri,
        TextRecognitionScript.LATIN
      );
      setResultText(result.text);
    } catch (error) {
      console.error("Text recognition failed:", error);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Container>
        <Text style={{ textAlign: "center", paddingBottom: 10 }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </Container>
    );
  }

  return (
    <Container>
      <CameraContainer
        facing={"back"}
        autofocus={"on"}
        flash={"auto"}
        ref={(ref) => setCamera(ref as any)}
      >
        <BackButtonContainer onPress={() => navigation.goBack()}>
          <BackButtonIcon source={Images.back_icon} />
        </BackButtonContainer>
        <ControlPanel>
          <ControlPanelButtons>
            <TouchableOpacity onPress={takePhotoHandler}>
              <LottieAnimation
                ref={cameraAnimationRef}
                source={Images.lottie_capture}
                loop={false}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImageHandler}>
              <GalleryButton source={Images.gallery_btn} />
            </TouchableOpacity>
          </ControlPanelButtons>
          {resultText !== null && (
            <HomeBtmView>
              {resultText.split(/\s+/).map((word, index) => (
                <WordView
                  key={index}
                  isSelected={selectedIndices.includes(index)}
                >
                  <Pressable onPress={() => selectedWords(word, index)}>
                    <WordText>{word}</WordText>
                  </Pressable>
                </WordView>
              ))}
            </HomeBtmView>
          )}
        </ControlPanel>
      </CameraContainer>
      <ModalOcr
        visible={modalVisible}
        selectedWord={selectedWord}
        translatedWord={translatedWord}
        onSave={saveWordPair}
        onCancel={() => setModalVisible(false)}
      />
    </Container>
  );
};
