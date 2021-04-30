import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import React, { useEffect, useState, Component } from 'react'
import { Image, StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, StatusBar, Platform,} from 'react-native'
import car from './assets/car3.png';
// import * as SplashScreen from 'expo-splash-screen';
// import * as Font from 'expo-font';

// Login screen
export function LoginScreen ({ navigation }) {

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
        alert(`Login invalid. Please try again`)
      }
      console.log(response)
      
    }
    const signup = () => {
      navigation.navigate('Signup');
    }
  
    const onError = (errors, e) => console.log(errors, e)
    /** 
    useEffect(() => {
      async function prepare() {
        try {
          // Keep the splash screen visible while we fetch resources
          await SplashScreen.preventAutoHideAsync();
          // Artifically delayed by 2 seconds
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
          console.warn(e);
        } finally {
          // Tell the application to render
          setAppIsReady(true);
        }
      }
      prepare();
    }, []);
  
    const onLayoutRootView = useCallback(async () => {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    }, [appIsReady]);
  
    if (!appIsReady) {
      return null;
    }
    */
  
    return (
      <View style={styles.container}>
        <Image source={car} style={{ width: 150, height: 70, marginTop: 10}} /> 

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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#66cc99',
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
        color: 'black',
        fontSize: 20,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10
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
    buttonWhiteText: {
        color: 'white',
        fontSize: 20,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 5
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
})