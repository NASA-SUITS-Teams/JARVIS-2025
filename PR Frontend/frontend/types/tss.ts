export type TSSData = {
    ERROR: {
        error: ErrorData;
    }
    ROVER: {
        rover: RoverData;
    }
    ROVER_TELEMETRY: {
        pr_telemetry: PRTelemetry;
    }
    //SPEC: this is the data for the spectrometer, we should only fetch it here as a backup in case we can't communicate with the EVAs directly
    //EVA
}

type ErrorData = {
  fan_error: boolean;
  oxy_error: boolean;
  pump_error: boolean;
}

export type RoverData = {
  posx: number;
  posy: number;
  poi_1_x: number;
  poi_1_y: number;
  poi_2_x: number;
  poi_2_y: number;
  poi_3_x: number;
  poi_3_y: number;
  ping: boolean;
}

export type PRTelemetry = {
  ac_heating: boolean;
  ac_cooling: boolean;
  co2_scrubber: boolean;
  lights_on: boolean;
  internal_lights_on: boolean;
  brakes: boolean;
  in_sunlight: boolean;
  throttle: number;
  steering: number;
  current_pos_x: number;
  current_pos_y: number;
  current_pos_alt: number;
  heading: number;
  pitch: number;
  roll: number;
  distance_traveled: number;
  speed: number;
  surface_incline: number;
  oxygen_tank: number;
  oxygen_pressure: number;
  oxygen_levels: number;
  fan_pri: boolean;
  ac_fan_pri: number;
  ac_fan_sec: number;
  cabin_pressure: number;
  cabin_temperature: number;
  battery_level: number;
  power_consumption_rate: number;
  solar_panel_efficiency: number;
  external_temp: number;
  pr_coolant_level: number;
  pr_coolant_pressure: number;
  pr_coolant_tank: number;
  radiator: number;
  motor_power_consumption: number;
  terrain_condition: number;
  solar_panel_dust_accum: number;
  mission_elapsed_time: number;
  mission_planned_time: number;
  point_of_no_return: number;
  distance_from_base: number;
  switch_dest: boolean;
  dest_x: number;
  dest_y: number;
  dest_z: number;
  dust_wiper: boolean;
  sim_running: boolean;
  sim_paused: boolean;
  sim_completed: boolean;
  latitude: number;
  longitude: number;
  lidar: number[];
}