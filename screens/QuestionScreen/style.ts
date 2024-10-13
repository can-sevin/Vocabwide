import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { Colors } from '../../config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Geri Butonu Container
export const BackButtonContainer = styled.TouchableOpacity`
  align-self: flex-start;
  padding: 10px;
  margin-left: 16px;
  margin-top: 20px;
`;

// Geri Butonu Icon
export const BackButtonIcon = styled.Image`
  width: 36px;
  height: 36px;
`;

// Soru ekranındaki metin
export const ModalText = styled.Text`
  font-size: 20px;
  font-family: Helvetica-Medium;
  text-align: center;
  margin-bottom: 20px;
`;

// SafeArea Container
export const Container = styled.SafeAreaView`
  flex: 1;
`;

// Kartların gösterildiği ana container
export const CardContainer = styled.View`
  flex: 0.64;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  background-color: ${Colors.LighterGray1};
`;

// Kart stili
export const CardView = styled.View`
  width: ${SCREEN_WIDTH * 0.4}px;
  height: ${SCREEN_HEIGHT * 0.2}px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: absolute;
`;

// Kartın içindeki metin
export const CardText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${Colors.black};
`;

// ImageBackground için stil
export const ImageBackgroundStyled = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

// Timer Container
export const TimerContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

// Timer Metni
export const TimerText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: black;
  text-align: center;
`;

// Konumlandırma View'ları
export const TopView = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

export const BottomView = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

export const LeftView = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  width: 72px;
`;

export const RightView = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  width: 72px;
`;

export const TextStyled = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

export const RightText = styled(TextStyled)`
  transform: rotate(90deg);
`;

export const LeftText = styled(TextStyled)`
  transform: rotate(-90deg);
`;

export const QuestionContainer = styled.View`
  flex: 0.36;
  align-self: center;
  justify-content: center;
  align-items: center;
  margin: 24px;
  border-radius: 16px;
`;