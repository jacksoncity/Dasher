import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'

export function SaveDriveScreen ({ navigation }) {
    const {control, handleSubmit, setError, errors} = useForm( { criteriaMode: 'all' })
    const commentText = React.useRef()
    const restaurantInputRef = React.useRef()
  
    const saveComments = async (data) => {
      // call save comments api here
      const json = JSON.parse(JSON.stringify(data))
      console.log(json)
      const restaurant_name = json["restaurant_name"]
      const comment = json["comment"]
      const comm = {restaurant_name, comment}
      const response = await fetch("http://localhost:5000/add_comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comm)
      })
      console.log(response);
      if (response.status === 201) {
        alert('Comments successfully saved!')
        navigation.navigate('Main')
      } else {
          alert('Error in comment saving... Please make sure you filled in both fields to save comment.')
      }
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add Comments</Text>
        <Text style={{textAlign: 'left'}}>Restaurant Name</Text>
        <Controller 
          name="restaurant_name" 
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
          }/>
        <Text style={{textAlign: 'left'}}>Comments</Text>
        <Controller 
          name="comment" 
          control={control} 
          rules= {{required: 'This is required'}}
          defaultValue=''
          render={(props) => 
            <TextInput {...props} 
              style={styles.commentsBox}
              // placeholder={"Add comments about the restaurant here!"}
              onChangeText={(value) => {
                props.onChange(value)
              }} 
              multiline={true}
              ref={commentText}
            />
          }/>
        <TouchableOpacity onPress={handleSubmit(saveComments)} style={{backgroundColor: 'white', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
          <Text style={{fontSize: 20, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>Save Comment</Text>
        </TouchableOpacity> 

        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={{backgroundColor: 'gray', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
          <Text style={{fontSize: 20, marginHorizontal: 10, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>  Back to Main  </Text>
        </TouchableOpacity>
      </View>
    )
  }


const styles = StyleSheet.create({
    commentsBox: {
        backgroundColor: 'rgba(255,255,255,.5)',
        height: 150,
        width: 200,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
  
        flexWrap: 'wrap',
        overflow: 'scroll',
        padding: 5
    },
    container: {
      flex: 1,
      backgroundColor: '#66cc99',
      alignItems: 'center',
      justifyContent: 'center'
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