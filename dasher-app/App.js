import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, FlatList} from 'react-native'
import { NavigationContainer, ThemeProvider } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'

import { RecommendForm } from './RecommendForm'
import ReactDOM from 'react-dom'
import { State } from 'react-native-gesture-handler'

export default function App () {
  return (
	<NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainScreen} 
          //Nulling headerLeft removes navigation back to login screen
          options={{headerLeft: null, headerBackTitle: 'Log out'}}/>
        <Stack.Screen name="Recommendations" component={RecommendScreen} 
          options={{title: 'Get Recommendation'}}/>
        <Stack.Screen name="RecordDrive" component={RecordDriveScreen} 
          options={{title: 'Record Drive'}}/>
        <Stack.Screen name="SaveDrive" component={SaveDriveScreen} />
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
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accepts":"application/json"
      },
      body: JSON.stringify(user)
    }).then((response) => response.json())
    .then(data => {
        return data;
    });
    console.log(response.message)
    if (response.message == "login successful") {
      navigation.navigate('Main');
    } else {
      //Display message
      alert(`Login invalid`)
    }
    console.log(response)
    
  }
  const signup = () => {
    navigation.navigate('Signup');
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
            //I know the following line sometimes gives a warning.
              //Please leave it in place, otherwise the forms are hard to work with
              autoCapitalize="none"
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
        <TouchableOpacity 
          // handleSubmit validates inputs before calling onSubmit
          onPress={handleSubmit(onSubmit, onError)}
          // onPress={() => navigation.navigate('Main')}
          style={styles.buttonSpecial}>
          <Text style={styles.button}>Log In</Text>    
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.label}> </Text>
        <TouchableOpacity onPress={signup}>
          <Text style={styles.buttonWhiteText}>New to Dasher? Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

//Signup screen
function SignupScreen ({ navigation }) {

  // useForm allows us to validate inputs and build forms
  const {control, handleSubmit, setError, errors} = useForm( { criteriaMode: 'all' })
  const usernameInputRef = React.useRef()
  const passwordInputRef = React.useRef()
  const emailInputRef = React.useRef()
  
  const onSubmit = async (data) => { 
    // Once handleSubmit validates the inputs in onPress in button, this code is executed
    const json = JSON.parse(JSON.stringify(data))
    const username = json["username"]
    const password = json["password"]
    const email = json["email"]
    const newUser = {username, password, email}
    console.log(JSON.stringify(newUser))
    const response = await fetch("http://localhost:5000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
  }).then((response) => response.json())
  .then(data => {
      return data;
  });
  if (response.message == "user created") {
    navigation.navigate('Login');
    alert(`Account created! Please sign in`)
    //navigation.navigate('Main');
  } else {
    alert(`A problem occurred. Please try again`)
  }
  console.log(response)
  
}

const onError = (errors, e) => console.log(errors, e)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View>
        <Text style={styles.label}>Username</Text>
        <Controller 
          name="username" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              autoCapitalize="none"
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
        <Text style={styles.label}>Email</Text>
        <Controller 
          name="email" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              autoCapitalize="none"
              secureTextEntry={false}
              style={styles.textbox}
              onChangeText={(value) => {
                props.onChange(value)
              }}
              ref={emailInputRef}
            />
          }
        />
      </View>
      <View>
        <TouchableOpacity 
          // handleSubmit validates inputs before calling onSubmit
          onPress={handleSubmit(onSubmit, onError)}
          // onPress={() => navigation.navigate('Main')}
          style={styles.buttonSpecial}>
          <Text style={styles.button}>Sign up</Text>    
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Main menu screen
function MainScreen ({ navigation }) {
  function logout() {
    /*await*/ fetch("http://localhost:5000/logout")
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
      Main Menu</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Recommendations')}
        style={styles.buttonBasic}>
        <Text style={styles.button}>Get recommendation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('RecordDrive')}
        style={styles.buttonBasic}>
        <Text style={styles.button}>  Record a new drive  </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Statistics')}
        style={styles.buttonBasic}>
        <Text style={styles.button}>      View statistics      </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => navigation.navigate('Recommendations')}
        style={styles.buttonBasic}>
        <Text style={styles.button}>View/edit past drives</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => logout()}
        style={styles.buttonLogout}>
        <Text style={styles.button}>Log out</Text>
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
  const [newMessage, setNewMessage] = useState(``);
  
  const onSubmit = async (data) => { 
    // Once handleSubmit validates the inputs in onPress in button, this code is executed
    const json = JSON.parse(JSON.stringify(data))
    const restaurant = json["restaurant"]
    const distance = json["distance"]
    const pay = json["pay"]
    const drive = {restaurant, distance, pay}
    console.log(drive)
    const response = await fetch("http://localhost:5000/get_recommendation", {
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
    setNewPrediction(Math.round(prediction * 100) / 100)
    setNewMessage(message)
  }

  function refresh() {
    navigation.navigate('Main')
    navigation.navigate('Recommendations')
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

          //TO DO: OnPress will also enable the accept and reject drive buttons

          style={styles.buttonSpecial}>
        <Text style={ styles.button}>Get Recommendation</Text>
      </TouchableOpacity>
      </View>
   
      <Text style={styles.text}>{`Prediction: $${newPrediction}/hour`}</Text>
      <Text style={styles.label}>{`Notes: ${newMessage}`}</Text>
      <Text style={styles.label}>  </Text>

      <View>
      <TouchableOpacity onPress={() => navigation.navigate('RecordDrive')}
          style={{backgroundColor: 'white',
          marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5,
          borderWidth: 1, borderRadius: 20}}>
          <Text style={{fontSize: 17, color: 'black', marginHorizontal: 10, 
          marginVertical: 10, paddingHorizontal: 5}}>Accept Drive</Text>    
      </TouchableOpacity>

      <TouchableOpacity onPress={() => refresh()}
          style={{backgroundColor: 'rgba(150,150,150,.5)',
          marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5,
          borderWidth: 1, borderRadius: 20, borderColor: 'black'}}>
          <Text style={{fontSize: 17, color: 'black', marginHorizontal: 10, 
          marginVertical: 10, paddingHorizontal: 5}} >  Clear Form</Text>
      </TouchableOpacity>
      </View>
  
    </View>
    
  )
}

// RecordDrive screen
function RecordDriveScreen ({ navigation }) {
  // For formatting the time, ensuring the zeros in front of the time
  // Slice -2 means selecting from the end of the array
  const formatNumber = number => `0${number}`.slice(-2);

    // For getting minutes and seconds from a time passed
  const getRemaining = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins * 60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
  }
  // Storing a variable remainingSecs
  const [remainingSecs, setRemainingSecs] = useState(0);
  // Storing a variable isActive
  const [isActive, setIsActive] = useState(false);
  // Calling getRemaining to get time passed
  const { mins, secs } = getRemaining(remainingSecs);

  const [laps, setLaps] = useState([]);
  let [index, setIndex] = useState(0);

  // Called when pressing start/pause button
  const toggle = () => {
    setIsActive(!isActive);
    takeLap();
  }

  const takeLap = () => {
    // setting start position
    laps.push(Date(Date.now()));
    // update table!
    // splits.map(updateLap)
  }
  // Resets the time back to initial state
  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
    const laps = [];
  }

  const saveDrive = async () => {
    /**
    const end = laps.pop();
    const restaurant_leave = laps.pop();
    const restaurant_arrival = laps.pop();
    const start = laps.pop();
    
    const drive = {"start": start, "restaurant_arrival": restaurant_arrival, "restaurant_leave": restaurant_leave, "end": end}
    console.log(drive)
    const response = await fetch("http://localhost:5000/record_drive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(drive)
    })
    console.log(response);
    */
    alert('Recording successfully saved!')
    navigation.navigate('SaveDrive')
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

  // array of objects
  const [ splits, setSplits ] = useState([
    {
      Increment: "Start",
      Time: "--",
    },
    {
      Increment: "Arrived",
      Time: "--",
    },
    {
      Increment: "Departed",
      Time: "--",
    },
    {
      Increment: "End",
      Time: "--",
    }
  ])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
      <View style={{textAlign: 'center'}}>
      <View style= {{flexDirection: 'row', textAlign: 'center', justifyContent: 'center'}}>
        <TouchableOpacity onPress={toggle} style={ {backgroundColor: 'white', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
          <Text style={{fontSize: 15, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>
            { isActive ? 'Pause' : 'Start' }
            </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takeLap} style={ {backgroundColor: '#A9A9A9', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
          <Text style={{fontSize: 15, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>
            { (index == 1) ? 'Arrived' : (index == 2) ? 'Left' : (index == 3) ? 'End' : 'Add Time'}
            </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={reset} style={{backgroundColor: 'black', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
        <Text style={{fontSize: 15, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 5, color: 'white'}}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={saveDrive} style={{backgroundColor: 'rgba(255,255,255,.5)', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20, borderColor: 'white'}}>
        <Text style={{fontSize: 15, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>Save</Text>
      </TouchableOpacity> 
      <View style= {{flexDirection: 'row', textAlign: 'center', justifyContent: 'center'}}>
      <FlatList 
        data={splits}
        style={{width:"15%"}}
        keyExtractor={(item, index) => index+""}
        renderItem={({item, index})=> {
          return (
            <View style={{backgroundColor: index % 2 == 1 ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.75)'}}>
              <Text style={{textAlign: 'center'}}>{item.Increment}</Text>
              <Text style={{textAlign: 'center'}}>{item.Time}</Text>
            </View>
          )
        }}
      />
      </View>
      </View>
  </View>
  );
}

function SaveDriveScreen ({ navigation }) {
  const {control, handleSubmit, setError, errors} = useForm( { criteriaMode: 'all' })
  const commentText = React.useRef()

  const saveComments = () => {
    // call save comments api here
    alert('Comments successfully saved!')
    navigation.navigate('Main')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <TextInput 
        style={styles.commentsBox}
        multiline={true}
        placeholder={"Add comments about the restaurant here!"}
        // numberOfLines={5}
        textAlignVertical={"top"}
        textBreakStrategy={"highQuality"}
        textAlignVertical
        autoCorrect>
      </TextInput>
      <TouchableOpacity onPress={saveComments} style={{backgroundColor: 'white', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
        <Text style={{fontSize: 15, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>Save</Text>
      </TouchableOpacity> 
    </View>
  )
}

// Statistics screen
function StatisticsScreen ({ navigation }) {
  //const { control, handleSubmit, errors } = useForm();
  const [newStatistics, setNewStatistics] = useState(`__`);

  /*async function fetchMovies() {
  const response = await fetch('/movies');
  // waits until the request completes...
  console.log(response);
}*/

  const onSubmit = async (data) => { 
    const response = await fetch("http://localhost:5000/get_statistics")
    .then((response) => response.json())
    .then(data => {
        return data;
    });
    console.log(response)

    //const statistics = response.statistics
    const statistics = response
    //console.log("statistics: " + statistics)

    //Set variables for later printing
    setNewStatistics(statistics)
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      <View>
        <TouchableOpacity
          // handleSubmit validates inputs before calling onSubmit
          //onPress={handleSubmit(onSubmit)}
          onPress={onSubmit}
          style={styles.buttonSpecial}>
        <Text style={ styles.button}>Get Statistics</Text>
      </TouchableOpacity>
      </View>
      <Text style={styles.text}>{`${newStatistics}`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#66cc99',
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
    borderRadius: 10
  },
  buttonWhiteText: {
    color: 'white',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  buttonBasic: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 15,
    //borderColor: 'gray',
  	borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 7
  },
  buttonLogout: {
    backgroundColor: 'rgba(255,255,255,.5)',
    color: 'black',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 25,
    borderColor: 'white',
  	borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 7
  },
  buttonSpecial: { //Currently identical to buttonBasic
    //backgroundColor: '#8ebce7',
    //backgroundColor: '#94bfe7',
    //backgroundColor: '#072A42',
    backgroundColor: 'white',
    color: 'white',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 15,
    borderColor: 'black',
  	borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 7
  },
  buttonSmall: {
    fontSize: 17,
    marginHorizontal: 5,
    marginVertical: 10,
    //borderColor: 'gray',
  	//borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 2
  },
  textbox: {
    backgroundColor: 'rgba(255,255,255,.5)',
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
    fontSize: 30,
    // color: '#B9AAFF'
    color: 'black',
  },
  buttonTextReset: {
    fontSize: 30,
    color: '#808080',
  },
  timerText: {
    fontSize: 70,
    color: 'white',
  },
  commentsBox: {
      backgroundColor: 'rgba(255,255,255,.5)',
      height: 150,
      width: 250,
      marginTop: 10,
      marginBottom: 20,
      borderRadius: 5,
      borderColor: 'white',
      borderWidth: 1,
      padding: 5,
      flexWrap: 'wrap',
      overflow: 'scroll',
  },
});

/*Colors!
Old background green: '#1ddf6e'
New background green: '#66cc99'
Button blue: '#80add6'
Textbox half-opacity white: 'rgba(255,255,255,.5)'
Old reject-drive red: `rgba(203, 59, 59, 1)`
*/
