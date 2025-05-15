#power consumption
from resourceConsumption import roverState
#power in kW
totalPower = 100

#Trip = to goal and back to base from cureent location
#drive = to goal




#Calculate power time left if continuously driving and using all/most necessary functions
#100% throttle (0.01/s)
#functions include internal and external ligts (0.0015/s)
#ac heating or cooling (0.005/s)
#co2 scrubber (0.001/s), and dust wiper 0.001/s)
#100% battery = 1 hr of full function, 90 mins w/o using throttle
def powerTimeLeft():

    minsLeft = roverState.data['battery_level'] * 0.6


#Calculate total power needed to get to goal location, complete task, and get back to base
#estimated time task in seconds
def powerForTrip(goalCoordinates, estimatedTimeTask=600):
    totalTime = roverState.getTotalTime(goalCoordinates, estimatedTimeTask)
    driveTime = totalTime - estimatedTimeTask
    driveConsumption = driveTime * 0.0275
    taskConsumption = estimatedTimeTask * 0.0175
    totalPowerAsPercentage = driveConsumption + taskConsumption
    return totalPowerAsPercentage

#Get power as percentage needed for one way drive
def powerForDrive(goalCoordinates):

    time = roverState.getOneWayTime(goalCoordinates)
    power = time * 0.0275
    return power



#if trip can be made without going below 20% battery return True
def enoughPower(goalCoordinates, estimatedTimeTask=600):
    batteryLow = 20
    batteryNeeded = powerForTrip(goalCoordinates, estimatedTimeTask)

    if (roverState.data['battery_level'] - batteryNeeded) <= batteryLow:
        return False
    else:
        return True

def powerErrors():

    battery = roverState.data['battery_level']

    if battery == 0:
        return "Out of Battery"
    elif battery <= 10:
        return "Battery Levels Critical"
    elif battery <= 30:
        return "Battery Levels Low"
    elif battery <= 60:
        return "Battery Levels Moderate"
    elif battery <= 99:
        return "Battery Levels High"
    else:
        return "Battery Levels Full"


