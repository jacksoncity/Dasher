import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, TouchableOpacity } from 'react-native'

// Statistics screen
export function StatisticsScreen ({ navigation }) {
    //const { control, handleSubmit, errors } = useForm();
    const [newPay, setNewPay] = useState(`__`);
    const [newDistance, setNewDistance] = useState(`__`);
    const [newTrips, setNewTrips] = useState(`__`);
    const [newAvgTime, setNewAvgTime] = useState(`__`);
    const [newAvgRate, setNewAvgRate] = useState(`__`);
  
    useEffect ( () => {
      async function fetchData() {
        const response = await fetch("http://localhost:5000/get_statistics")
        .then((response) => response.json())
        .then(data => {
            return data;
        });
        console.log(response)

        const pay = response.message.pay
        const distance = response.message.distance
        const trips = response.message.trips
        const avgTime = response.message.avgTime
        const avgRate = response.message.avgRate
        console.log("Statistics received")
    
        //Set variables for later printing
        setNewPay(pay)
        setNewDistance(distance)
        setNewTrips(trips)
        setNewAvgTime(avgTime)
        setNewAvgRate(avgRate)
      }
      fetchData();
    }, [])
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Driver Statistics</Text>
        <Text style={styles.text}>{`Money Earned: $${newPay}`}</Text>
        <Text style={styles.text}>{`Distance Driven: ${newDistance} miles`}</Text>
        <Text style={styles.text}>{`Trips Completed: ${newTrips}`}</Text>
        <Text style={styles.text}>{`Avg. Delivery Time: ${newAvgTime} min`}</Text>
        <Text style={styles.text}>{`Avg. Hourly Rate: $${newAvgRate}`}</Text>
        
        <View>
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
      marginVertical: 15,
      marginTop: 25,
      //borderColor: 'gray',
        borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 7,
    },
    text: {
        fontSize: 20,
        color: 'black',
        margin: 5,
        alignContent: 'center'
    },
    title: {
        color: 'black',
        fontSize: 30,
        // backgroundColor: 'white',
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 7,
        paddingHorizontal: 20,
        borderRadius: 5
    },
})