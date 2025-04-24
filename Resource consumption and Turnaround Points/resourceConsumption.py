from enum import Enum
import json
import tkinter as tk

class state(Enum):
    LOW_BATTERY == 1
    IN_USE == 2 
    CHARGING == 3

#rover speed in m/s
avgSpeed = 7

class roverState:

    #import TSS data and coordinates of base for refueling
    def __init__(self, TSSdata, baseCoords):
        self.data = TSSdata["rover"]
        self.baseCoords = baseCoords


    def updateRoverState(self, newData):
        self.data = newData["rover"]
 
    #gets one way trip distance
    def getOneWayDist(self, goalCoordinates):
        curr = (self.data["longitude"], self.data["latitude"])
        distToGoal = ((curr[0] - goalCoordinates[0]) ** 2 + (curr[1] - goalCoordinates[1]) ** 2) ** (1/2)
        return distToGoal

    #get total distance from current location to goal and abck to base
    def getTotalDist(self, goalCoordinates):

        distToGoal = self.getOneWayDist(goalCoordinates)
        distToBase = ((self.baseCoords[0] - goalCoordinates[0]) ** 2 + (self.baseCoords[1] - goalCoordinates[1]) ** 2) ** (1/2)
        totalDist = distToGoal + distToBase
        return totalDist
    
    #gets one way trip time in seconds
    def getOneWayTime(self, goalCoordinates):
        time = self.getOneWayDist(goalCoordinates) * avgSpeed
        return time

    #get total time in seconds needed to get to task, complete task, and get back to base
    def getTotalTime(self, goalCoordinates, estimatedTaskTime):
        dist = self.getTotalDist(self, goalCoordinates)
        timeSeconds = avgSpeed * dist
        return timeSeconds + estimatedTaskTime


def getTSSdata():
    TSSdata = json.loads('''{
        "rover": {
            "batteryLevel": 80,
            "powerConsumptionRate": 250,
            "motorPowerConsumption": 100,
            "speed": 0.1,
            "oxygenLevel": 21,
            "oxygenTank": 75,
            "oxygenPressure": 14.7,
            "pointOfNoReturn": 100,
            "distanceTraveled": 100,
            "distanceFromBase": 50   
        },  
        "eva1": {
            "primaryO2Storage": 24,
            "primaryO2Pressure": 14.7,
            "secondaryO2Storage": 19,
            "secondaryO2Pressure": 14.7,
            "suitO2Pressure": 3.07,
            "suitCO2Pressure": 0,
            "suitOtherPressure": 11.5,
            "suitTotalPressure": 14.63,
            "o2Consumption": 3.1
        }
    }''')
    return TSSdata

def main():
    

    data = getTSSdata()
    return


if __name__ == "__main__":
    main()
main()