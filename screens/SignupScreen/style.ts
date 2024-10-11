import styled from "styled-components/native";
import { Colors } from "../../config";
import { Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;

export const LoginLayout = styled.View`
  flex: 1;
  justifycontent: space-between;
`;

export const HeaderTextSignupLayout = styled.View`
  flex: 1;
  justifycontent: center;
`;

export const SignupLayout = styled(LoginLayout)`
  justifycontent: flex-end;
`;

export const LoginHeaderText = styled.Text`
  fontsize: 28px;
  color: ${Colors.white};
  fontfamily: Helvetica-Bold;
  alignself: center;
  margintop: 128px;
`;

export const SignupHeaderText = styled(LoginHeaderText)`
  margintop: 0px;
`;

export const LoginLayoutInside = styled.View`
  backgroundcolor: ${Colors.whiteLight};
  borderradius: 16px;
  alignself: center;
  justifycontent: center;
  aligncontent: center;
  width: 100%;
  height: ${windowHeight * 0.55};
  margintop: 64px;
  padding: 32px;
`;

export const SignupLayoutInside = styled(LoginLayoutInside)`
  backgroundcolor: ${Colors.whiteLight};
  borderradius: 16px;
  alignself: center;
  justifycontent: flex-start;
  aligncontent: flex-start;
  width: 100%;
  height: ${windowHeight * 0.6};
  padding: 32px;
`;

export const GeneralButton = styled.TouchableOpacity`
  width: 100%;
  justifycontent: center;
  alignitems: center;
  alignself: flex-end;
  margintop: 40px;
  backgroundcolor: ${Colors.LighterGray2};
  padding: 10px;
  borderradius: 8px;
`;

export const GeneralButtonText = styled.Text`
  fontsize: 20px;
  color: ${Colors.white};
  fontweight: 700;
`;

export const LoginBtmText = styled.Text`
  fontfamily: Helvetica-Medium;
  fontsize: 16px;
  alignself: center;
  margintop: 12px;
`;
