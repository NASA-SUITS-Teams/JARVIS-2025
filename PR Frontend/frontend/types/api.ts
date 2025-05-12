export interface APIResponseData {
  tssData;
  mapData: MapElement[];
  alertData: Alert[];
  tpqData: TPQItem[];
  //evaData: EVAData;
  //roverData: RoverData;
  //scanData: ScanData;
}

export interface Alert {
  name: string;
  description: string;
  time: string;
}


export interface MapElement {
  name: string;
  type: MapElementType;
  status: string;
  position: [number, number];
}

enum MapElementType {
  poi,
  eva,
  pr,
}

enum MapToggle {
  "EVAs",
  "Pressurized Rover",
  "Points of Interest",
}

enum GridMode {
  "Grid",
}

export interface TPQItem {
  name: string;
  priority: number;
  timestamp: string;
}

interface LLMResponse {

}

interface LLMRequest {
}

interface EVAData {
  eva1: {
    position: [number, number];
    status: string;
  };
  eva2: {
    position: [number, number];
    status: string;
  };
}

interface RoverData {
  position: [number, number];
  heading: number;
  speed: number;
}

interface ScanData {
  scans: ScanItem[];
}

interface ScanItem {
  title: string;
  size: string;
  color: string;
  texture: string;
  status: string;
}