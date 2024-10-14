import React from 'react';
import { BackButtonContainer, BackButtonIcon } from './styles';
import { Images } from '../../config';

export const BackButton = ({ navigation }) => {
  return (
    <BackButtonContainer onPress={() => navigation.goBack()}>
      <BackButtonIcon source={Images.back_icon} />
    </BackButtonContainer>
  );
};