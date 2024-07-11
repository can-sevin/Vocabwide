import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import { checkCamPermissions, checkVoicePermissions, openApplicationSettings } from "../utils";
import { ResizeMode, Video } from "expo-av";
import { Colors } from "../config";

export const PermissionScreen = () => {
  const [voicePermission, setVoicePermission] = useState('denied');
  const [camPermission, setCamPermission] = useState('denied');

  const mic_icon = require('../assets/icons/mic_permission.png');
  const cam_icon = require('../assets/icons/cam_permission.png');
  const succeed_icon = require('../assets/icons/succeed.png');

  const getVoicePermissions = async () => {
    const voice = await checkVoicePermissions();
    setVoicePermission(voice);
  };

  const getCamPermissions = async () => {
    const cam = await checkCamPermissions();
    setCamPermission(cam);
  };

  useEffect(() => {
    getVoicePermissions();
    getCamPermissions();
  }, []);

  const VoicePermission = () => {
    return(
      <View style={styles.container_permission}>
        <>
        {voicePermission !== 'granted' ? (
          <>
            <TouchableOpacity onPress={() => openApplicationSettings()}>
              <Image style={styles.icons} source={mic_icon}/>
            </TouchableOpacity>
            <Text style={styles.small_text}>Give Voice Permission into application permission settings</Text>
          </>
          ):(
            <>
              <Image style={styles.icons} source={succeed_icon}/>
              <Text style={styles.small_text}>You had gave Voice Permission</Text>
            </>
          )}
        </>  
      </View>    
    )
  }

  const CamPermission = () => {
    return(
      <View style={styles.container_permission}>
        <>
        {camPermission !== 'granted' ? (
          <>
            <TouchableOpacity onPress={() => openApplicationSettings()}>
              <Image style={styles.icons} source={cam_icon}/>
            </TouchableOpacity>
            <Text style={styles.small_text}>Give Camera Permission into application permission settings</Text>
          </>
          ):(
            <>
              <Image style={styles.icons} source={succeed_icon}/>
              <Text style={styles.small_text}>You had gave Camera Permission</Text>
            </>
          )}
        </>  
      </View>    
    )
  }

  return (
    <>
      {/* <Video 
        style={styles.container} 
        source={require('../assets/videos/permission.mp4')}         
        isMuted
        resizeMode={ResizeMode.COVER}
        isLooping
      > */}
      <View style={styles.container}>
      <Text style={styles.header_text}>Welcome to Vocabwide</Text>
      <VoicePermission/>
      <CamPermission/>
      {(voicePermission === 'granted' && camPermission === 'granted') && (
        <TouchableOpacity style={styles.btn_next} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.small_text}>
            Press for Login
          </Text>
        </TouchableOpacity>
      )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    marginTop: 128,
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
