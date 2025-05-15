import time
from typing import Any, Dict, List, Tuple

THRESHOLDS: Dict[str, Tuple[float, float]] = {
    "pitch":                 (0.0,    50.0),
    "roll":                  (0.0,    50.0),
    "speed":                 (0.0,    18.0),
    "surface_incline":       (0.0,    50.0),
    "oxygen_tank":           (25.0,   100.0),
    "oxygen_pressure":       (2997.0, 3000.0),
    "oxygen_levels":         (20.0,   21.0),
    "ac_fan_pri":            (29999.0,30005.0),
    "ac_fan_sec":            (29999.0,30005.0),
    "cabin_pressure":        (3.5,    4.10),
    "cabin_temperature":     (50.0,   90.0),
    "battery_level":         (30.0,   100.0),
    "solar_panel_efficiency":(40.0,   100.0),
    "pr_coolant_level":      (40.0,   45.0),
    "pr_coolant_pressure":   (495.0,  501.0),
    "pr_coolant_tank":       (60.0,   100.0),
    "solar_panel_dust_accum":(0.0,    25.0),
    "distance_from_base":    (0.0,    2500.0),
}

alert_start_times: Dict[str, float] = {}

def get_alerts(telemetry: Dict[str, Any]) -> List[Dict[str, str]]:
    alerts: List[Dict[str, str]] = []

    for key, (min_v, max_v) in THRESHOLDS.items():
        if key not in telemetry:
            continue

        try:
            val = float(telemetry[key])
        except (TypeError, ValueError):
            continue

        if key not in alert_start_times:
            alert_start_times[key] = time.time()

        if val < min_v or val > max_v:
            percentage_out = (
                ((min_v - val) / min_v * 100) if val < min_v else
                ((val - max_v) / max_v * 100)
            )

            # Check if current value is 0, then ignore the alert and don't add it, this usually means something is not connected correctly
            if val == 0:
                alert_start_times.pop(key, None)
                continue

            elapsed_time = time.time() - alert_start_times[key]
            alerts.append({
                "name":   f"{key.upper().replace('_', ' ')} Out Of Range",
                "description": (
                    f"Current: {val:.2f} "
                    f"{'- below' if val < min_v else 'above'} by {abs(percentage_out):.2f}% "
                ),
                "time": f"{elapsed_time:.0f} seconds",
            })
        else:
            alert_start_times.pop(key, None)
            continue

    return alerts
