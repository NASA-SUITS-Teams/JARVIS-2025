"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Map from "@/components/widgets/Map";
import TaskQueue from "@/components/widgets/TaskQueue";
import ScanData from "@/components/widgets/ScanData";
import MapToggles from "@/components/widgets/MapToggles";
import SystemControl from "@/components/widgets/SystemControl";
import { useAPI } from "@/hooks/useAPI";
import { APIResponseData } from "@/types/api";

export default function Home() {
  const { data, error, loading } = useAPI();

  if (!data) return <p>loading...</p>

  const backendData: APIResponseData = data;
  console.log("backendData", backendData);
  const tssData = backendData.tssData; // TSS data values (array of all values)
  const mapData = backendData.mapData; // Map data I.E. pins
  const alertData = backendData.alertData; // Alerts data in JSON array
  const tpqData = backendData.tpqData; // Task priority queue data in JSON array

  console.log("alertData", alertData);

  // Map global states
  const [activeMap, setActiveMap] = useState("grid");
  const [visibleLayers, setVisibleLayers] = useState({
    eva: true,
    pr: true,
    poi: true,
  });
  const addPointRef = useRef(null);

  const toggleLayer = (layer) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleAddPoint = () => {
    if (addPointRef.current) addPointRef.current();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-blue-100 font-mono">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 grid grid-cols-4 grid-rows-2 gap-4">
          <Map
            activeMap={activeMap}
            setActiveMap={setActiveMap}
            visibleLayers={visibleLayers}
            handleAddPoint={addPointRef}
            mapData={mapData}
          />
          <TaskQueue taskData={tpqData} />
          <ScanData />
          <MapToggles visibleLayers={visibleLayers} toggleLayer={toggleLayer} />
        </div>
        <SystemControl handleAddPoint={handleAddPoint} alertData={alertData} />
      </div>
    </div>
  );
}
