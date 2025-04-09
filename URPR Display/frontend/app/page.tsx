"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Map from "@/components/widgets/Map";
import TaskQueue from "@/components/widgets/TaskQueue";
import SensorData from "@/components/widgets/SensorData";
import MapToggles from "@/components/widgets/MapToggles";
import CameraFeeds from "@/components/widgets/CameraFeeds";
import SystemControl from "@/components/widgets/SystemControl";

export default function Home() {
  const [activeMap, setActiveMap] = useState('grid');
  const [visibleLayers, setVisibleLayers] = useState({
    breadcrumb: false,
    eva: true,
    pr: true,
    poi: true
  });
  const addPointRef = useRef(null);

  const toggleLayer = (layer) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
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
          />
          <TaskQueue />
          <SensorData />
          <MapToggles visibleLayers={visibleLayers} toggleLayer={toggleLayer} />
          <CameraFeeds />
        </div>
        <SystemControl handleAddPoint={handleAddPoint} />
      </div>
    </div>
  );
}
