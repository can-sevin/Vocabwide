import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors } from '../config';

export const FormErrorMessage = ({ error, visible }) => {
  if (!error || !visible) {
    return null;
  }

  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    marginLeft: 12,
    color: Colors.whiteLight,
    fontSize: 12,
    marginVertical: 4,
    fontFamily: 'Circular-Medium'
  }
});
