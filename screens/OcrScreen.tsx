import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { background } from './HomeScreen';
const capture_btn = require('../assets/icons/capture_button.png');

export const OcrScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [playanimation, setPlayAnimation] = useState(false);
  const cameraAnimationRef = useRef<LottieView>(null);

  const playLottieHandler = () => {
    console.log('basoyoru');

    setPlayAnimation(true);
    if (!cameraAnimationRef.current) return;

    cameraAnimationRef.current?.reset();
    cameraAnimationRef.current.play();
  };
  
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={'back'} autofocus={'on'} flash={'auto'}>
        {!playanimation ? (
          <TouchableOpacity onPress={() => playLottieHandler()}>
            <Image source={capture_btn} style={{width: 149, height: 149}} />
          </TouchableOpacity>
        ):(
        <LottieView
          ref={cameraAnimationRef}
          source={require("../assets/capture.json")}
          loop
          style={styles.lottieAnimation}
        />
        )}
      </CameraView>
    </View>
    </ImageBackground>
  );
}

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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  lottieAnimation: {
    width: 149,
    height: 149,
    alignSelf: "center",
  },  
});

export default OcrScreen;