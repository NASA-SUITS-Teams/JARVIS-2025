export type TSSData = {
  DCU: {
    dcu: {
      eva1: DCUStates;
      eva2: DCUStates;
    };
  };
  ERROR: {
    error: ErrorData;
  };
  IMU: {
    imu: IMUData;
  };
  SPEC: {
    spec: SpecData;
  };
  ROVER: {
    rover: RoverData;
  };
  ROVER_TELEMETRY: {
    pr_telemetry: PRTelemetry;
  };
  UIA: {
    uia: UIAData;
  };
  TELEMETRY: {
    // this stands for EVA telemetry
    telemetry: {
      eva_time: number;
      eva1: EVATelemetry;
      eva2: EVATelemetry;
    };
  };
  EVA: {
    eva: EVAData;
  };
};

// Position data from the IMU about the EVAs
type IMUData = {
  eva1: IMUEntry;
  eva2: IMUEntry;
}

type IMUEntry = {
  posx: number;
  posy: number;
  heading: number;
}

// Rock composition data from spectrometer sample
type RockComposition = {
  SiO2: number;
  TiO2: number;
  Al2O3: number;
  FeO: number;
  MnO: number;
  MgO: number;
  CaO: number;
  K2O: number;
  P2O3: number;
  other: number;
};

export type SpecData = {
      eva1: SpecEntry;
      eva2: SpecEntry;
};

// Data from the spectrometer
export type SpecEntry = {
  name: string;
  id: number;
  data: RockComposition;
};

// All errors (I believe these are all for the EVA so not something for us to worry about)
type ErrorData = {
  fan_error: boolean;
  oxy_error: boolean;
  pump_error: boolean;
};

// Rover position data
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
};

// Rover telemetry data
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
};

// EVA telemtry data, this should be used as a backup for the lunarlink data
export type EVATelemetry = {
  batt_time_left: number;
  oxy_pri_storage: number;
  oxy_sec_storage: number;
  oxy_pri_pressure: number;
  oxy_sec_pressure: number;
  oxy_time_left: number;
  heart_rate: number;
  oxy_consumption: number;
  co2_production: number;
  suit_pressure_oxy: number;
  suit_pressure_co2: number;
  suit_pressure_other: number;
  suit_pressure_total: number;
  fan_pri_rpm: number;
  fan_sec_rpm: number;
  helmet_pressure_co2: number;
  scrubber_a_co2_storage: number;
  scrubber_b_co2_storage: number;
  temperature: number;
  coolant_ml: number;
  coolant_gas_pressure: number;
  coolant_liquid_pressure: number;
};

// EVA task state data
export interface TaskState {
  started: boolean;
  completed: boolean;
  time: number;
}

export interface EVAData {
  started: boolean;
  paused: boolean;
  completed: boolean;
  total_time: number;
  uia: TaskState;
  dcu: TaskState;
  rover: TaskState;
  spec: TaskState;
}

export interface UIAStates {
  eva1_power: boolean;
  eva1_oxy: boolean;
  eva1_water_supply: boolean;
  eva1_water_waste: boolean;
  eva2_power: boolean;
  eva2_oxy: boolean;
  eva2_water_supply: boolean;
  eva2_water_waste: boolean;
  oxy_vent: boolean;
  depress: boolean;
}

export interface DCUStates {
  batt: boolean;
  oxy: boolean;
  comm: boolean;
  fan: boolean;
  pump: boolean;
  co2: boolean;
}