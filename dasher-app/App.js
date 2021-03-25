import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, Image, Alert, TextInput, TouchableOpacity, Dimensions} from 'react-native'
import { NavigationContainer, ThemeProvider } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { RecommendForm } from './RecommendForm'
import ReactDOM from 'react-dom'

export default function App () {
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
  )
}

const Stack = createStackNavigator()

// Login screen
function LoginScreen ({ navigation }) {

  // useForm allows us to validate inputs and build forms
  const {control, handleSubmit, setError, errors} = useForm( { criteriaMode: 'all' })
  const usernameInputRef = React.useRef()
  const passwordInputRef = React.useRef()

  const onSubmit = async (data) => { 
    // Once handleSubmit validates the inputs in onPress in button, this code is executed
    const json = JSON.parse(JSON.stringify(data))
    const username = json["username"]
    const password = json["password"]
    const user = {username, password}
    console.log(JSON.stringify(user))
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    }).then((response) => response.json())
    .then(data => {
        return data;
    });
    if (response.message == "login successfull") {
      navigation.navigate('Main');
    } else {
      //clear the input fields and display message
    }
    console.log(response)
    
  }

  const onError = (errors, e) => console.log(errors, e)

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.label}>Username</Text>
        <Controller 
          name="username" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              autoCapitalize={false}
              style={styles.textbox}
              onChangeText={(value) => {
                props.onChange(value)
              }}
              ref={usernameInputRef}
            />
          }
        />
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <Controller 
          name="password" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              secureTextEntry={true}
              style={styles.textbox}
              onChangeText={(value) => {
                props.onChange(value)
              }}
              ref={passwordInputRef}
            />
          }
        />
      </View>
      <View>
        <Button color="black" title="Log In" 
          // handleSubmit validates inputs before calling onSubmit
          onPress={handleSubmit(onSubmit, onError)} 
          // onPress={() => navigation.navigate('Main')}
          />
      </View>
    </View>
  )
}

// Main menu screen
function MainScreen ({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
      Main Menu</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Recommendations')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>Get recommendation</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('RecordDrive')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>Record a new drive</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Statistics')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>View statistics</Text>
      </TouchableOpacity>

      <Text style={styles.text}>
        </Text>

      <TouchableOpacity
        // onPress={() => navigation.navigate('Recommendations')}
        style={{ backgroundColor: '#fff' }}>
        <Text style={styles.button}>View/edit past drives</Text>
      </TouchableOpacity>

    </View>
  )
}

//GetRecommendations screen
function RecommendScreen({ navigation }) {
  const { control, handleSubmit, errors } = useForm();
  const restaurantInputRef = React.useRef()
  const distanceInputRef = React.useRef()
  const payInputRef = React.useRef()

  //Variables to print prediction and message
  const [newPrediction, setNewPrediction] = useState(`__`);
  const [myMessage, setMyMessage] = useState(`__`);
  
  
  const onSubmit = async (data) => { 
    // Once handleSubmit validates the inputs in onPress in button, this code is executed
    const json = JSON.parse(JSON.stringify(data))
    const restaurant = json["restaurant"]
    const distance = json["distance"]
    const pay = json["pay"]
    const drive = {restaurant, distance, pay}
    console.log(drive)
    const response = await fetch("http://127.0.0.1:5000/get_recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(drive)
    }).then((response) => response.json())
    .then(data => {
        return data;
    });
    
    const prediction = response.message.prediction
    const message = response.message.message
    console.log("message: " + message+ ", prediction: " + prediction)

      //Set variables for later printing
    {(newPrediction) => setNewPrediction(prediction)}
    {(newMessage) => setNewMessage(message)}
  }

  return (

    <View style={styles.container}>
      
      <Text style={styles.title}>Get Recommendation!</Text>
      
      <View>
        <Text style={styles.label}>Restaurant</Text>
        <Controller 
          name="restaurant" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              
              style={styles.textbox}
              onChangeText={(value) => {
                props.onChange(value)
              }} 
              ref={restaurantInputRef}
            />
          }
        />
      </View>

      <View>
        <Text style={styles.label}>Distance</Text>
        <Controller 
          name="distance" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              
              style={styles.textbox}
              onChangeText={(value) => {
                props.onChange(value)
              }} 
              ref={distanceInputRef}
            />
          }
        />
      </View>

      <View>
        <Text style={styles.label}>Pay</Text>
        <Controller 
          name="pay" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              
              style={styles.textbox}
              onChangeText={(value) => {
                props.onChange(value)
              }} 
              ref={payInputRef}
            />
          }
        />
      </View>
      <View>
        <TouchableOpacity
          // handleSubmit validates inputs before calling onSubmit
          onPress={handleSubmit(onSubmit)}

          //Sets display variable to prediction
          //onPress= {(newPrediction) => setNewPrediction(`##`)}
          //Current issue: Can't get onPress to do both at the same time

          //TO DO: OnPress will also enable the accept and reject drive buttons

          style={{ backgroundColor: 'cyan', margin: 10 }}>
        <Text style={ styles.button}>Get Recommendation</Text>
      </TouchableOpacity>
      </View>

      <View>
      <Text style={styles.text}>{`Prediction: ${newPrediction}/hour`}</Text>
      </View>

      <View>
      <TouchableOpacity onPress={() => navigation.navigate('RecordDrive')}
          style={{ backgroundColor: 'rgba(33, 161, 72, 1)'}}>
          <Text style={styles.button}>Accept Drive</Text>    
      </TouchableOpacity>

      <Text style={styles.label}>  </Text>

      <TouchableOpacity 
      //TO DO: OnPress should clear the textboxes and disable the accept button (or just refresh the page entirely)
          onPress= {(myPrediction) => setMyPrediction(`__`)}
          style={{ backgroundColor: `rgba(203, 59, 59, 1)`}}>
          <Text style={styles.button}>Reject Drive</Text>
      </TouchableOpacity>
      </View>
  
    </View>
    
  )
}

// For formatting the time, ensuring the zeros in front of the time
// Slice -2 means selecting from the end of the array
const formatNumber = number => `0${number}`.slice(-2);

// For getting minutes and seconds from a time passed
const getRemaining = (time) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

// RecordDrive screen
function RecordDriveScreen ({ navigation }) {
  // Storing a variable remainingSecs
  const [remainingSecs, setRemainingSecs] = useState(0);
  // Storing a variable isActive
  const [isActive, setIsActive] = useState(false);
  // Calling getRemaining to get time passed
  const { mins, secs } = getRemaining(remainingSecs);
  // Called when pressing start/pause button
  const toggle = () => {
    setIsActive(!isActive);
  }
  // Resets the time back to initial state
  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
  }
  
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1);
      }, 1000);
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
      <TouchableOpacity onPress={toggle} style={styles.button}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={reset} style={[styles.button, styles.buttonReset]}>
          <Text style={[styles.buttonText, styles.buttonTextReset]}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

// Statistics screen
function StatisticsScreen ({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
      Statistics</Text>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1ddf6e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'black',
    fontSize: 30,
    // backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 15,
    padding: 7,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  button: {
    color: 'black',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  textbox: {
    //backgroundColor: 'rgba(150,150,150,1)',
    backgroundColor: 'white',
  	height: 40,
  	width: 200,
  	marginTop: 10,
  	marginBottom: 20,
  	borderRadius: 5,
  	borderColor: 'white',
  	borderWidth: 1,
  	padding: 5
  },
  text: {
    fontSize: 20,
    color: 'black',
    margin: 10,
    alignContent: 'center'
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
  },
  buttonText: {
    fontSize: 45,
    // color: '#B9AAFF'
    color: 'black',
  },
  buttonTextReset: {
    fontSize: 45,
    color: 'black',
  },
  timerText: {
    fontSize: 80,
  }
});

/*colors!
Main background green: '#1ddf6e'
Reject drive red: `rgba(203, 59, 59, 1)`
*/
