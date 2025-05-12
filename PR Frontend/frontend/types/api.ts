import { EVAData } from "./eva";
import { RoverData } from "./rover";

export interface APIResponseData {
  //roverData: RoverData;
  tssData
  mapData: MapData;
  alertData: AlertData;
  //evaData: EVAData;
  tpqData: TPQData;
  //scanData: ScanData;
}

export interface AlertData {
  alerts: Alert[];
}

interface Alert {
  title: string;
  description: string;
  time: string;
}

interface MapData {
  gridMode: GridMode;
  mapToggles: MapToggle[];
  mapElements: MapElement[];
}

interface MapElement {
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

interface TPQData {
  tasks: TPQItem[];
}

interface TPQItem {
  name: string;
  priority: number;
  timestamp: string;
}

export interface LLMResponse {

}

export interface LLMRequest {
}
