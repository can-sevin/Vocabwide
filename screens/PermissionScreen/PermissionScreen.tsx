import React, { useEffect, useState } from "react";
import { TouchableOpacity, ImageBackground } from "react-native";

import { checkCamPermissions, checkVoicePermissions, openApplicationSettings } from "../../utils";
import { Images } from "../../config";
import { BtnNext, Container, ContainerPermission, HeaderText, Icons, SmallText } from "./PermissionScreen.style";

export const PermissionScreen = ({ navigation }) => {
  const [voicePermission, setVoicePermission] = useState('denied');
  const [camPermission, setCamPermission] = useState('denied');

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
      <ContainerPermission>
        <>
        {voicePermission !== 'granted' ? (
          <>
            <TouchableOpacity onPress={() => openApplicationSettings()}>
              <Icons source={Images.mic_icon}/>
            </TouchableOpacity>
            <SmallText>Give Voice Permission into application permission settings</SmallText>
          </>
          ):(
            <>
              <Icons source={Images.succeed_icon}/>
              <SmallText>You had gave Voice Permission</SmallText>
            </>
          )}
        </>  
      </ContainerPermission>    
    )
  }

  const CamPermission = () => {
    return(
      <ContainerPermission>
        <>
        {camPermission !== 'granted' ? (
          <>
            <TouchableOpacity onPress={() => openApplicationSettings()}>
              <Icons source={Images.cam_icon}/>
            </TouchableOpacity>
            <SmallText>Give Camera Permission into application permission settings</SmallText>
          </>
          ):(
            <>
              <Icons source={Images.succeed_icon}/>
              <SmallText>You had gave Camera Permission</SmallText>
            </>
          )}
        </>  
      </ContainerPermission>    
    )
  }

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }} resizeMode="cover">
      <Container>
      <HeaderText>Welcome to Vocabwide</HeaderText>
      <VoicePermission/>
      <CamPermission/>
      {(voicePermission === 'granted' && camPermission === 'granted') && (
        <BtnNext onPress={() => navigation.navigate("Login")}>
          <SmallText>
            Press for Login
          </SmallText>
        </BtnNext>
      )}
      </Container>
    </ImageBackground>
  );
};