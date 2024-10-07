import styled from 'styled-components/native';
import { Colors } from "../../config";
import Animated from 'react-native-reanimated';
import { View } from 'react-native';

export const HomeLayout = styled(Animated.View)`
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

export const HomeLayoutHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 20px;
  padding-horizontal: 32px;
`;

export const HomeTopView = styled(Animated.View)`
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  margin: 32px;
  width: 80%;
`;

export const HomeBottomView = styled(Animated.View)`
  justify-content: flex-end;
  width: 100%;
`;

export const HomeWordNumberView = styled(Animated.View)`
  flex-direction: row;
  justify-content: space-between;
  width: 94%;
`;

export const HomeHeaderTextNumber = styled(Animated.Text)`
  font-size: 36px;
  color: ${Colors.white};
  font-family: Helvetica-Bold;
  margin-top: 32px;
  padding-right: 32px;
`;

export const HomeHeaderText = styled.Text`
  font-size: 36px;
  color: ${Colors.white};
  font-family: Helvetica-Bold;
  margin-top: 32px;
`;

export const HomeHeaderSmallTextNumber = styled(Animated.Text)`
  font-size: 24px;
  color: ${Colors.white};
  font-family: Helvetica-Bold;
`;

export const HomeHeaderLanguageView = styled.View`
  margin-top: 16px;
  flex-direction: row;
  justify-content: center;
  width: 70%;
`;

export const HomeHeaderLanguageViewText = styled.Text`
  font-family: Helvetica-Bold;
  font-size: 16px;
  color: ${Colors.white};
  align-self: center;
  margin-vertical: 12px;
  text-align: center;
`;

export const HomeLanguageWordsView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
`;

export const HomePracticeButton = styled.TouchableOpacity`
  background-color: ${Colors.whiteLight};
  border-radius: 8px;
  height: 42px;
  width: 180px;
  align-self: center;
  justify-content: center;
  align-items: center;
  margin-vertical: 36px;
`;

export const HomePracticeButtonText = styled.Text`
  font-size: 18px;
  text-align: center;
  font-family: Helvetica-Medium;
`;

export const BottomTextWhite = styled.Text`
  font-size: 16px;
  color: ${Colors.white};
  font-family: Helvetica-Medium;
  align-self: center;
`;

export const HomeBtmView = styled.View`
  background-color: rgba(255, 255, 255, 0.5);
  height: 180px;
  width: 100%;
  border-radius: 24px;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
`;

export const HomeBtmIcons = styled.Image`
  height: 48px;
  width: 48px;
  margin-bottom: 12px;
  align-self: center;
`;

export const HomeBtmIconText = styled.Text`
  font-size: 12px;
  color: ${Colors.black};
  font-family: Helvetica-Bold;
  text-align: center;
`;

export const HomeVerticalView = styled.View`
  width: 1px;
  height: 160px;
  background-color: ${Colors.black};
`;

export const LogoutIcon = styled.Image`
  width: 36px;
  height: 36px;
`;