import React, { useState } from "react";
import { StyleSheet, Button, Text, View, TextInput} from 'react-native';
import { useForm } from "react-hook-form";

export const RecommendForm = ({ onNewRec }) => {
    const { control, handleSubmit, errors } = useForm();

    const [restaurant, setRest] = useState("");
    const [distance, setDist] = useState(0);
    const [payment, setPay] = useState(0.00);

    return (
        <form>
          <input name="restaurant" ref={restaurant} />
          <input name="distance" ref={distance} />
          <input name="pay" ref={payment} />
    
          <button
            type="button"
            onClick={async () => {
              const values = getValues(); 
              const response = await fetch("/get_recommendation", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify(values)
                  });

                  if (response.ok) {
                    console.log("response worked!");
                    const jsonResponse = await response.json();
                    console.log(jsonResponse.message);
                    console.log(jsonResponse.prediction);
                    const message = jsonResponse.message;
                    const prediction = jsonResponse.prediction;
                    const toReturn = {message, prediction};
                    onNewRec(toReturn);
                  }
              }
            }
            >
            Get Values
          </button>
        </form>
      );
    
}