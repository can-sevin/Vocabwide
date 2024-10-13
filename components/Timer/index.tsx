import React from 'react';
import { TimerText } from './styles';

interface TimerProps {
  timer: number;
}

const Timer: React.FC<TimerProps> = ({ timer }) => {
  return <TimerText>{timer}</TimerText>;
};

export default Timer;