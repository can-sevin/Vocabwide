import styled from 'styled-components/native';
import { Colors } from '../../config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const Container = styled(GestureHandlerRootView)`
  flex: 1;
`;

export const ModalText = styled.Text`
  font-size: 20px;
  font-family: Helvetica-Medium;
  text-align: center;
  margin-bottom: 20px;
`;

export const FinishText = styled.Text`
  fontSize: 24px;
  textAlign: center;
  marginTop: 50px;
`;

export const CardContainer = styled.ImageBackground`
  flex: 0.64;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  background-color: ${Colors.LighterGray1};
`;

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