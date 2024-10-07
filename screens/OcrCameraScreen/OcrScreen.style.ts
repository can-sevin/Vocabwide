import styled from "styled-components/native";
import { Colors } from "../../config";
import { CameraView } from "expo-camera";
import Animated from "react-native-reanimated";
import LottieView from "lottie-react-native";

export const HomeBtmView = styled.View`
  background-color: rgba(255, 255, 255, 0.5);
  height: 280px;
  width: 100%;
  border-radius: 24px;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

export const CameraContainer = styled(CameraView)`
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

export const LottieAnimation = styled(LottieView)`
  width: 149px;
  height: 149px;
  align-self: center;
`;

export const BackButtonContainer = styled.TouchableOpacity`
  align-self: flex-start;
`;

export const BackButtonIcon = styled.Image`
  width: 36px;
  height: 36px;
  margin-left: 16px;
  margin-top: 20px;
`;

export const ControlPanel = styled.View`
  width: 100%;
  align-items: flex-end;
`;

export const ControlPanelButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 60%;
  align-items: center;
  margin-right: 24px;
`;

export const GalleryButton = styled.Image`
  width: 42px;
  height: 42px;
`;

export const WordView = styled(Animated.View)<{ isSelected: boolean }>`
  width: 20%;
  height: 48px;
  border-radius: 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? Colors.main_light_yellow : Colors.LighterGray3};
  justify-content: center;
  margin-vertical: 12px;
  margin-horizontal: 8px;
`;

export const WordText = styled.Text`
  color: #fff;
  font-size: 12px;
  text-align: center;
  font-family: Helvetica-Medium;
`;
