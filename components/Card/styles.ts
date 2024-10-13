import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const CardContainer = styled(Animated.View)`
  width: 300px;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
  margin: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const CardText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

export const ImageBackgroundStyled = styled.ImageBackground`
  flex: 1;
  justify-content: center;
  align-items: center;
`;