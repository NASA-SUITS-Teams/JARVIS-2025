import numpy as np
import math
from lidar_utils import process_lidar_readings

def test_lidar_utils():
    """
    This function uses synthetic data to test whether `process_lidar_readings`
    and your rotation logic are correct.
    """
    # Example: 13 LIDAR readings in centimeters
    # We'll pick easy numbers so we can predict the result.
    # Suppose sensors 0..2 each read 100 cm, the rest read -1 (no hit).
    test_readings = [100, 100, 100, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]

    # Rover position at the origin (0,0,0) in meters:
    rover_position = np.array([0.0, 0.0, 0.0])

    # Rover orientation: no roll/pitch/yaw
    # If your code is truly using radians, and your “zero angle”
    # logic is correct, the points should line up in front, exactly
    # offset by the sensor positions/orientations.
    rover_angles = (0.0, 0.0, 0.0)

    # Call your function
    points = process_lidar_readings(
        lidar_readings=test_readings,
        rover_position=rover_position,
        rover_angles=rover_angles
    )
    
    print("=== Test 1: rover at origin, angles = 0,0,0 ===")
    for i, p in enumerate(points):
        print(f"Sensor {i}: {p}")

    # Now do a second test: rotate the rover by +90° about Z (yaw = +π/2),
    # and see if the LIDAR points rotate accordingly.
    rover_angles_90deg = (0.0, 0.0, math.pi/2)
    points_90 = process_lidar_readings(
        lidar_readings=test_readings,
        rover_position=rover_position,
        rover_angles=rover_angles_90deg
    )

    print("\n=== Test 2: rover at origin, yaw = +90 deg ===")
    for i, p in enumerate(points_90):
        print(f"Sensor {i}: {p}")

if __name__ == "__main__":
    test_lidar_utils()
