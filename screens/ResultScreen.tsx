import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

export const ResultScreen = ({ route, navigation }) => {
  const { imageUri, recognizedText } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.text}>{recognizedText}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default ResultScreen;