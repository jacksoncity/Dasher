import 'react-native-gesture-handler'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, FlatList} from 'react-native'
import { Trash2 } from 'react-feather';

export function ViewDrivesScreen ({ navigation }) {
  const [scrollList, setScrollList] = useState({})

    useEffect ( () => {
      async function fetchData() {
        const response = await fetch("http://localhost:5000/get_drives", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }).then((response) => response.json())
        const list = response.drives // an array of comments (restaurant name and comment)
        console.log(list)

        setScrollList(list)
      }
      fetchData();
    }, [])

    const [totalTime, setTT] = useState()

    return (
      <View style={styles.container}>
      <FlatList
          keyExtractor = {item => item.id.toString()}  
          data={scrollList}
          renderItem = {item => (
            <TouchableOpacity 
              style={styles.textbox} >
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.driveTitle} onPress={() => navigation.navigate('Main')}>{item.item.restaurant_name} - {item.item.start.substr(8, 3)} {item.item.start.substr(5, 2)}, {item.item.start.substr(12, 4)}</Text>
              </View>
              <Text style={styles.comment}>Overall Time: {(Math.abs(item.item.end.substr(17, 2)-item.item.start.substr(17,2)))}:{(Math.abs(item.item.end.substr(20, 2)-item.item.start.substr(20,2)))}:{(Math.abs(item.item.end.substr(23, 2) - item.item.start.substr(23, 2)))}</Text>
              <Text style={styles.comment}>Pay: ${item.item.pay}</Text>
            </TouchableOpacity>
            )} />
      </View>
    );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 150,
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    fontSize: 20,
    textAlign: 'center',
    // alignSelf: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#66cc99',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  textbox: {
    backgroundColor: 'rgba(255,255,255,.5)',
      height: 80,
      width: 350,
      marginTop: 10,
      // marginBottom: 5,
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
  driveTitle: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5
  },
  comment: {
    fontSize: 12,
    color: 'black',
    marginBottom: 5
  }
})