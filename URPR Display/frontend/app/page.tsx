"use client";

import React, { useState } from "react";

import Header from "@/components/Header";
import Map from "@/components/widgets/Map";
import TaskQueue from "@/components/widgets/TaskQueue";
import SensorData from "@/components/widgets/SensorData";
import MapToggles from "@/components/widgets/MapToggles";
import CameraFeeds from "@/components/widgets/CameraFeeds";
import Alerts from "@/components/widgets/Alerts";
import QuickActions from "@/components/widgets/QuickActions";

export default function Home() {
  const [visibleLayers, setVisibleLayers] = useState({
    breadcrumb: false,
    eva: true,
    pr: true,
    poi: true,
  });

  const [isPoiMode, setIsPoiMode] = useState(false);

  const toggleLayer = (layer) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleAddPoint = () => {
    setIsPoiMode(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-blue-100 font-mono">
      <Header />

      {/* Main Content - Two Windows */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Multiple Windows */}
        <div className="flex-1 p-4 grid grid-cols-4 grid-rows-2 gap-4">
          <Map
            isPoiMode={isPoiMode}
            setVisibleLayers={setVisibleLayers}
            visibleLayers={visibleLayers}
          />

          {/* Task Queue Window */}
          <TaskQueue />

          {/* Sensor Data Window */}
          <SensorData />

          {/* Minimap Toggles Window */}
          <MapToggles visibleLayers={visibleLayers} toggleLayer={toggleLayer} />

          {/* Camera Feeds Window */}
          <CameraFeeds />
        </div>

        {/* Right Panel - Secondary Window */}
        <div className="w-64 border-l border-blue-600 bg-gray-800 flex flex-col">
          <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-center">
            <span className="font-bold">SYSTEM CONTROL</span>
          </div>

          {/* System Status */}
          <div className="p-3 border-b border-blue-600/50">
            <div className="text-sm font-bold text-blue-300 mb-2">
              SYSTEM STATES
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">
                EVA #1
              </button>
              <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">
                EVA #2
              </button>
              <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">
                Suit
              </button>
              <button className="px-2 py-1 rounded-md text-xs bg-gray-600 hover:bg-gray-500">
                LTV
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Oxygen Level</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>48%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>CO2 Level</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                  <span>63%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Communications</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <Alerts />

          {/* Quick Actions */}
          <QuickActions handleAddPoint={handleAddPoint} />

          {/* Footer */}
          <div className="mt-auto p-3 text-xs text-gray-500">
            <div className="text-center">TEAM JARVIS</div>
            <div className="text-center">UI v0.0.1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
