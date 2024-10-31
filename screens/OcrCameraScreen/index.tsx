import React, { useRef, useState } from "react";
import { Alert, Button, Pressable, TouchableOpacity, Text, View, SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import { auth, Images, Flags } from "../../config";
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
  ScrollViewContainer,
  WordContainer,
  BlurryView,
  ErrorMessageView,
} from "./style";
import ModalOcr from "../../components/ModalOcr";
import { LoadingIndicator } from "../../components";
import { useCameraPermissions } from "expo-camera";
import { selectedWords, saveWordPair } from "../../hooks/useOcrRecognition";
import { takePhotoHandler, pickImageHandler } from "../../hooks/ocrHandlers";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = auth.currentUser?.uid;

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <Container>
        <Text style={{ textAlign: "center", paddingBottom: 10 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </Container>
    );
  }

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        {loading && (
          <BlurryView>
            <LoadingIndicator />
          </BlurryView>
        )}

        {error && (
          <BlurryView>
            <ErrorMessageView>
              <Text>{error}</Text>
              <Button title="Back" onPress={() => navigation.goBack()} />
            </ErrorMessageView>
          </BlurryView>
        )}

        {!error && (
          <CameraContainer facing="back" autofocus="on" flash="auto" ref={(ref) => setCamera(ref as any)}>
            <BackButtonContainer onPress={() => navigation.goBack()}>
              <BackButtonIcon source={Images.back_icon} />
            </BackButtonContainer>
            <ControlPanel>
              <ControlPanelButtons>
                <TouchableOpacity onPress={() => takePhotoHandler(camera, cameraAnimationRef, setLoading, mainFlag, setResultText)}>
                  <LottieAnimation ref={cameraAnimationRef} source={Images.lottie_capture} loop={false} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickImageHandler(setLoading, setError, cameraAnimationRef, mainFlag, setResultText)}>
                  <GalleryButton source={Images.gallery_btn} />
                </TouchableOpacity>
              </ControlPanelButtons>

              {resultText && (
                <HomeBtmView>
                  <ScrollViewContainer>
                    <WordContainer>
                      {resultText.split(/\s+/).map((result, index) => (
                        <WordView key={index} isSelected={selectedIndices.includes(index)}>
                          <Pressable onPress={() => selectedWords(result, index, targetFlag, setSelectedWord, setTranslatedWord, setLoading, setModalVisible)}>
                            <WordText>{result}</WordText>
                          </Pressable>
                        </WordView>
                      ))}
                    </WordContainer>
                  </ScrollViewContainer>
                </HomeBtmView>
              )}
            </ControlPanel>
          </CameraContainer>
        )}

        <ModalOcr
          visible={modalVisible}
          selectedWord={selectedWord}
          translatedWord={translatedWord}
          onSave={() => saveWordPair(selectedWord, translatedWord, mainFlag, targetFlag, userId, resultText, setModalVisible, setSelectedWord, setTranslatedWord, setSelectedIndices)}
          onCancel={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </Container>
  );
};