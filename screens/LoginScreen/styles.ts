import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { Colors } from "../../config";

const windowHeight = Dimensions.get("window").height;

export const LoginLayout = styled.View`
  flex: 1;
  justifycontent: space-between;
`;

export const HeaderTextLoginLayout = styled.View`
  flex: 1;
  justifycontent: center;
`;

export const LoginHeaderText = styled.Text`
  fontsize: 28px;
  color: ${Colors.white};
  fontfamily: Helvetica-Bold;
  alignself: center;
`;

export const LoginLayoutInside = styled.View`
  backgroundcolor: ${Colors.whiteLight};
  borderradius: 16px;
  alignself: center;
  justifycontent: center;
  aligncontent: center;
  width: 100%;
  height: ${windowHeight * 0.5};
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
