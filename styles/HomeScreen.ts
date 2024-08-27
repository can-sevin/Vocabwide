import styled from 'styled-components/native'
import { Colors } from "../config";
import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height; 

export const GeneralButton = styled.TouchableOpacity`
    width: 100%;
    justifyContent: center;
    alignItems: center;
    marginTop: 40px;
    backgroundColor: ${Colors.white};
    padding: 10px;
    borderRadius: 8px;
`
export const GeneralButtonText = styled.Text`
    fontSize: 20px;
    color: ${Colors.white};
    fontWeight: 700;
`
export const LoginBtmText = styled.Text`
    fontFamily: Circular-Medium; 
    fontSize: 16px; 
    alignSelf: center; 
    marginTop: 12px;
`
export const LoginLayout = styled.View`
    flex: 1;
    backgroundColor: #6537C5;
    justifyContent: space-between;
`
export const HomeLayout = styled(Animated.View)`
    flex: 1;
    alignItems: center;
    justifyContent: space-between;
`

export const SignupLayout = styled(LoginLayout)`
    justifyContent: flex-end;
`

export const LoginLayoutInside = styled.View`
    backgroundColor: ${Colors.whiteLight};
    borderRadius: 16px;
    alignSelf: center;
    justifyContent: center;
    alignContent: center;
    width: 100%;
    height: ${windowHeight * 0.6};
    marginTop: 64px;
    padding: 32px;
`

export const SignupLayoutInside = styled(LoginLayoutInside)`
    backgroundColor: ${Colors.whiteLight};
    borderRadius: 16px;
    alignSelf: center;
    justifyContent: center;
    alignContent: center;
    width: 100%;
    height: ${windowHeight * 0.6};
    marginTop: 64px;
    padding: 32px;
`
export const LoginHeaderText = styled.Text`
    fontSize: 28px;
    color: ${Colors.white};
    fontFamily: Circular-Bold;
    alignSelf: center;
    marginTop: 128px;
`
export const SignupHeaderText = styled(LoginHeaderText)`
    marginBottom: 110px;
    marginTop: 0px;
`
export const HomeHeaderText = styled(LoginHeaderText)`
    fontSize: 42px;
    marginTop: 96px;
`
export const HomeHeaderTextAnimated = styled(Animated.Text)`
    color: ${Colors.white};
    fontFamily: Circular-Bold;
    alignSelf: center;
    fontSize: 42px;
    marginTop: 96px;
`
export const HomeHeaderTextNumber = styled(Animated.Text)`
    fontSize: 42px;
    color: ${Colors.white};
    fontFamily: Circular-Bold;
    marginTop: 96px;
    padding-right: 32px;
`
export const SignupKeyboardAvoiding = styled.KeyboardAvoidingView`
    maxHeight: ${windowHeight * 0.5};
`
export const HomeHeaderLanguageView = styled(Animated.View)`
    flexDirection: row;
    justifyContent: space-between;
    width: 70%;
`
export const HomeLanguageWordsView = styled.View`
    flexDirection: row;
    justifyContent: space-between;
    marginTop: 16px;
    borderRadius: 16px;
    overflow: hidden;
`
export const LanguageScrollView = styled.ScrollView`
    maxHeight: 280px;
`
export const LanguageInsideAlphabetView = styled.View`
    backgroundColor: ${Colors.LighterGray2};
`
export const LanguageInsideView = styled.View`
    flexDirection: row;
    justifyContent: space-between;
    backgroundColor: ${Colors.LighterGray5};
    paddingHorizontal: 16px;
`
export const LanguageInsiderView = styled.View`
    flexDirection: row;
    justifyContent: space-between;
    flex: 1;
    marginVertical: 2px;
    marginHorizontal: 12px;
`
export const LanguageInsiderText = styled.Text`
    color: ${Colors.black};
    fontSize: 16px;
    fontFamily: Circular-Medium;
    textAlign: center;
`
export const LanguageInsideAlphabetText = styled.Text`
    color: ${Colors.white};
    fontSize: 24px;
    fontFamily: Circular-Bold;
    marginHorizontal: 8px;
`
export const HomeHeaderLanguageViewText = styled.Text`
    fontFamily: Circular-Bold; 
    fontSize: 24px;
    color: ${Colors.white};
    alignSelf: center; 
    marginVertical: 12px;
    textAlign: center;
`
export const HomeBtmView = styled.View`
    backgroundColor: 'rgba(255, 255, 255, 0.5)';
    height: 180px;
    width: 100%; 
    borderRadius: 24px; 
    alignItems: center; 
    justifyContent: space-evenly;
    flexDirection: row;
`
export const HomeBtmIcons = styled.Image`
    height: 48px;
    width: 48px;
    marginBottom: 12px;
    alignSelf: center;
    alignContent: center;
`
export const HomeBtmIconText = styled.Text`
    fontSize: 12px;
    color: ${Colors.black};
    fontFamily: Circular-Bold;
    textAlign: center;
`
export const HomeVerticalView = styled.View`
    width: 1px;
    height: 160px; 
    backgroundColor: ${Colors.black};
`
export const HomePracticeButton = styled.TouchableOpacity`
    backgroundColor: ${Colors.whiteLight};
    borderRadius: 8px;
    height: 42px;
    width: 180px;
    alignSelf: center;
    justify-content: center;
    alignContent: center;
    marginVertical: 48px;
    alignItems: center;
`
export const HomePracticeButtonText = styled.Text`
    fontSize: 20px;
    textAlign: center;
    fontFamily: Circular-Medium;
    alignSelf: center;
`
export const BottomTextWhite = styled.Text`
    fontSize: 16px;
    color: ${Colors.white};
    fontFamily: Circular-Medium;
    alignSelf: center;
`