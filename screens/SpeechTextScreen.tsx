import React from "react";
import { StyleSheet, Image, SafeAreaView } from "react-native";

import { Colors } from "../config";
import { TouchableOpacity } from "react-native-gesture-handler";

import Voice from '@react-native-voice/voice';

export const SpeechTextScreen = ({ navigation }) => {
  const mic_icon = require('../assets/icons/mic_permission.png');
  const cam_icon = require('../assets/icons/cam_permission.png');

  const _startRecognizing = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => _startRecognizing()}>
          <Image source={mic_icon}/>
        </TouchableOpacity>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.purple
  },
  container_permission: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 140,
    marginTop: 36,
  },
  header_text: {
    fontSize: 48,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
    marginTop: 48,
    marginBottom: 36
  },
  small_text: {
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Helvetica-Medium',
  },
  icons: {
    height: 64,
    width: 64,
  },
  btn_next: {
    height: 48,
    width: 160,
    backgroundColor: Colors.liliac,
    borderRadius: 12,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
});
