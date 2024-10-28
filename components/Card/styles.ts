import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { Colors } from '../../config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const YellowCard = styled.View`
  border-radius: 12px;
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const CardView = styled(Animated.View)`
  width: ${SCREEN_WIDTH * 0.4}px;
  height: ${SCREEN_HEIGHT * 0.2}px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  position: absolute;
  z-index: 5px;
`;

export const CardText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${Colors.black};
`;
