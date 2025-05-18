import { AlertCircle, BarChart2, Layers, Pin, Satellite, Compass, History, Ruler } from "lucide-react";

export default function MapToggles({ visibleLayers, toggleLayer }) {
  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/10 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 drag-handle hover:cursor-move">
        <Layers size={18} className="text-blue-400" />
        <span className="font-bold">MAP TOGGLES</span>
      </div>

      <div className="flex-1 p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <BarChart2 size={16} className="text-pink-400" />
              <span className="text-sm">EVAs</span>
            </div>

            <button
              onClick={() => toggleLayer("eva")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.eva ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.eva ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Satellite size={16} className="text-purple-400" />
              <span className="text-sm">Rover</span>
            </div>
            <button
              onClick={() => toggleLayer("pr")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.pr ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.pr ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <AlertCircle size={16} className="text-yellow-400" />
              <span className="text-sm">POI</span>
            </div>
            <button
              onClick={() => toggleLayer("poi")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.poi ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.poi ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Pin size={16} className="text-green-400" />
              <span className="text-sm">Pins</span>
            </div>
            <button
              onClick={() => toggleLayer("pin")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.pin ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.pin ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Compass size={16} className="text-red-400" />
              <span className="text-sm">Path</span>
            </div>
            <button
              onClick={() => toggleLayer("path")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.path ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.path ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <History size={16} className="text-blue-400" />
              <span className="text-sm">History</span>
            </div>
            <button
              onClick={() => toggleLayer("historicalPath")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.historicalPath ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.historicalPath ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Ruler size={16} className="text-green-400" />
              <span className="text-sm">Range</span>
            </div>
            <button
              onClick={() => toggleLayer("range")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.range ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.range ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
