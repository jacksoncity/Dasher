import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
//import * as React from 'react';
import React, { useState } from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, TextInput, TouchableOpacity} from 'react-native';

//Login screen
function LoginScreen({ navigation }) {
  //const [username, setUsername] = useState("");

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.title}> 
      Welcome to Dasher!</Text>

      <TextInput
      style={styles.textbox}
      placeholder = "Username" placeholderTextColor = 'rgba(0,0,0,0.5)'
      onChangeText = {(text) => setUsername(text)}
      />

      <TextInput
      secureTextEntry={true}
      style={styles.textbox}
      placeholder = "Password" placeholderTextColor = 'rgba(0,0,0,0.5)'
      />

      <TouchableOpacity
        //onPress={() => alert(`You are logged in as ${username}`)}
        onPress={() => navigation.navigate('Main')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
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
  title: {
    color: 'black',
    fontSize: 30,
    backgroundColor: 'white',
    marginHorizontal: 15, 
    marginVertical: 20,
    padding: 7,
    paddingHorizontal: 20,
    borderRadius: 5,
  }, 
  button: {
    color: 'black',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 10, 
    borderRadius: 5,
  },
  textbox: {
  	backgroundColor: "rgba(0,0,0,0.1)",
  	height: 40, 
  	width: 200,
  	marginTop: 0,
  	marginBottom: 20,
  	borderRadius: 5,
  	borderColor: 'white', 
  	borderWidth: 1,
  	padding: 5,
  },
});


//
//1ddf6e - traffic light green
//21a35e - darker green