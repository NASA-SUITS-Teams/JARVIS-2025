from enum import Enum
import json
import tkinter as tk

class state(Enum):
    "Low Battery" == 1
    "In Use" == 2
    "Charging" == 3

class roverState:

    def __init__(self, TSSdata):
        self.data = TSSdata["rover"]


    def updateRoverState(self, newData):
        self.data = newData["rover"]


#UI, not needed
def draw_rounded_rectangle(canvas, x1, y1, x2, y2, radius, **kwargs):
    canvas.create_arc(x1, y1, x1 + 2*radius, y1 + 2*radius, start=90, extent=90, outline="", fill=kwargs.get('fill', 'lightblue'))
    canvas.create_arc(x2 - 2*radius, y1, x2, y1 + 2*radius, start=0, extent=90, outline="", fill=kwargs.get('fill', 'lightblue'))
    canvas.create_arc(x1, y2 - 2*radius, x1 + 2*radius, y2, start=180, extent=90, outline="", fill=kwargs.get('fill', 'lightblue'))
    canvas.create_arc(x2 - 2*radius, y2 - 2*radius, x2, y2, start=270, extent=90, outline="", fill=kwargs.get('fill', 'lightblue'))
    canvas.create_rectangle(x1 + radius, y1, x2 - radius, y2, outline="", fill=kwargs.get('fill', 'lightblue'))
    canvas.create_rectangle(x1, y1 + radius, x1 + radius, y2 - radius, outline="", fill=kwargs.get('fill', 'lightblue'))
    canvas.create_rectangle(x2 - radius, y1 + radius, x2, y2 - radius, outline="", fill=kwargs.get('fill', 'lightblue'))

#UI, not needed
def displayRover(batteryLevel, oxygenTank):
    root = tk.Tk(screenName="Rover Resources", className="Rover Resources", useTk=1)
    text = tk.Label(root, text="Rover Resources")
    text.pack()
    canvas = tk.Canvas(root, width=400, height=400)
    canvas.pack()
    draw_rounded_rectangle(canvas, 50, 50, 350, 350, radius=20, fill="skyblue")
    draw_rounded_rectangle(canvas, 60, 60, 340, 120, radius=15, fill="blue")
    label = tk.Label(root, text="Resource Consumption", bg="blue", fg="white", font=("Arial", 17, "bold"))
    label.place(x=200, y=110, anchor="center")

    canvas.create_rectangle(60, 155, 340, 175, fill="lightgrey", outline="lightgrey")
    batteryBar = canvas.create_rectangle(60, 155, batteryLevel / 100 * 280 + 60, 175, fill="green2", outline="green2")
    if batteryLevel <= 20:
        canvas.itemconfig(batteryBar, fill="red", outline="red")  
    elif batteryLevel <= 50: 
        canvas.itemconfig(batteryBar, fill="yellow", outline="yellow")
    batteryLabel = tk.Label(root, text=f"Battery Level: {batteryLevel}%", bg="skyblue", fg="black", font=("Arial", 12))
    batteryLabel.place(x=60, y=150)


    canvas.create_rectangle(60, 205, 340, 225, fill="lightgrey", outline="lightgrey")
    oxygenBar = canvas.create_rectangle(60, 205, oxygenTank / 100 * 280 + 60, 225, fill="green2", outline="green2")
    if oxygenTank <= 20:
        canvas.itemconfig(oxygenBar, fill="red", outline="red")  
    elif oxygenTank <= 50: 
        canvas.itemconfig(oxygenBar, fill="yellow", outline="yellow")
    oxygenLabel = tk.Label(root, text=f"Oxygen Tank: {oxygenTank}%", bg="skyblue", fg="black", font=("Arial", 12))
    oxygenLabel.place(x=60, y=200)

    #updateValues(batteryLabel)
    root.mainloop()

def MotorConsumptionBySpeed():
    #graph motor consumption and total power consumption by speed
    #graph power consumption by time
    #account for different factors (lights, fan, ect.)
    return

#not updating, not needed
def updateValues(batteryLabel):
    #newBatteryLevel = getRoverBatteryLevel(getTSSdata())
    batteryLabel.config(text=f"Battery Level: {newBatteryLevel}%")
    batteryLabel.after(5000, updateValues, batteryLabel)
    

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
    #batteryLevel = getRoverBatteryLevel(data)
    displayRover(20, 20)
    return

main()