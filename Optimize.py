'''
Created on Feb 28, 2021

This class is so to do the actual work of the optimization, I just put it in it's own class
so that it is easier to see I guess

@author: ianrose
'''

from sklearn.model_selection import train_test_split
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Ridge

class MyClass(object):
    '''
    classdocs
    '''

'''
This method is the actual linear regression that will be happening
This will check to see if the optimization will be accurate or not because of 
how much past data the driver has and will let the driver know and stuff.
@param pastData: this is the past data that the user has in the database (dataframe)
@param newData: new data that the driver just inputed to get estimation from (has to be np array)
'''
def optimize(pastData, newData):
    distance = np.array(newData.drop(columns = "Distance"))
    pay = np.array(newData.drop(columns = "Pay"))
    restaurant = np.array(newData.drop(columns = "Restaurant"))
    stats = np.stack((distance, pay, restaurant), axis = -1)
    targets = np.array(newData.drop(columns = "Rate"))
    
    if(len(stats) < 100):
        '''
        handle this error and let the user know that it will not be an accurate prediction
        '''
        print("Prediction might not be accurate")
        
    # xTrain, xTest, yTrain, yTest = train_test_split(stats, targets, random_state=0)
    # don't know yet if I need to have a training and testing set but I am not right now
    ridge = Ridge().fit(stats, targets)
    prediction = ridge.predict(newData)
    
    print(prediction)
        
    
        
