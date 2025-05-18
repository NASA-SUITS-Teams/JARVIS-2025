"use client";

import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import Header from "@/components/Header";
import Map from "@/components/widgets/Map";
import ScanData from "@/components/widgets/ScanData";
import MapToggles from "@/components/widgets/MapToggles";
import SystemControl from "@/components/widgets/SystemControl";
import LLMWidget from "@/components/widgets/LLM";
import Alerts from "@/components/widgets/Alerts";
import { useAPI } from "@/hooks/useAPI";
import { APIResponseData } from "@/types/api";
import RoverControls from "@/components/widgets/RoverControls";
import ResourceConsumption from "@/components/widgets/ResourceConsumption";
import Procedures from "@/components/widgets/Procedures";
import Timer from "@/components/widgets/Timer";

const ResponsiveGridLayout = WidthProvider(Responsive);

const roverLayout: Layout[] = [
  { i: "map", x: 0, y: 0, w: 3, h: 3 },
  { i: "alerts", x: 3, y: 0, w: 2, h: 3 },
  { i: "scanData", x: 4, y: 4, w: 1, h: 3 },
  { i: "procedures", x: 3, y: 3, w: 2, h: 2 },
  { i: "mapToggles", x: 2, y: 3, w: 1, h: 2 },
  { i: "llm", x: 0, y: 3, w: 2, h: 4 },
  { i: "resourceConsumption", x: 2, y: 4, w: 2, h: 2 },
  { i: "roverControls", x: 0, y: 4, w: 2, h: 2 },
  { i: "timer", x: 2, y: 5, w: 2, h: 2 },
];

const evaLayout: Layout[] = [
  { i: "map", x: 0, y: 0, w: 3, h: 3 },
  { i: "alerts", x: 3, y: 0, w: 1, h: 3 },
  { i: "scanData", x: 4, y: 0, w: 1, h: 3 },
  { i: "timer", x: 3, y: 3, w: 2, h: 2 },
  { i: "mapToggles", x: 2, y: 3, w: 1, h: 2 },
  { i: "llm", x: 0, y: 4, w: 2, h: 2 },
  { i: "procedures", x: 2, y: 5, w: 2, h: 2 },
  { i: "resourceConsumption", x: 0, y: 4, w: 2, h: 2 },
  { i: "roverControls", x: 2, y: 4, w: 2, h: 2 },
];

export default function Home() {
  const { data, error, historicalData, loading, setPollServerData } = useAPI();

  const backendData: APIResponseData = data;
  const tssData = backendData.tssData;
  const pinData = backendData.pinData;
  const pathData = backendData.pathData
  const specData = tssData.SPEC?.spec;

  // Draggable layout state
  const [layout, setLayout] = useState<Layout[]>(roverLayout);

  // Map global states
  const [visibleLayers, setVisibleLayers] = useState({
    eva: true,
    pr: true,
    poi: true,
    pin: true,
    path: true,
    historicalPath: true
  });

  // Adding a new point to the map
  const [addPinClicked, setAddPinClicked] = useState(false);

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const changeLayout = (type: "rover" | "eva") => {
    if (type === "rover") {
      setLayout(roverLayout);
    } else {
      setLayout(evaLayout);
    }
  };

  // Start polling the server for data
  useEffect(() => {
    setPollServerData(true);
  }, [setPollServerData]);

  // only show the loading screen if we are loading and there is no data (first load)
  if (!specData && loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-blue-100 font-mono">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-blue-100 font-mono">
      <Header
        elapsedTime={tssData.ROVER_TELEMETRY.pr_telemetry.mission_elapsed_time}
        error={error}
      />
      <div className="flex flex-1 overflow-auto">
        <div className="flex-1 p-2">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 5 }}
            rowHeight={135}
            isDraggable
            isResizable
            compactType="vertical"
            draggableHandle=".drag-handle"
            resizeHandles={["se"]}
            onLayoutChange={(currentLayout) => setLayout(currentLayout)}
          >
            <div key="map">
              <Map
                visibleLayers={visibleLayers}
                pinData={pinData}
                tssData={tssData}
                pathData={pathData}
                setAddPinClicked={setAddPinClicked}
                historicalData={historicalData}
                addPinClicked={addPinClicked}
              />
            </div>
            <div key="alerts">
              <Alerts tssData={tssData} />
            </div>
            <div key="scanData">
              <ScanData specData={specData} />
            </div>
            <div key="roverControls">
              <RoverControls tssData={tssData} />
            </div>
            <div key="mapToggles">
              <MapToggles
                visibleLayers={visibleLayers}
                toggleLayer={toggleLayer}
              />
            </div>
            <div key="llm">
              <LLMWidget />
            </div>
            <div key="procedures">
              <Procedures />
            </div>
            <div key="resourceConsumption">
              <ResourceConsumption
                currentData={tssData}
                historicalData={historicalData}
              />
            </div>
            <div key="timer">
              <Timer tssData={tssData} />
            </div>
          </ResponsiveGridLayout>
        </div>
        <SystemControl
          changeLayout={changeLayout}
          dataError={error}
          tssData={tssData}
          setAddPinClicked={setAddPinClicked}
          addPinClicked={addPinClicked}
        />
      </div>
    </div>
  );
}
