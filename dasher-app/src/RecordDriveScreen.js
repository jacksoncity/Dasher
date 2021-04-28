import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, Component } from 'react'
import { StyleSheet, Button, Text, View, TouchableOpacity } from 'react-native'

// RecordDrive screen
export function RecordDriveScreen ({ navigation }) {
    // For formatting the time, ensuring the zeros in front of the time
    // Slice -2 means selecting from the end of the array
    const formatNumber = number => `0${number}`.slice(-2);
  
      // For getting minutes and seconds from a time passed
    const getRemaining = (time) => {
      const mins = Math.floor(time / 60);
      const secs = time - mins * 60;
      return { mins: formatNumber(mins), secs: formatNumber(secs) };
    }
    // Storing a variable remainingSecs
    const [remainingSecs, setRemainingSecs] = useState(0);
    // Storing a variable isActive
    const [isActive, setIsActive] = useState(false);
    // Calling getRemaining to get time passed
    const { mins, secs } = getRemaining(remainingSecs);
  
    const [laps, setLaps] = useState([]);
    // let [index, setIndex] = useState(0);
  
    const [index, setIndex] = useState(0);
    const [start, setStart] = useState(["Start"]);
    const [arrive, setArrive] = useState(["Arrived at Restaurant"]);
    const [depart, setDepart] = useState(["Left Restaurant"]);
    const [end, setEnd] = useState(["Finished Drive"]);
  
    const takeLap = () => {
      // setting start position
      laps.push(Date(Date.now()));
  
      const m = mins;
      const s = secs;
       
      if (index === 0) {
        setIsActive(!isActive);
        start.push(`${m}:${s}`);
        console.log ("index = 0")
      } else if (index === 1) {
        arrive.push(`${m}:${s}`);
        console.log ("index = 1")
      } else if (index === 2) {
        depart.push(`${m}:${s}`);
        console.log ("index = 2")
      } else if (index === 3) {
        end.push(`${m}:${s}`);
        console.log ("index = 3")
        setIsActive(!isActive);
      } else {
        alert("No more splits to take!")
      }
      setIndex(index + 1);
      console.log(index)
    }
    // Resets the time back to initial state
    const reset = () => {
      setRemainingSecs(0);
      setIsActive(false);

      setLaps([])
      setStart(["Start"])
      setArrive(["Arrived at Restaurant"])
      setDepart(["Left Restaurant"])
      setEnd(["Finished Drive"])
      setIndex(0)
    }
  
    const saveDrive = async () => {
      /**
      const end = laps.pop();
      const restaurant_leave = laps.pop();
      const restaurant_arrival = laps.pop();
      const start = laps.pop();
      
      const drive = {"start": start, "restaurant_arrival": restaurant_arrival, "restaurant_leave": restaurant_leave, "end": end}
      console.log(drive)
      const response = await fetch("http://localhost:5000/record_drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(drive)
      })
      console.log(response);
      */
      
      alert('Recording successfully saved!')
      navigation.navigate('SaveDrive')
    }
    
    useEffect(() => {
      let interval = null;
      if (isActive) {
        interval = setInterval(() => {
          setRemainingSecs(remainingSecs => remainingSecs + 1);
        }, 1000);
      } else if (!isActive && remainingSecs !== 0) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isActive, remainingSecs]);
  
  
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
        <View style={{textAlign: 'center'}}>
        <View style= {{flexDirection: 'row', textAlign: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={takeLap} style={ {backgroundColor: '#A9A9A9', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
            <Text style={{fontSize: 15, marginHorizontal: 60, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>
              { (index === 1) ? 'At Restaurant' : (index === 2) ? 'Left Restaurant' : (index === 3) ? 'End Drive' : 'Start'}
              </Text>
          </TouchableOpacity>
          </View>
          </View>
          <View style={{textAlign: 'center'}}>
          <TouchableOpacity onPress={reset} style={{textAlign: 'center', backgroundColor: 'black', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20}}>
            <Text style={{fontSize: 15, marginHorizontal: 60, marginVertical: 10, paddingHorizontal: 5, color: 'white'}}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDrive} style={{textAlign: 'center', backgroundColor: 'rgba(255,255,255,.5)', marginHorizontal: 5, marginVertical: 10, paddingHorizontal: 5, borderWidth: 1, borderRadius: 20, borderColor: 'white'}}>
            <Text style={{fontSize: 15, marginHorizontal: 60, marginVertical: 10, paddingHorizontal: 5, color: 'black'}}>Save</Text>
          </TouchableOpacity>
            <Text style={{backgroundColor: 'rgba(255,255,255,.55)', textAlign: 'center'}}>{ start[0]}</Text>
            <Text style={{backgroundColor: 'rgba(255,255,255,.75)', textAlign: 'center'}}>{ (index < 1) ? '--' : start[1]}</Text>
            <Text style={{backgroundColor: 'rgba(255,255,255,.55)', textAlign: 'center'}}>{arrive[0]}</Text>
            <Text style={{backgroundColor: 'rgba(255,255,255,.75)', textAlign: 'center'}}>{ (index < 2) ? '--' : arrive[1]}</Text>
            <Text style={{backgroundColor: 'rgba(255,255,255,.55)', textAlign: 'center'}}>{depart[0]}</Text>
            <Text style={{backgroundColor: 'rgba(255,255,255,.75)', textAlign: 'center'}}>{ (index < 3) ? '--' : depart[1]}</Text>
            <Text style={{backgroundColor: 'rgba(255,255,255,.55)', textAlign: 'center'}}>{end[0]}</Text>
            <Text style={{backgroundColor: 'rgba(255,255,255,.75)', textAlign: 'center'}}>{ (index < 4) ? '--' : end[1]}</Text>
      </View>
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#66cc99',
      alignItems: 'center',
      justifyContent: 'center'
    },
    timerText: {
      fontSize: 70,
      color: 'white',
    },
  });