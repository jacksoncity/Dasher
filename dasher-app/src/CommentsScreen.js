import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, Alert, TextInput, TouchableOpacity, FlatList} from 'react-native'
import { Trash2 } from 'react-feather';

export function CommentsScreen ({ navigation }) {
  const [scrollList, setScrollList] = useState({})

    useEffect ( () => {
      async function fetchData() {
        const response = await fetch("http://localhost:5000/get_comments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }).then((response) => response.json())
        const list = response.comments // an array of comments (restaurant name and comment)
        console.log(list)

        setScrollList(list)
      }
      fetchData();
    }, [])
    // if the text is longer than what can be displayed, cut it short with ...
    const deleteItem = (id) => {
      // send back the whole item and it will delete that comment

      /**
      const response = await fetch("http://localhost:5000/get_comments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).then((response) => response.json())
      const list = response.comments // an array of comments (restaurant name and comment)
      console.log(list)
      */
    }

    return (
      <View style={styles.container}>
      <FlatList
          keyExtractor = {item => item.comment_id.toString()}  
          data={scrollList}
          renderItem = {item => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Main')}
              style={styles.textbox}
            >
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.restaurant}>{item.item.restaurant_name}</Text>
                <Trash2
                  name="trash-2"
                  color='black'
                  size={15}
                  // onPress={() => deleteItem(item.comment_id)}
                />
              </View>
              <Text style={styles.comment}>{item.item.comment}</Text>
            </TouchableOpacity>
            )} />
      <TouchableOpacity
       onPress={() => navigation.navigate('SaveDrive')} 
      >
        <Text style={styles.button}>
          Add comment
        </Text>
      </TouchableOpacity>
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
      height: 60,
      width: 250,
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
  restaurant: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold'
  },
  comment: {
    fontSize: 12,
    color: 'black'
  }
})