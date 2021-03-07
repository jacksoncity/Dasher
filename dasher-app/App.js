import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>This will be the Dasher app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21a35e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


//
//1ddf6e - traffic light green
//21a35e - darker green