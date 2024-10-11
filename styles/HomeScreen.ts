import styled from "styled-components/native";
import { Colors } from "../config";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
export const LoginLayout = styled.View`
  flex: 1;
  justifycontent: space-between;
`;
export const HomeLayout = styled(Animated.View)`
  flex: 1;
  alignitems: center;
  justifycontent: space-between;
`;

export const SignupLayout = styled(LoginLayout)`
  justifycontent: flex-end;
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
  height: ${windowHeight * 0.55};
  padding: 32px;
`;
export const LoginHeaderText = styled.Text`
  fontsize: 28px;
  color: ${Colors.white};
  fontfamily: Helvetica-Bold;
  alignself: center;
  margintop: 128px;
`;
export const SignupHeaderText = styled(LoginHeaderText)`
  marginbottom: 110px;
  margintop: 0px;
`;
export const HomeHeaderText = styled(LoginHeaderText)`
  fontsize: 42px;
  margintop: 32px;
`;
export const HomeHeaderTextAnimated = styled(Animated.Text)`
  color: ${Colors.white};
  fontfamily: Helvetica-Bold;
  alignself: center;
  fontsize: 42px;
  margintop: 96px;
`;
export const HomeHeaderSmallTextNumber = styled(Animated.Text)`
  fontsize: 24;
  color: ${Colors.white};
  fontfamily: Helvetica-Bold;
`;
export const HomeHeaderTextNumber = styled(Animated.Text)`
  fontsize: 42px;
  color: ${Colors.white};
  fontfamily: Helvetica-Bold;
  margintop: 32px;
  padding-right: 32px;
`;
export const SignupKeyboardAvoiding = styled.KeyboardAvoidingView`
  maxheight: ${windowHeight * 0.4};
`;
export const HomeHeaderLanguageView = styled(Animated.View)`
  flexdirection: row;
  justifycontent: space-between;
  width: 70%;
`;
export const HomeLanguageWordsView = styled.View`
  flexdirection: row;
  justifycontent: space-between;
  margintop: 16px;
  borderradius: 16px;
  overflow: hidden;
`;
export const LanguageScrollView = styled.ScrollView`
  maxheight: 280px;
`;
export const LanguageInsideAlphabetView = styled.View`
  backgroundcolor: ${Colors.LighterGray2};
`;
export const LanguageInsideView = styled.View`
  flexdirection: row;
  justifycontent: space-between;
  backgroundcolor: ${Colors.LighterGray5};
  paddinghorizontal: 16px;
`;
export const LanguageInsiderView = styled.View`
  flexdirection: row;
  justifycontent: space-between;
  flex: 1;
  marginvertical: 2px;
  marginhorizontal: 12px;
`;
export const LanguageInsiderText = styled.Text`
  color: ${Colors.black};
  fontsize: 16px;
  fontfamily: Helvetica-Medium;
  textalign: center;
`;
export const LanguageInsideAlphabetText = styled.Text`
  color: ${Colors.white};
  fontsize: 24px;
  fontfamily: Helvetica-Bold;
  marginhorizontal: 8px;
`;
export const HomeHeaderLanguageViewText = styled.Text`
  fontfamily: Helvetica-Bold;
  fontsize: 24px;
  color: ${Colors.white};
  alignself: center;
  marginvertical: 12px;
  textalign: center;
`;
export const HomeBtmView = styled.View`
  backgroundcolor: "rgba(255, 255, 255, 0.5)";
  height: 180px;
  width: 100%;
  borderradius: 24px;
  alignitems: center;
  justifycontent: space-evenly;
  flexdirection: row;
`;
export const HomeBtmIcons = styled.Image`
  height: 48px;
  width: 48px;
  marginbottom: 12px;
  alignself: center;
  aligncontent: center;
`;
export const HomeBtmIconText = styled.Text`
  fontsize: 12px;
  color: ${Colors.black};
  fontfamily: Helvetica-Bold;
  textalign: center;
`;
export const HomeVerticalView = styled.View`
  width: 1px;
  height: 160px;
  backgroundcolor: ${Colors.black};
`;
export const HomePracticeButton = styled.TouchableOpacity`
  backgroundcolor: ${Colors.whiteLight};
  borderradius: 8px;
  height: 42px;
  width: 180px;
  alignself: center;
  justify-content: center;
  aligncontent: center;
  marginvertical: 36px;
  alignitems: center;
`;
export const HomePracticeButtonText = styled.Text`
  fontsize: 20px;
  textalign: center;
  fontfamily: Helvetica-Medium;
  alignself: center;
`;
export const BottomTextWhite = styled.Text`
  fontsize: 16px;
  color: ${Colors.white};
  fontfamily: Helvetica-Medium;
  alignself: center;
`;
