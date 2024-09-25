import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity, Alert, Pressable, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import textRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { HomeBtmView } from '../../styles/HomeScreen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, auth, database, Images } from "../../config";
import { ref, get, set } from 'firebase/database';
import translate from 'translate-google-api';

export const OcrScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [languageFamily, setLanguageFamily] = useState(TextRecognitionScript.LATIN);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translatedWord, setTranslatedWord] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const translation = await translate(word, { to: 'tr' });
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
    const originalWordsRef = ref(database, `users/${userId}/originalWords`);
    const translatedWordsRef = ref(database, `users/${userId}/translatedWords`);
  
    try {
      const originalSnapshot = await get(originalWordsRef);
      const translatedSnapshot = await get(translatedWordsRef);
  
      let currentOriginalWords = originalSnapshot.exists() ? originalSnapshot.val() : [];
      let currentTranslatedWords = translatedSnapshot.exists() ? translatedSnapshot.val() : [];
  
      if (!Array.isArray(currentOriginalWords)) currentOriginalWords = [];
      if (!Array.isArray(currentTranslatedWords)) currentTranslatedWords = [];
  
      if (currentOriginalWords.includes(selectedWord)) {
        console.log("The word already exists in the originalWords list.");
        setModalVisible(false);
        return;
      }
  
      const updatedOriginalWords = [...currentOriginalWords, selectedWord];
      const updatedTranslatedWords = [...currentTranslatedWords, translatedWord];
  
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
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your gallery.');
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

      const result = await textRecognition.recognize(manipulatedImage.uri, languageFamily);
      setResultText(result.text);
    } catch (error) {
      console.error('Text recognition failed:', error);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const ModalOCR = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{`${selectedWord} -> ${translatedWord}`}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%' }}>
            <TouchableOpacity style={styles.saveButton} onPress={saveWordPair}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={'back'}
        autofocus={'on'}
        flash={'auto'}
        ref={ref => setCamera(ref as any)}
      >
        <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
          <Image style={{ width: 36, height: 36, marginLeft: 16, marginTop: 20 }} source={Images.back_icon} />  
        </TouchableOpacity>
        <View style={{ width: '100%', alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', alignItems: 'center', marginRight: 24 }}>
            <TouchableOpacity onPress={takePhotoHandler}>
              <LottieView
                ref={cameraAnimationRef}
                source={Images.lottie_capture}
                loop={false}
                style={styles.lottieAnimation}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImageHandler}>
              <Image source={Images.gallery_btn} style={{ width: 42, height: 42 }} />
            </TouchableOpacity>
          </View>

          {resultText !== null && (
            <HomeBtmView style={styles.resultsContainer}>
              {resultText.split(/\s+/).map((word, index) => (
                <Animated.View key={index} style={[styles.word_view, selectedIndices.includes(index) && styles.selected_word_view]} entering={FadeInDown.duration(1000).delay(0)}>
                  <Pressable onPress={() => selectedWords(word, index)}>
                    <Text style={styles.word_text}>{word}</Text>
                  </Pressable>
                </Animated.View>
              ))}
            </HomeBtmView>
          )}
        </View>
      </CameraView>
      <ModalOCR />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  lottieAnimation: {
    width: 149,
    height: 149,
    alignSelf: 'center',
  },
  back_button: {
    fontSize: 32,
    margin: 32,
    alignSelf: 'flex-start',
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  
    height: 280,
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  word_text: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Helvetica-Medium",
  },
  word_view: {
    width: '20%',
    height: 48,
    borderRadius: 20,
    backgroundColor: Colors.LighterGray3,
    justifyContent: "center",
    marginVertical: 12,
    marginHorizontal: 8
  },
  selected_word_view: {
    backgroundColor: Colors.main_light_yellow,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: Colors.main_yellow,
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "white",
  },
});

export default OcrScreen;