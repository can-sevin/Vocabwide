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
    marginLeft: 4,
    color: Colors.red,
    fontSize: 12,
    height: 32,
    marginVertical: 4,
    fontFamily: 'Helvetica-Bold'
  }
});
