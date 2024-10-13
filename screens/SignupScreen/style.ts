import styled from "styled-components/native";
import { Colors } from "../../config";
import { Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;

export const LoginLayout = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export const HeaderTextSignupLayout = styled.View`
  flex: 1;
  justify-content: center;
`;

export const SignupLayout = styled(LoginLayout)`
  justify-content: flex-end;
`;

export const LoginHeaderText = styled.Text`
  font-size: 28px;
  color: ${Colors.white};
  font-family: Helvetica-Bold;
  align-self: center;
  margin-top: 128px;
`;

export const SignupHeaderText = styled(LoginHeaderText)`
  margin-top: 0px;
`;

export const LoginLayoutInside = styled.View`
  background-color: ${Colors.whiteLight};
  border-radius: 16px;
  align-self: center;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: ${windowHeight * 0.55};
  margin-top: 64px;
  padding: 32px;
`;

export const SignupLayoutInside = styled(LoginLayoutInside)`
  background-color: ${Colors.whiteLight};
  border-radius: 16px;
  align-self: center;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
  height: ${windowHeight * 0.6};
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
  fontfamily: Helvetica-Medium;
  fontsize: 16px;
  align-self: center;
  margin-top: 12px;
`;
