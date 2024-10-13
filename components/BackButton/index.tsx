import React from 'react';
import { Images } from '../../config';
import { BackButtonContainer, BackButtonIcon } from './styles';

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <BackButtonContainer onPress={onPress}>
      <BackButtonIcon source={Images.back_icon} />
    </BackButtonContainer>
  );
};

export default BackButton;