import { CameraView, useCameraPermissions, Camera } from 'expo-camera';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import textRecognition from '@react-native-ml-kit/text-recognition';
import { HomeBtmView } from '../styles/HomeScreen';

const gallery_btn = require('../assets/icons/photo-gallery.png');

export const OcrScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<null>(null);
  const [resultText, setResultText] = useState('');
  const cameraAnimationRef = useRef<LottieView>(null);

  const playLottieHandler = async (imageUri?: string) => {
    if (cameraAnimationRef.current) {
      cameraAnimationRef.current.reset();
      cameraAnimationRef.current.play();

      if (imageUri) {
        await processImage(imageUri); // Process image when Lottie animation is playing
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

      const result = await textRecognition.recognize(manipulatedImage.uri);

      console.log('result', result);
      console.log('result-text', result.text);

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

  return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={'back'}
          autofocus={'on'}
          ratio='4:3'
          flash={'auto'}
          ref={ref => setCamera(ref as any)}
        >
          <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
            <Text style={styles.back_button}>&lt;</Text>
          </TouchableOpacity>
          <View style={{width: '100%', alignItems: 'flex-end'}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', alignItems: 'center', marginRight: 24}}>
            <TouchableOpacity onPress={takePhotoHandler}>
              <LottieView
                ref={cameraAnimationRef}
                source={require('../assets/capture.json')}
                loop={false}
                style={styles.lottieAnimation}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImageHandler}>
              <Image source={gallery_btn} style={{ width: 42, height: 42 }} />
            </TouchableOpacity>
          </View>
          <HomeBtmView style={styles.resultsContainer}>
            <Text>{resultText}</Text>
          </HomeBtmView>
          </View>
        </CameraView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
});

export default OcrScreen;