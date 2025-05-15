export type LunarLinkData = {
  closest_epoch: number;
  data: {
    [key: string]: number;
  };
  pins: Array<{
    x: number;
    y: number;
    timestamp: string;
  }>;
  waited_seconds: number;
};