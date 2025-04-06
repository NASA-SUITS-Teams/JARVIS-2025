import { AlertCircle, BarChart2, Grid, Layers, Satellite } from "lucide-react";

export default function MapToggles({ visibleLayers, toggleLayer }) {
  return (
    <div className="col-start-3 row-start-2 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2">
        <Layers size={18} className="text-blue-400" />
        <span className="font-bold">MINIMAP TOGGLES</span>
      </div>

      <div className="flex-1 p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Grid size={16} className="text-cyan-400" />
              <span className="text-sm">Breadcrumbs</span>
            </div>
            <button
              onClick={() => toggleLayer("breadcrumb")}
              className={`w-10 h-5 rounded-full p-1 ${
                visibleLayers.breadcrumb ? "bg-blue-600" : "bg-gray-600"
              } transition-colors duration-200 relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-200 ${
                  visibleLayers.breadcrumb ? "left-6" : "left-1"
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 size={16} className="text-green-400" />
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
            <div className="flex items-center space-x-2">
              <Satellite size={16} className="text-purple-400" />
              <span className="text-sm">Pressurized Rover</span>
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
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} className="text-yellow-400" />
              <span className="text-sm">Points of Interest</span>
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
        </div>
      </div>
    </div>
  );
}
