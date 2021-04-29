import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, FlatList} from 'react-native'

//GetRecommendations screen
export function NewDriveScreen({ navigation }) {
    const { control, handleSubmit, errors } = useForm();
    const restaurantInputRef = React.useRef()
    const distanceInputRef = React.useRef()
    const payInputRef = React.useRef()

    const onAccept = async (data) => {
      // Once handleSubmit validates the inputs in onPress in button, this code is executed
      /**
      const json = JSON.parse(JSON.stringify(data))
      const restaurant = json["restaurant"]
      const distance = json["distance"]
      const pay = json["pay"]
      const drive = {restaurant, distance, pay}
      console.log(drive)
      const response = await fetch("http://localhost:5000/accept_drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(drive)
      })
      */
      console.log("Drive sent")
      navigation.navigate('RecordDrive')
    }
  
    function refresh() {
      navigation.navigate('Main')
      navigation.navigate('NewDrive')
    }
  
    return (
  
      <View style={styles.container}>
        
        <Text style={styles.title}>Enter Drive Info</Text>
        
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
          
        </View>
  
        <View>
        <TouchableOpacity onPress={handleSubmit(onAccept)}
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
    buttonSpecial: {
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
    text: {
      fontSize: 20,
      color: 'black',
      margin: 5,
      alignContent: 'center'
    },
})