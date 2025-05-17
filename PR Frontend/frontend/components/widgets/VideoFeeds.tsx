import React, { useState } from "react";
import { Sliders } from "lucide-react";

export default function VideoFeeds() {
  // Track which feed is selected: "eva1" or "eva2"
  const [selectedFeed, setSelectedFeed] = useState<"eva1" | "eva2">("eva1");

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-between">
        <div className="flex items-center space-x-2 drag-handle cursor-move">
          <Sliders size={18} className="text-blue-400" />
          <span className="font-bold">EVA VIDEO</span>
        </div>
        <div className="flex space-x-2">
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
          {selectedFeed === "eva1"
            ? "[Placeholder for EVA #1 Camera Feed]"
            : "[Placeholder for EVA #2 Camera Feed]"}
        </div>
      </div>
    </div>
  );
}
