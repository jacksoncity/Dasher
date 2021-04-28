import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, TouchableOpacity } from 'react-native'

// Statistics screen
export function StatisticsScreen ({ navigation }) {
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
      // console.log("statistics: " + statistics)
  
      //Set variables for later printing
      setNewStatistics(statistics)
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.text}>{`${newStatistics}`}</Text>
        <View>
          <TouchableOpacity
            // handleSubmit validates inputs before calling onSubmit
            //onPress={handleSubmit(onSubmit)}
            onPress={onSubmit}
            style={styles.buttonBasic}>
          <Text style={ styles.button}>      Get Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          //onPress={ () => navigation.navigate('Drives')}
          style={styles.buttonBasic}>
          <Text style={styles.button}>View/edit past drives</Text>
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
    buttonBasic: {
      backgroundColor: 'white',
      // marginHorizontal: 10,
      // marginVertical: 15,
      marginTop: 10,
      //borderColor: 'gray',
        borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 7,
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
    text: {
        fontSize: 20,
        color: 'black',
        margin: 10,
        alignContent: 'center'
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