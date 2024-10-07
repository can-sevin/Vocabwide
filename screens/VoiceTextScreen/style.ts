import Animated from "react-native-reanimated";
import styled from "styled-components/native";
import { Colors } from "../../config";
import LottieView from "lottie-react-native";

export const HomeBtmView = styled.View`
  backgroundcolor: "rgba(255, 255, 255, 0.5)";
  height: 180px;
  width: 100%;
  borderradius: 24px;
  alignitems: center;
  justifycontent: space-evenly;
  flexdirection: row;
`;

export const Container = styled(Animated.View)`
  flex: 1;
  align-items: center;
  padding-top: 32px;
  justify-content: space-between;
`;

export const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  margin-left: 12px;
`;

export const BackIcon = styled.Image`
  width: 36px;
  height: 36px;
  margin-left: 12px;
`;

export const HeaderText = styled.Text`
  font-size: 32px;
  align-self: center;
  text-align: center;
  margin-top: 32px;
  color: #fff;
  font-family: Helvetica-Bold;
`;

export const DescriptionText = styled.Text`
  font-size: 18px;
  align-self: center;
  text-align: center;
  color: #fff;
  font-family: Helvetica-Medium;
  margin-vertical: 5px;
  margin-top: 52px;
  margin-horizontal: 28px;
`;

export const MicButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 80px;
`;

export const MicIcon = styled.Image`
  width: 80px;
  height: 80px;
`;

export const ResultsContainer = styled(Animated.View)`
  flex-direction: row;
  flex-wrap: wrap;
  height: 280px;
  justify-content: space-evenly;
  width: 100%;
`;

export const WordView = styled(Animated.View)<{ selected: boolean }>`
  width: 20%;
  height: 48px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.selected ? Colors.main_light_yellow : Colors.LighterGray3};
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

export const ScrollViewContainer = styled.ScrollView`
  flex: 1;
  width: 100%;
  background-color: ${Colors.whiteLight};
  height: 280px;
  border-radius: 24px;
  padding-horizontal: 8px;
`;

export const WordContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap; /* Enable wrapping of elements */
  justify-content: flex-start;
`;

export const LoadingOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`;

export const TransparentOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const LottieAnimation = styled(LottieView)`
  width: 160px;
  height: 320px;
  align-self: center;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  align-items: center;
`;

export const ModalText = styled.Text`
  font-size: 20px;
  margin-bottom: 20px;
  font-family: Helvetica-Medium;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: ${Colors.main_yellow};
  padding: 12px;
  border-radius: 8px;
`;

export const SaveButtonText = styled.Text`
  color: white;
  font-family: Helvetica-Medium;
`;

export const CancelButton = styled.TouchableOpacity`
  background-color: red;
  padding: 12px;
  border-radius: 8px;
`;

export const CancelButtonText = styled.Text`
  color: white;
  font-family: Helvetica-Medium;
`;

export const ModalInnerView = styled.View`
  flexdirection: row;
  justify-content: space-around;
  width: 80%;
`;
