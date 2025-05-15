"use client";

import React, { useState, useRef } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import Header from "@/components/Header";
import Map from "@/components/widgets/Map";
import ScanData from "@/components/widgets/ScanData";
import MapToggles from "@/components/widgets/MapToggles";
import SystemControl from "@/components/widgets/SystemControl";
import CameraFeeds from "@/components/widgets/CameraFeeds";
import LLMWidget from "@/components/widgets/LLM";
import Alerts from "@/components/widgets/Alerts";
import { useAPI } from "@/hooks/useAPI";
import { APIResponseData } from "@/types/api";
import RoverControls from "@/components/widgets/RoverControls";

const ResponsiveGridLayout = WidthProvider(Responsive);
const defaultLayout: Layout[] = [
  { i: "map", x: 0, y: 0, w: 3, h: 3 },
  { i: "taskQueue", x: 3, y: 0, w: 1, h: 3 },
  { i: "scanData", x: 4, y: 0, w: 1, h: 3 },
  { i: "roverControls", x: 3, y: 3, w: 2, h: 2 },
  { i: "mapToggles", x: 2, y: 3, w: 1, h: 2 },
  { i: "llm", x: 0, y: 3, w: 2, h: 2 },
  { i: "cameraFeeds", x: 0, y: 3, w: 2, h: 2 },
];

export default function Home() {
  const { data, error } = useAPI();

  const backendData: APIResponseData = data;
  const tssData = backendData.tssData;
  const mapData = backendData.mapData;
  const specData = tssData.SPEC?.spec;

  // Draggable layout state
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  // Map global states
  const [visibleLayers, setVisibleLayers] = useState({
    eva: true,
    pr: true,
    poi: true,
    pin: true,
  });
  const addPointRef = useRef<() => void>(null);

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleAddPoint = () => {
    if (addPointRef.current) addPointRef.current();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-blue-100 font-mono">
      <Header
        elapsedTime={tssData.ROVER_TELEMETRY?.pr_telemetry.mission_elapsed_time}
        error={error}
      />
      <div className="flex flex-1 overflow-auto">
        <div className="flex-1 p-2">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 5 }}
            rowHeight={150}
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
                handleAddPoint={addPointRef}
                mapData={mapData}
                tssData={tssData}
              />
            </div>
            <div key="taskQueue">
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
            <div key="cameraFeeds">
              <CameraFeeds />
            </div>
          </ResponsiveGridLayout>
        </div>
          <SystemControl
            handleAddPoint={handleAddPoint}
            dataError={error}
            tssData={tssData}
          />
      </div>
    </div>
  );
}
