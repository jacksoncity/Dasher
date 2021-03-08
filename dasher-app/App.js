import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
//import * as React from 'react';
import React, { useState } from 'react';
import { StyleSheet, Button, Text, View, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import { useForm, Controller } from "react-hook-form";


//Login screen
function LoginScreen({ navigation }) {
  //const [username, setUsername] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 
      Welcome to Dasher!</Text>

      <TextInput
      style={styles.textbox}
      placeholder = "Username" placeholderTextColor = 'rgba(0,0,0,0.5)'
      //onChangeText = {(text) => setUsername(text)}
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
    <View style={styles.container}>
      <Text style={styles.title}> 
      Main Menu</Text>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Recommendations')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>Get recommendation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('RecordDrive')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>Record a new drive</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Statistics')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>View statistics</Text>
      </TouchableOpacity>

      <TouchableOpacity
        //onPress={() => navigation.navigate('Recommendations')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>View/edit past drives</Text>
      </TouchableOpacity>

    </View>
  );
}

//GetRecommendations screen
function RecommendScreen({ navigation }) {
  const { control, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="restaurant"
        rules={{ required: true }}
        defaultValue=""
      />
      {errors.restaurant && <Text>This is required.</Text>}

      <Text style={styles.title}>Distance</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="distance"
        rules={{ required: true }}
        defaultValue=""
      />
      {errors.distance && <Text>This is required.</Text>}

      <Text style={styles.title}>Pay</Text>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="pay"
        rules={{ required: true }}
        defaultValue=""
      />
      {errors.pay && <Text>This is required.</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

//RecordDrive screen
function RecordDriveScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> 
      Record Drive</Text>

      <Text style = {styles.text}>Time</Text>
      <Text style = {styles.time}>00:00:00</Text>
      <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/1D_line.svg/2000px-1D_line.svg.png"}} 
        style={{ width: 400, height: 30}} />
      <Text style = { styles.text }>Press the record button to start your drive!</Text>
      <StatusBar style="auto" />

      <TouchableOpacity style = {styles.button}
        //onPress={startButton} 
        style={{ backgroundColor: 'white'}}>
        <Text style={ styles.button}>Start Recording</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.button}
        //onPress={saveDrive} 
        style={{ backgroundColor: 'white'}}>
        <Text style={ styles.button}>Save Drive</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {styles.button}
        //onPress={deleteDrive} 
        style={{ backgroundColor: 'white'}}>
        <Text style={ styles.button}>Delete Drive</Text>
      </TouchableOpacity>

    </View>
  );
}

//Statistics screen
function StatisticsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> 
      Statistics</Text>

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
        <Stack.Screen name="RecordDrive" component={RecordDriveScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1ddf6e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontSize: 30,
    //backgroundColor: 'white',
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

  text: {
    fontSize: 20,
    color: 'black',
    margin: 10,
    alignContent: 'center',
  },
  time: {
    fontWeight: 'bold',
    fontSize: 80,
    color: '#000',
    alignContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    padding: 10,
    width: 100,
    borderRadius: 4,
  }
});

//1ddf6e - traffic light green
//21a35e - spinach green
//3fb659 - grass green

//<Button
  //title="Go to Main... again"
  //onPress={() => navigation.navigate('Main')}
///>