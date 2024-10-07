import styled from "styled-components/native";
import { Colors } from "../../config";

export const ForgotPasswordLayout = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ForgotPasswordLayoutInside = styled.View`
  width: 85%;
  justify-content: center;
`;

export const HeaderTextForgotPasswordLayout = styled.View`
  margin-bottom: 24px;
  align-items: center;
`;

export const ForgotPasswordHeaderText = styled.Text`
  font-size: 24px;
  color: white;
`;

export const GeneralButton = styled.TouchableOpacity`
  background-color: ${Colors.LighterGray3};
  padding: 15px;
  margin-top: 20px;
  border-radius: 8px;
  align-items: center;
`;

export const GeneralButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const ForgotPasswordBtmText = styled.Text`
  color: #fff;
  margin-top: 15px;
  text-align: center;
  font-size: 16px;
  text-decoration-line: underline;
`;