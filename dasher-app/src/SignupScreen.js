import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, FlatList} from 'react-native'

//Signup screen
export function SignupScreen ({ navigation }) {
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