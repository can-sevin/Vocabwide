import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { Colors } from "../../config";

const windowHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

export const HeaderText = styled.Text`
  font-size: 32px;
  padding-top: 48px;
  align-self: center;
  text-align: center;
  color: ${Colors.white};
  font-family: Helvetica-Bold;
`;

export const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
`;

export const BackButtonImage = styled.Image`
  width: 36px;
  height: 36px;
  margin-left: 20px;
  margin-top: 20px;
`;

export const SignupKeyboardAvoiding = styled.KeyboardAvoidingView`
  max-height: ${windowHeight * 0.4}px;
`;

export const BottomTextWhite = styled.Text`
  font-size: 16px;
  color: ${Colors.white};
  font-family: Helvetica-Medium;
  align-self: center;
  text-align: center;
  margin: 12px;
  margin-vertical: 8px;
`;

export const GeneralButton = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  background-color: ${Colors.LighterGray2};
  padding: 10px;
  border-radius: 8px;
`;

export const GeneralButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.white};
  font-weight: 700;
`;

export const ScrollContainer = styled.ScrollView`
  padding-vertical: 8px;
`;

export const FormView = styled.View`
  margintop: 128;
  marginhorizontal: 32;
`;
