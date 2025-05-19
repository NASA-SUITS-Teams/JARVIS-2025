"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapIcon } from "lucide-react";
import { TSSData } from "@/types/tss";
import { PinElement } from "@/types/api";
import { useAPI } from "@/hooks/useAPI";
import { calculateRange } from "@/utils/resourceConsumption";

// coordinate ranges for the maps as provided
const coordinateRanges = {
  moon: { x: [-6550, -5450], y: [-10450, -9750] },
  rock: { x: [-5765, -5545], y: [-10075, -9940] },
};

const mapDimensions = {
  moon: { width: 3507, height: 2232 },
  rock: { width: 3507, height: 2220 },
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

function toPercent(value: number, [min, max]: readonly [number, number]) {
  return ((value - min) / (max - min)) * 100;
}

// Given an [x,y] and the active map, return { left, top } in percents
function percentPosition(pos: readonly [number, number], map: "moon" | "rock") {
  const ranges = coordinateRanges[map];
  const xPct = clamp(toPercent(pos[0], ranges.x), 0, 100);
  const yPct = clamp(toPercent(pos[1], ranges.y), 0, 100);
  return { left: xPct, top: 100 - yPct };
}

export default function Map({
  tssData,
  pinData,
  pathData,
  historicalData,
  visibleLayers,
  addPinClicked,
  setAddPinClicked,
}: {
  tssData: TSSData;
  pinData: PinElement[];
  pathData?: [number, number][];
  historicalData?: { tssData: TSSData }[];
  visibleLayers: {
    eva: boolean;
    pr: boolean;
    pin: boolean;
    poi: boolean;
    path: boolean;
    historicalPath: boolean;
    range: boolean;
  };
  addPinClicked: boolean;
  setAddPinClicked: (val: boolean) => void;
}) {
  const { sendPin } = useAPI();
  const [activeMap, setActiveMap] = useState<"moon" | "rock">("moon");
  const [xInput, setXInput] = useState<string>("");
  const [yInput, setYInput] = useState<string>("");

  // derive historical path from stored data
  const pathDataHistorical = historicalData
    ? historicalData
        .map((entry) => {
          const rover = entry.tssData.ROVER_TELEMETRY.pr_telemetry;
          return rover
            ? ([rover.current_pos_x, rover.current_pos_y] as [number, number])
            : null;
        })
        .filter((p): p is [number, number] => p !== null)
    : [];

  // live rover, ltv, & EVA positions
  const rover = tssData.ROVER_TELEMETRY.pr_telemetry;
  const roverPos = rover
    ? percentPosition([rover.current_pos_x, rover.current_pos_y], activeMap)
    : null;

  const ltv = tssData.ROVER.rover;
  const ltvPos = ltv ? percentPosition([ltv.posx, ltv.posy], activeMap) : null;

  const eva1 = tssData.IMU?.imu.eva1;
  const eva2 = tssData.IMU?.imu.eva2;
  const eva1Pos = eva1
    ? percentPosition([eva1.posx, eva1.posy], activeMap)
    : null;
  const eva2Pos = eva2
    ? percentPosition([eva2.posx, eva2.posy], activeMap)
    : null;

  // Click on map to add pin
  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!addPinClicked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    const x =
      xPct *
        (coordinateRanges[activeMap].x[1] - coordinateRanges[activeMap].x[0]) +
      coordinateRanges[activeMap].x[0];
    const y =
      (1 - yPct) *
        (coordinateRanges[activeMap].y[1] - coordinateRanges[activeMap].y[0]) +
      coordinateRanges[activeMap].y[0];

    await sendPin([x, y]);

    // add pin optimistically
    pinData.push({ position: [x, y], id: Date.now() });

    setAddPinClicked(false);
  };

  // Manual X/Y entry to add pin
  const handleManualAdd = async () => {
    const x = parseFloat(xInput);
    const y = parseFloat(yInput);
    if (isNaN(x) || isNaN(y)) return;

    await sendPin([x, y]);

    setXInput("");
    setYInput("");

    // Add pin optimistically
    pinData.push({ position: [x, y], id: Date.now() });

    setAddPinClicked(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-blue-600">
        <div className="flex items-center space-x-2 drag-handle hover:cursor-move">
          <MapIcon size={18} className="text-blue-400" />
          <span className="font-bold">MAP</span>
          <span className="text-xs text-gray-400">
            {rover
              ? ` (X:${rover.current_pos_x.toFixed(
                  1
                )} Y:${rover.current_pos_y.toFixed(1)})`
              : ""}
          </span>
        </div>

        {/* Toggle or Manual Input */}
        <div className="flex space-x-2">
          {addPinClicked ? (
            <>
              <input
                type="text"
                placeholder="X coord"
                value={xInput}
                onChange={(e) => setXInput(e.target.value)}
                className="w-20 px-2 py-1 text-xs rounded bg-gray-600 text-white"
              />
              <input
                type="text"
                placeholder="Y coord"
                value={yInput}
                onChange={(e) => setYInput(e.target.value)}
                className="w-20 px-2 py-1 text-xs rounded bg-gray-600 text-white"
              />
              <button
                onClick={handleManualAdd}
                className="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-500"
              >
                Add Pin
              </button>
            </>
          ) : (
            (["moon", "rock"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMap(mode)}
                className={`px-2 py-1 rounded text-xs ${
                  activeMap === mode
                    ? "bg-blue-600"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                {mode === "moon" ? "MOON" : "ROCK YARD"}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Map & Overlays */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`relative h-full w-full overflow-hidden ${
            addPinClicked ? "cursor-crosshair" : "cursor-default"
          }`}
          onClick={handleMapClick}
        >
          <Image
            src={`/maps/${activeMap}.tiff`}
            alt={activeMap === "moon" ? "Moon surface" : "Rock yard"}
            width={mapDimensions[activeMap].width}
            height={mapDimensions[activeMap].height}
          />

          {/* Current Path */}
          {pathData && visibleLayers.path && (
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
              viewBox={`0 0 ${mapDimensions[activeMap].width} ${mapDimensions[activeMap].height}`}
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#FF0000"
                strokeWidth={6}
                points={pathData
                  .map(([x, y]) => {
                    const { left, top } = percentPosition([x, y], activeMap);
                    return `${(left / 100) * mapDimensions[activeMap].width},${
                      (top / 100) * mapDimensions[activeMap].height
                    }`;
                  })
                  .join(" ")}
              />
            </svg>
          )}

          {/* Historical Path */}
          {pathDataHistorical.length > 1 && visibleLayers.historicalPath && (
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
              viewBox={`0 0 ${mapDimensions[activeMap].width} ${mapDimensions[activeMap].height}`}
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#42A5F5"
                strokeWidth={6}
                points={pathDataHistorical
                  .map(([x, y]) => {
                    const { left, top } = percentPosition([x, y], activeMap);
                    return `${(left / 100) * mapDimensions[activeMap].width},${
                      (top / 100) * mapDimensions[activeMap].height
                    }`;
                  })
                  .join(" ")}
              />
            </svg>
          )}

          {/* Range Indicator Circle */}
          {calculateRange(historicalData, tssData) > 0 &&
            visibleLayers.range && (
              <div
                className="absolute rounded-full border-2 border-green-500 bg-green-500/30 pointer-events-none z-10 overflow-hidden"
                style={{
                  left: `${roverPos?.left || 0}%`,
                  top: `${roverPos?.top || 0}%`,
                  width: `${
                    (calculateRange(historicalData, tssData) /
                      (coordinateRanges[activeMap].x[1] -
                        coordinateRanges[activeMap].x[0])) *
                    100
                  }%`,
                  height: `${
                    (calculateRange(historicalData, tssData) /
                      (coordinateRanges[activeMap].y[1] -
                        coordinateRanges[activeMap].y[0])) *
                    100
                  }%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

          {/* Rover Icon */}
          {roverPos?.left != 100 && visibleLayers.pr && (
            <div
              className="absolute z-20"
              style={{
                left: `${roverPos.left}%`,
                top: `${roverPos.top}%`,
                transform: `translate(-50%, -50%) rotate(${
                  (tssData.ROVER_TELEMETRY.pr_telemetry.heading + 180) % 360 ||
                  0
                }deg)`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <polygon
                  points="12,2 4,20 12,15 20,20"
                  fill="#9333ea"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            </div>
          )}

          {/* LTV Icon */}
          {ltvPos?.left != 100 && visibleLayers.ltv && (
            <div
              className="absolute w-4 h-4 bg-teal-500 rounded-full border-2 border-white z-20"
              style={{
                left: `${ltvPos.left}%`,
                top: `${ltvPos.top}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}

          {/* EVA #1 Icon */}
          {eva1Pos?.left != 100 && visibleLayers.eva && tssData.EVA.eva.started && (
            <div
              className="absolute z-20"
              style={{
                left: `${eva1Pos.left}%`,
                top: `${eva1Pos.top}%`,
                transform: `translate(-50%, -50%) rotate(${
                  tssData.IMU.imu.eva1.heading || 0
                }deg)`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <polygon
                  points="12,2 4,20 12,15 20,20"
                  fill="#ec4899"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            </div>
          )}

          {/* EVA #2 Icon */}
          {eva2Pos?.left != 100 && visibleLayers.eva && tssData.EVA.eva.started && (
            <div
              className="absolute z-20"
              style={{
                left: `${eva2Pos.left}%`,
                top: `${eva2Pos.top}%`,
                transform: `translate(-50%, -50%) rotate(${
                  tssData.IMU.imu.eva2.heading || 0
                }deg)`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <polygon
                  points="12,2 4,20 12,15 20,20"
                  fill="#ec4899"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            </div>
          )}

          {/* POIs */}
          {rover &&
            visibleLayers.poi &&
            [
              [rover.poi_1_x, rover.poi_1_y],
              [rover.poi_2_x, rover.poi_2_y],
              [rover.poi_3_x, rover.poi_3_y],
            ]
              .filter(([x, y]) => x && y)
              .map(([x, y], i) => {
                const pos = percentPosition([x, y], activeMap);
                return (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-400 rounded-full border-2 border-white z-20"
                    style={{
                      left: `${pos.left}%`,
                      top: `${pos.top}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                );
              })}

          {/* Pins */}
          {pinData.map((pin, idx) => {
            const pos = percentPosition(pin.position, activeMap);
            return visibleLayers.pin ? (
              <div
                key={idx}
                className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white z-20"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
