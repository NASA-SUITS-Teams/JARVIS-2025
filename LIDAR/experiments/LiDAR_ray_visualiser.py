import numpy as np
import plotly.graph_objects as go

#sensor data: x,y,z,yaw,pitch
sensors = {
    0:  (170, -150, 15, 30, 0), 
    1:  (200, -40, 20, 20, 0),
    2:  (200, 0, 20, 0, 0),
    3:  (200, 40, 20, -20, 0),
    4:  (170, 150, 15, -30, 0),
    5:  (200, -40, 20, 0, -25),
    6:  (200, 40, 20, 0, -25),
    7:  (0, -100, 0, 90, -20),
    8:  (0, 100, 0, -90, -20),
    9:  (-135, -160, 15, -40, 0),
    10: (-180, -60, 15, 180, 0),
    11: (-180, 60, 15, 180, 0),
    12: (-135, 160, 15, 40, 0),
}

def deg_to_rad(degrees):
    return np.radians(degrees)

fig = go.Figure()

x_vals = [s[0] for s in sensors.values()]
y_vals = [s[1] for s in sensors.values()]
z_vals = [s[2] for s in sensors.values()]
axis_range = [min(x_vals + y_vals + z_vals) - 150, max(x_vals + y_vals + z_vals) + 150]

for key, (x, y, z, yaw, pitch) in sensors.items():
    fig.add_trace(go.Scatter3d(
        x=[x], y=[y], z=[z],
        mode='markers+text',
        marker=dict(size=5, color='blue'),
        text=[str(key)],
        textposition="top center"
    ))

    #to represrent in 3d converting yaw and pitch to radians and then computing vectors
    yaw_rad = deg_to_rad(yaw)
    pitch_rad = deg_to_rad(pitch)
    vx = np.cos(yaw_rad) * np.cos(pitch_rad) * 20
    vy = np.sin(yaw_rad) * np.cos(pitch_rad) * 20
    vz = np.sin(pitch_rad) * 20

    fig.add_trace(go.Cone(
        x=[x], y=[y], z=[z],
        u=[vx], v=[vy], w=[vz],
        colorscale='Reds',
        sizemode="absolute",
        sizeref=15
    ))

    fig.add_trace(go.Scatter3d(
        x=[x, x + vx * 10], # modify this value to change the length of rays
        y=[y, y + vy * 10],
        z=[z, z + vz * 10],
        mode='lines',
        line=dict(color='red', width=6)
    ))

#frame for the rover
connections = [
    (0, 1), (1, 2), (2, 3), (3, 4),
    (0, 9), (4, 12),
    (9, 10), (10, 11), (11, 12),
]

for i, j in connections:
    fig.add_trace(go.Scatter3d(
        x=[sensors[i][0], sensors[j][0]],
        y=[sensors[i][1], sensors[j][1]],
        z=[sensors[i][2], sensors[j][2]],
        mode='lines',
        line=dict(color='black', width=2)
    ))

fig.update_layout(
    scene=dict(
        xaxis=dict(title="X Axis", range=axis_range),
        yaxis=dict(title="Y Axis", range=axis_range),
        zaxis=dict(title="Z Axis", range=axis_range),
        aspectmode='cube'  
    ),
)

fig.show()