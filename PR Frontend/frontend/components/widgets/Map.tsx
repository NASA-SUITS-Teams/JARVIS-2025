import React, { useEffect, useState } from "react";
import { MapIcon, Grid, BarChart2, Satellite, AlertCircle, X } from "lucide-react";
import { MapElement } from "@/types/api";

export default function Map({
  activeMap,
  setActiveMap,
  visibleLayers,
  handleAddPoint,
  mapData,
}: {
  mapData: MapElement[];
}) {  
  const [mapElements, setMapElements] = useState(mapData);
  const [isPoiMode, setIsPoiMode] = useState(false);
  let poiCounter = mapElements.filter((el) => el.type === "poi").length + 1;

  useEffect(() => {
    setMapElements(mapData);
  }
  , [mapData]);

  const handleGridClick = (x, y) => {
    if (!isPoiMode) return;

    const poiExists = mapElements.some(
      (el) => el.type === "poi" && el.position[0] === x && el.position[1] === y
    );

    if (!poiExists) {
      setMapElements((prev) => [
        ...prev,
        { name: `poi-${poiCounter++}`, type: "poi", position: [x, y] },
      ]);
    }

    setIsPoiMode(false);
  };

  // Handle "Add Point" button click
  const onAddPoint = () => {
    setIsPoiMode(true);
  };

  // Override handleAddPoint with our local handler
  if (handleAddPoint) {
    handleAddPoint.current = onAddPoint;
  }

  return (
    <div className="col-span-2 row-span-2 bg-gray-800 rounded-lg border border-blue-600 shadow-lg shadow-blue-500/20 overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MapIcon size={18} className="text-blue-400" />
          <span className="font-bold">MAP</span>
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 rounded-md text-xs ${
              activeMap === "grid"
                ? "bg-blue-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            onClick={() => setActiveMap("grid")}
          >
            GRID
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 relative">
        <div className="absolute inset-0 m-4">
          <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-1 relative">
            {Array.from({ length: 10 }).map((_, i) => (
              <React.Fragment key={i}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`bg-gray-700 border border-blue-900/40 rounded-sm flex items-center justify-center ${
                      isPoiMode ? "cursor-pointer hover:bg-gray-600" : ""
                    }`}
                    onClick={() => handleGridClick(j, i)}
                  >
                    <span className="text-xs text-blue-500/30">
                      {i},{j}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}

            {mapElements.map((element) => {
              const [x, y] = element.position;
              const visible =
                (element.type === "eva" && visibleLayers.eva) ||
                (element.type === "pr" && visibleLayers.pr) ||
                (element.type === "poi" && visibleLayers.poi);

              if (!visible) return null;

              let elementIcon;
              let statusColor = "bg-green-500";

              if (
                element.status === "warning" ||
                element.reading === "warning"
              ) {
                statusColor = "bg-yellow-500";
              }

              switch (element.type) {
                case "eva":
                  elementIcon = (
                    <div className="text-green-400 bg-green-900/60 p-1 rounded-md flex items-center justify-center w-full h-full">
                      <BarChart2 size={16} />
                    </div>
                  );
                  break;
                case "pr":
                  elementIcon = (
                    <div className="text-purple-400 bg-purple-900/60 p-1 rounded-md flex items-center justify-center w-full h-full">
                      <Satellite size={16} />
                    </div>
                  );
                  break;
                case "poi":
                  elementIcon = (
                    <div className="text-yellow-400 bg-yellow-900/60 p-1 rounded-md flex items-center justify-center w-full h-full">
                      <AlertCircle size={16} />
                    </div>
                  );
                  break;
                default:
                  elementIcon = null;
              }

              return (
                <div
                  key={element.name}
                  style={{
                    position: "absolute",
                    top: `${y * 10}%`,
                    left: `${x * 10}%`,
                    width: "10%",
                    height: "10%",
                    padding: "2px",
                    zIndex: 10,
                  }}
                  className="animate-fadeIn hover:z-20"
                >
                  <div className="relative w-full h-full group">
                    {elementIcon}
                    <div
                      className={`absolute right-0 top-0 w-2 h-2 rounded-full animate-pulse z-10 border border-white/50 shadow-glow ${statusColor}`}
                      style={{ boxShadow: "0 0 5px currentColor" }}
                    ></div>
                    <div className="hidden group-hover:block absolute top-full left-0 bg-gray-800 border border-blue-500 p-2 rounded-md shadow-lg text-xs min-w-32 z-30">
                      <div className="font-bold text-blue-300">
                        {element.name.toUpperCase()}
                      </div>
                      <div className="text-gray-300">Type: {element.type}</div>
                      <div className="text-gray-300">
                        Status: {element.status}
                      </div>
                      {element.resource && (
                        <div className="text-gray-300">
                          Resource: {element.resource}
                        </div>
                      )}
                      {element.reading && (
                        <div className="text-gray-300">
                          Reading: {element.reading}
                        </div>
                      )}
                      {element.destination && (
                        <div className="text-gray-300">
                          Dest: {element.destination}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute left-0 top-0 p-1 bg-gray-800/80 rounded-br-md border-r border-b border-blue-600/50 text-xs flex flex-col">
          <div className="text-blue-300">LAT: 23°12'66"N</div>
          <div className="text-blue-300">LONG: 42°40'15"E</div>
        </div>

        <div className="absolute right-0 bottom-0 p-1 bg-gray-800/80 rounded-tl-md border-l border-t border-blue-600/50 text-xs">
          <div className="text-blue-300">GRID RES: 10m²</div>
        </div>
      </div>

      <div className="bg-gray-700 p-2 border-t border-blue-600 text-xs text-blue-300 flex justify-between">
        <div>MAP MODE: {activeMap.toUpperCase()}</div>
        <div>
          ACTIVE TOGGLES: {Object.values(visibleLayers).filter(Boolean).length}/
          {Object.keys(visibleLayers).length}
        </div>
      </div>
    </div>
  );
}
