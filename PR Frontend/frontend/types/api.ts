export type APIResponseData {
  tssData;
  mapData: MapElement[];
  alertData: Alert[];
  tpqData: TPQItem[];
  //evaData: EVAData;
  //roverData: RoverData;
  //scanData: ScanData;
}

export type Alert {
  name: string;
  description: string;
  time: string;
}


export type MapElement {
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

export type TPQItem {
  name: string;
  priority: number;
  timestamp: string;
}

type LLMResponse {

}

type LLMRequest {
}

type EVAData {
  eva1: {
    position: [number, number];
    status: string;
  };
  eva2: {
    position: [number, number];
    status: string;
  };
}

type RoverData {
  position: [number, number];
  heading: number;
  speed: number;
}

type ScanData {
  scans: ScanItem[];
}

type ScanItem {
  title: string;
  size: string;
  color: string;
  texture: string;
  status: string;
}