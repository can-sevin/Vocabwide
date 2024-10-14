import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { Colors } from "../../config";

const windowHeight = Dimensions.get("window").height;

export const LoginLayout = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export const HeaderTextLoginLayout = styled.View`
  flex: 1;
  justify-content: center;
`;

export const LoginHeaderText = styled.Text`
  font-size: 28px;
  color: ${Colors.white};
  font-family: Helvetica-Bold;
  align-self: center;
`;

export const LoginLayoutInside = styled.View`
  background-color: ${Colors.whiteLight};
  border-radius: 16px;
  align-self: center;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: ${windowHeight * 0.5};
  padding: 32px;
`;

export const GeneralButton = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  margin-top: 40px;
  background-color: ${Colors.LighterGray2};
  padding: 10px;
  border-radius: 8px;
`;

export const GeneralButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.white};
  fontweight: 700;
`;

export const LoginBtmText = styled.Text`
  font-family: Helvetica-Medium;
  font-size: 16px;
  align-self: center;
  margin-top: 12px;
`;

export const ErrorText = styled.Text`
  font-family: Helvetica-Bold;
  font-size: 14px;
  align-self: center;
  margin-top: 8px;
  color: red;
`;
