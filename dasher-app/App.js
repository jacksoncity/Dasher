import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Login screen
function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <Button
        title="Go to Main"
        onPress={() => navigation.navigate('Main')}
      />
    </View>
  );
}

//Main menu screen
function MainScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Main Screen</Text>
      <Button
        title="Go to Main... again"
        onPress={() => navigation.navigate('Main')}
      />
      <Button
        title="Go to Recommendations"
        onPress={() => navigation.navigate('Recommendations')}
      />
    </View>
  );
}

//GetRecommendations screen
function RecommendScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Recommendations Screen</Text>
      <Button
        title="Go to Main"
        onPress={() => navigation.navigate('Main')}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
	<NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Recommendations" component={RecommendScreen} />
      </Stack.Navigator>
    </NavigationContainer>

    /*<View style={styles.container}>
      <Text>This will be the Dasher app!</Text>
      <StatusBar style="auto" />
    </View>*/
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