import 'react-native-gesture-handler'
import React, { useEffect, useState, Component } from 'react'
import { Image, StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, FlatList} from 'react-native'
import car from './assets/car3.png';

// Main menu screen
export function MainScreen ({ navigation }) {
    function logout() {
      /*await*/ fetch("http://localhost:5000/logout")
      navigation.navigate('Login')
    }
   
    return (
      <View style={styles.container}>
        <Image source={car} style={{ width: 150, height: 70 }} />  

        <Text style={styles.title}>
        Main Menu</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Recommendations')}
          style={styles.buttonBasic}>
          <Text style={styles.button}>Get recommendation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('NewDrive')}
          style={styles.buttonBasic}>
          <Text style={styles.button}>  Record a new drive  </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Statistics')}
          style={styles.buttonBasic}>
          <Text style={styles.button}>  Stats & past drives  </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={ () => navigation.navigate('Comments')}
          style={styles.buttonBasic}>
          <Text style={styles.button}>View/edit comments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => logout()}
          style={styles.buttonLogout}>
          <Text style={styles.button}>Log out</Text>
        </TouchableOpacity>
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
    buttonBasic: {
        backgroundColor: 'white',
        // marginHorizontal: 10,
        marginVertical: 15,
        marginTop: 10,
        //borderColor: 'gray',
          borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 7,
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
})