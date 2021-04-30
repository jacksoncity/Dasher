import 'react-native-gesture-handler'
import { useForm, Controller } from 'react-hook-form'
// import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, StatusBar, TouchableOpacity, FlatList} from 'react-native'
import { NavigationContainer, NavigationHelpersContext } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
// import { Home, Navigation } from 'react-feather';

import { LoginScreen } from './src/LoginScreen'
import { SignupScreen } from './src/SignupScreen'
import { MainScreen } from './src/MainScreen'
import { RecommendScreen } from './src/RecommendScreen'
import { RecordDriveScreen } from './src/RecordDriveScreen'
import { SaveDriveScreen } from './src/SaveDriveScreen'
import { CommentsScreen } from './src/CommentsScreen'
<<<<<<< HEAD
import { AddCommentScreen } from './src/AddCommentScreen'
=======
import { ViewDrivesScreen } from './src/ViewDrivesScreen'
>>>>>>> 9fbf9864ecd8947a165e9a5c91347756c8c2f194
import { StatisticsScreen } from './src/StatisticsScreen'
import { NewDriveScreen } from './src/NewDriveScreen'

const Stack = createStackNavigator()

export default function App () {


  return (
	  <NavigationContainer>
      <Stack.Navigator 
          initialRouteName="Home" >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} 
          options={{headerTintColor: 'black'}}/>
        <Stack.Screen name="Main" component={MainScreen} 
          //Nulling headerLeft removes navigation back to login screen
          options={{headerLeft: null}}/>
        <Stack.Screen name="Recommendations" component={RecommendScreen} 
          options={{headerTintColor: 'black', title: 'Get Recommendation'}}/>
        <Stack.Screen name="NewDrive" component={NewDriveScreen} 
          options={{headerTintColor: 'black', title: 'New Drive'}}/>
        <Stack.Screen name="RecordDrive" component={RecordDriveScreen} 
<<<<<<< HEAD
          //Nulling headerLeft removes navigation back, since previous info shouldn't be changed at this point
          options={{headerLeft: null, title: 'Record Drive'}}/>
        <Stack.Screen name="SaveDrive" component={SaveDriveScreen} 
          //Nulling headerLeft removes navigation back to Record Drive
          options={{headerLeft: null, title: "Add Comment"}}/>
        <Stack.Screen name="Comments" component={CommentsScreen}
          options={{headerTintColor: 'black', title: 'Comments'}}/>
        <Stack.Screen name="AddComment" component={AddCommentScreen}
          options={{headerTintColor: 'black', title: 'New Comment'}}/>
=======
          //Nulling headerLeft removes navigation back, since info shouldn't be changed
          options={{/*headerLeft: null,*/ title: 'Record Drive'}}/>
        <Stack.Screen name="SaveDrive" component={SaveDriveScreen}
          options={{headerTintColor: 'black'}}/>
        <Stack.Screen name="Comments" component={CommentsScreen}
          options={{title: 'Comments', headerTintColor: 'black'}}/>
        <Stack.Screen name="ViewDrives" component={ViewDrivesScreen}
          options={{title: 'View Drives'}}/>
>>>>>>> 9fbf9864ecd8947a165e9a5c91347756c8c2f194
        <Stack.Screen name="Statistics" component={StatisticsScreen} 
        options={{headerTintColor: 'black'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#66cc99',
    alignItems: 'center',
    justifyContent: 'center'
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
  button: {
    color: 'black',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10
  },
  buttonWhiteText: {
    color: 'white',
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5
  },
  buttonBasic: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 15,
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
  buttonSmall: {
    fontSize: 17,
    marginHorizontal: 5,
    marginVertical: 10,
    //borderColor: 'gray',
  	//borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 2
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
  text: {
    fontSize: 20,
    color: 'black',
    margin: 10,
    alignContent: 'center'
  },
  time: {
    fontWeight: 'bold',
    fontSize: 80,
    color: '#000',
    alignContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    padding: 10,
    width: 100,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 30,
    // color: '#B9AAFF'
    color: 'black',
  },
  buttonTextReset: {
    fontSize: 30,
    color: '#808080',
  },
  timerText: {
    fontSize: 70,
    color: 'white',
  },
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
});

/*Colors!
Old background green: '#1ddf6e'
New background green: '#66cc99'
Button blue: '#80add6'
Textbox half-opacity white: 'rgba(255,255,255,.5)'
Button half-opacity black: 'rgba(150,150,150,.5)'
Old reject-drive red: `rgba(203, 59, 59, 1)`
*/
