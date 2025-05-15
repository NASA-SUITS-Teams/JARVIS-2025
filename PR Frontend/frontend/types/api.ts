import { LunarLinkData } from "./lunarlink";
import { TSSData } from "./tss";

export type APIResponseData = {
  tssData: TSSData;
  lunarlinkData: LunarLinkData; // main source for partner teams data, we will use the TSS data as a backu
  mapData: MapElement[];
}

export type Alert = {
  name: string;
  description: string;
  time: string;
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