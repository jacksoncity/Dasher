import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, FlatList} from 'react-native'

//GetRecommendations screen
export function RecommendScreen({ navigation }) {
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