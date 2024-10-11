import React from 'react';
import { TouchableOpacity } from 'react-native';
import { BackButtonContainer, BackButtonIcon, ControlPanel, ControlPanelButtons, LottieAnimation, GalleryButton } from '../screens/OcrCameraScreen/OcrScreen.style';
import { Images } from "../config";

export const CameraControlPanel = ({ setCamera, takePhotoHandler, pickImageHandler, navigation }) => {
  return (
    <ControlPanel>
      <BackButtonContainer onPress={() => navigation.goBack()}>
        <BackButtonIcon source={Images.back_icon} />
      </BackButtonContainer>
      <ControlPanelButtons>
        <TouchableOpacity onPress={takePhotoHandler}>
          <LottieAnimation source={Images.lottie_capture} loop={false} />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImageHandler}>
          <GalleryButton source={Images.gallery_btn} />
        </TouchableOpacity>
      </ControlPanelButtons>
    </ControlPanel>
  );
};