import { LunarLinkData } from "./lunarlink";
import { TSSData } from "./tss";

export type APIResponseData = {
  tssData: TSSData;
  lunarlinkData: LunarLinkData; // main source for partner teams data, we will use the TSS data as a backu
  pinData: PinElement[];
}

export type Alert = {
  name: string;
  description: string;
  time: string;
  type: string;
}

export type PinElement = {
  name: string;
  position: [number, number];
  timestamp: string;
}