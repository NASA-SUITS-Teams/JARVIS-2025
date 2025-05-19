import { useAPI } from "@/hooks/useAPI";
import { useState } from "react";
import { AlertCircle, MapIcon, ScanSearchIcon } from "lucide-react";

export default function QuickActions({
  setAddPinClicked,
  addPinClicked,
  tssData,
}: {
  tssData: TSSData;
}) {
  const { resetPins, resetHistory, scanTerrain } = useAPI();
  const [scanCount, setScanCount] = useState(0);

  const scanTerrain = () => {
    // save current lidar to local storage
    const lidarData = tssData.ROVER_TELEMETRY.pr_telemetry.lidar;

    const terrainData = {
      lidar: lidarData,
      timestamp: Date.now(),
    };

    // get existing terrain data from local storage
    let existingData = [];

    try {
      const storedData = localStorage.getItem("terrainData");
      if (storedData) {
        existingData = JSON.parse(storedData);
      }
    } catch (error) {
      alert("Error parsing terrain data: " + error);
    }

    // fetch terrain data heat map from server
    const base64Image = scanTerrain();

    // open a new tab with the image
    const newTab = window.open();
    if (newTab) {
      newTab.document.body.innerHTML = `<img src="data:image/png;base64,${base64Image}" alt="Terrain Data" />`;
    }


    // overwrite terrainData with the updated array
    existingData.push(terrainData);
    localStorage.setItem("terrainData", JSON.stringify(existingData));

    setScanCount((prev) => prev + 1);
    alert("Terrain data saved to local storage");
  };

  return (
    <div className="p-3">
      <div className="text-sm font-bold text-blue-300 mb-2">QUICK ACTIONS</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          className={`p-2 ${
            addPinClicked
              ? "bg-orange-900/50 hover:bg-orange-800/50 border border-orange-600"
              : "bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600"
          } rounded-md flex flex-col items-center`}
          onClick={() => {
            setAddPinClicked(!addPinClicked);
          }}
        >
          <AlertCircle size={16} className="mb-1" />
          <span>Add Pin</span>
        </button>
        <button
          className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center"
          onClick={async () => {
            await resetPins();
            resetHistory();

            alert("Pins reset, will be updated in 0-10 seconds");
          }}
        >
          <MapIcon size={16} className="mb-1" />
          <span>Reset Map</span>
        </button>
        <button
          className="p-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600 rounded-md flex flex-col items-center"
          onClick={scanTerrain}
        >
          <ScanSearchIcon size={16} className="mb-1" />
          <span>Scan Terrain</span>
          {scanCount > 0 && (
            <span className="text-xs text-gray-400 pt-[1px]">
              {scanCount} saved
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
