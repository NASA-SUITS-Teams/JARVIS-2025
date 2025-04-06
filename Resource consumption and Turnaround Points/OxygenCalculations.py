import datetime 
import matplotlib.pyplot as plt
import numpy as np
from scipy.optimize import curve_fit


#oxygen mass of tank in grams
oxygenMass = [1300, 1250, 1225, 1175, 1150, 1130, 1100, 1075, 1060, 1020, 1000]
timestamps = []
A = 0
B = 0




def calculateOxygenMassLeft(oxygenTankPressure, maxOxygen, tankVolume, temperature):

    temp = getCabinTemp() + 273.15

    R = 0.0821
    totalOxygen = getOxygenLevel() / 100 * maxOxygen
    moles = oxygenTankPressure * tankVolume / (R * temp)
    mass = moles * 32
    #mass in grams
    timestamp = datetime.datetime.now().time()
    timestamps.append(timestamp)
    oxygenMass.append(mass)
    return mass


def calculateRoverOxygenMass(maxOxygen, roverVolume):

    temp = getCabinTemp() + 273.15

    R = 0.0821
    totalOxygen = getOxygenLevel() / 100 * maxOxygen
    moles = getOxygenPressure() * roverVolume / (R * temp)
    mass = moles * 32
    #mass in grams
    return mass

def oxygenConsumptionRate(mass1, mass2):
    #calculate every second
    #consumption rate in grams/second
    consumptionRate = mass1 - mass2
    return consumptionRate

def plotOxygenConsumptionRate():

    totalSec = (timestamps[len(timestamps) - 1] - timestamps[0]).total_seconds()
    if  totalSec < 60:
        time_elapsed = np.array([(t - timestamps[0]).total_seconds() for t in timestamps])  # Convert to hours
        plt.xlabel("Time (sec)")

    elif totalSec < 3600:
        time_elapsed = np.array([(t - timestamps[0]).total_seconds() / 60 for t in timestamps])  # Convert to hours
        plt.xlabel("Time (min)")
    else:
        time_elapsed = np.array([(t - timestamps[0]).total_seconds() / 3600 for t in timestamps])  # Convert to hours
        plt.xlabel("Time (hour)")
    

    plt.scatter(time_elapsed, oxygenMass)
    
    plt.ylabel("Oxygen Mass (g)")
    
    plt.title("Oxygen Consumption Over Time")

    #consumptionRate = np.diff(oxygenMass) / np.diff(timestamps)

    params, _ = curve_fit(exp_decay, time_elapsed, oxygenMass)
    A, B = params
    futureTime = np.linspace(0, max(time_elapsed) * 2, 100)
    predictedOxygen = exp_decay(futureTime, A, B)
    print(predictedOxygen, type(predictedOxygen))

    plt.plot(futureTime, predictedOxygen, label="Exponential Fit", color="red", linestyle="--")
    plt.show()


def exp_decay(t, A, B):
    return A * np.exp(-B * t)

def oxygenTimeLeft(maxOxygen, currentMass = A, decayConstant = B):
    
    target = maxOxygen * 0.05
    #time in seconds
    timeLeft = -np.log(target / currentMass)/decayConstant
    return timeLeft


def oxygenPressure():
    p = getOxygenPressure()

    if p <= 1:
        #fatal oxygen deprivation
        return "Fatal Oxygen Deprivation"
    elif p <= 1.5:
        #Critical oxygen deprivation
        return "Critical Oxygen Deprivation"
    elif p <= 1.8:
        #severe hypoxia
        return "Severe Hypoxia"
    elif p <= 2.3:
        #hypoxia
        return "Hypoxia"
    elif p <= 3:
        #mild hypoxia possible
        return "Mild Hypoxia Possible"
    elif p <= 3.3:
        #perfect conditions
        return "Nominal"
    elif p <= 4:
        #mild oxygen toxicity possible
        return "Mild Oxygen Toxicity Possible"
    elif p <=5:
        #oxygen toxicity
        return "Oxygen Toxicity"
    elif p <= 7:
        #severe oxygen toxicity
        return "Severe Oxygen Toxicity"
    else:
        #lethal oxygen toxicity
        return "Lethal Oxygen Toxicity"

def pressure():

    p = getPressure()
    if p <= 12:
        #risk of hypoxia
        return "Risk of Hypoxia"
    elif p < 14.7:
        #acceptable but should be higher
        return "Acceptable"
    elif p < 15:
        #ideal range
        return "Nominal"
    else:
        #risk of oxygen toxicity
        return "Risk of Oxygen Toxicity"

def oxygenLevels():

    l = getOxygenLevel()
    if l == 0:
        return "No Remaining Oxygen"
    elif l <= 10:
        return "Oxygen Levels Critical"
    elif l <= 30:
        return "Oxygen Levels Low"
    elif l <= 60:
        return "Oxygen Levels Moderate"
    elif l <= 99:
        return "Oxygen Levels High"
    else:
        return "Oxygen Levels Full"
     
def enoughTime():
    #calculated in seconds with 20 minutes buffer time
    #can change buffertime so its at a constant ration to mission time
    if getMissionPlannedTime() <= (timeLeft + 1200):
        return False
    else:
        return True


for i in range(len(oxygenMass)):
    timestamps.append(datetime.datetime(2025, 4, 2, 4, 0, i))

plotOxygenConsumptionRate()