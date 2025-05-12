"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Map from "@/components/widgets/Map";
import TaskQueue from "@/components/widgets/TaskQueue";
import ScanData from "@/components/widgets/ScanData";
import MapToggles from "@/components/widgets/MapToggles";
import SystemControl from "@/components/widgets/SystemControl";
import CameraFeeds from "@/components/widgets/CameraFeeds";
import { useAPI } from "@/hooks/useAPI";
import { APIResponseData } from "@/types/api";

import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayout: Layout[] = [
  { i: "map", x: 0, y: 0, w: 2, h: 5 },
  { i: "taskQueue", x: 2, y: 0, w: 1, h: 3 },
  { i: "scanData", x: 3, y: 0, w: 1, h: 3 },
  { i: "cameraFeeds", x: 3, y: 3, w: 1, h: 2 },
  { i: "mapToggles", x: 2, y: 3, w: 1, h: 2 },
];

export default function Home() {
  const { data, error, loading } = useAPI();
  if (!data) return <p>loading...</p>;

  const backendData: APIResponseData = data;
  const tssData = backendData.tssData;
  const mapData = backendData.mapData;
  const alertData = backendData.alertData;
  const tpqData = backendData.tpqData;

  // Draggable layout state
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  // Map global states
  const [activeMap, setActiveMap] = useState("grid");
  const [visibleLayers, setVisibleLayers] = useState({
    eva: true,
    pr: true,
    poi: true,
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
      <Header />
      <div className="flex flex-1 overflow-auto">
        <div className="flex-1 p-4">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 4 }}
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
                activeMap={activeMap}
                setActiveMap={setActiveMap}
                visibleLayers={visibleLayers}
                handleAddPoint={addPointRef}
                mapData={mapData}
              />
            </div>
            <div key="taskQueue">
              <TaskQueue taskData={tpqData} />
            </div>
            <div key="scanData">
              <ScanData />
            </div>
            <div key="cameraFeeds">
              <CameraFeeds />
            </div>
            <div key="mapToggles">
              <MapToggles
                visibleLayers={visibleLayers}
                toggleLayer={toggleLayer}
              />
            </div>
          </ResponsiveGridLayout>
        </div>
        <SystemControl
          handleAddPoint={handleAddPoint}
          alertData={alertData}
          dataError={error}
        />
      </div>
    </div>
  );
}
