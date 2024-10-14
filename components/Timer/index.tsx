import React from 'react';
import { TimerContainer, TimerText } from './styles';

export const Timer = ({ timer }) => {
  return (
    <TimerContainer>
      <TimerText>{timer}</TimerText>
    </TimerContainer>
  );
};