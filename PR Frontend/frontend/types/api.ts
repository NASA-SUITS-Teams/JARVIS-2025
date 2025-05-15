import { LunarLinkData } from "./lunarlink";
import { TSSData } from "./tss";

export type APIResponseData = {
  tssData: TSSData;
  lunarlinkData: LunarLinkData; // main source for partner teams data, we will use the TSS data as a backu
  mapData: MapElement[];
  alertData: Alert[];
  tpqData: TPQItem[];
}

export type Alert = {
  name: string;
  description: string;
  time: string;
  type: 'rover' | 'eva';
}

export type MapElement = {
  name: string;
  type: MapElementType;
  status: string;
  position: [number, number];
}

enum MapElementType {
  poi,
  pin,
  eva,
  pr,
}

export type TPQItem = {
  name: string;
  priority: number;
  timestamp: string;
}