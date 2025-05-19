import React, { useState } from "react";
import { Sliders } from "lucide-react";

export default function VideoFeeds() {
  const [selectedFeed, setSelectedFeed] = useState<"ltv" | "eva1" | "eva2">(
    "ltv"
  );

  const dataFeeds = {
    eva1: "http://172.20.1.98:8000/stream.mjpg", // @TODO add
    eva2: "http://192.168.51.27:5000",
    ltv: "http://192.168.51.150:5000",
  };

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-between">
        <div className="flex items-center space-x-2 drag-handle cursor-move">
          <Sliders size={18} className="text-blue-400" />
          <span className="font-bold">VIDEO FEEDS</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedFeed("ltv")}
            className={`px-2 py-1 rounded-md text-xs ${
              selectedFeed === "ltv"
                ? "bg-blue-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            LTV
          </button>

          <button
            onClick={() => setSelectedFeed("eva1")}
            className={`px-2 py-1 rounded-md text-xs ${
              selectedFeed === "eva1"
                ? "bg-blue-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            EVA #1
          </button>

          <button
            onClick={() => setSelectedFeed("eva2")}
            className={`px-2 py-1 rounded-md text-xs ${
              selectedFeed === "eva2"
                ? "bg-blue-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            EVA #2
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-700">
        <div className="text-gray-400 text-sm">
          <img src={dataFeeds[selectedFeed]} />
        </div>
      </div>
    </div>
  );
}
