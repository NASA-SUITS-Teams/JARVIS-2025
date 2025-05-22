import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import { TSSData } from '@/types/tss';
import { EVAState } from '@/types/EVAStateTypes';

export default function BatteryLevel({
  tssData,
  historicalData,
}: {
  tssData: TSSData & { eva: EVAState };
  historicalData: TSSData[];
}) {
  // ——————————————————————————————
  // 1️⃣ Lazy‑initialize state once with all historical points
  const [data, setData] = useState<{ time: number; battery: number }[]>(() => {
    return historicalData
      .map(e => {
        const tel = e.ROVER_TELEMETRY?.pr_telemetry;
        return tel?.mission_elapsed_time != null && tel.battery_level != null
          ? { time: tel.mission_elapsed_time, battery: tel.battery_level }
          : null;
      })
      .filter((x): x is { time: number; battery: number } => x !== null);
  });

  // ——————————————————————————————
  // 2️⃣ On each new live reading, append one point
  useEffect(() => {
    const tel = tssData.ROVER_TELEMETRY?.pr_telemetry;
    if (tel?.mission_elapsed_time != null && tel.battery_level != null) {
      setData(prev => [
        ...prev,
        { time: tel.mission_elapsed_time, battery: tel.battery_level },
      ]);
    }
  // Only run when the elapsed‑time actually changes
  }, [tssData.ROVER_TELEMETRY?.pr_telemetry?.mission_elapsed_time]);

  // ——————————————————————————————
  // 3️⃣ Feed your rolling `data` directly into the chart
  return (
    <div className="w-full h-full bg-gray-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center space-x-2 cursor-move">
        <span className="font-bold text-white">Battery History</span>
      </div>
      <div className="p-4 flex-1">
        <LineChart
          dataset={data}
          xAxis={[{ dataKey: 'time', label: 'Time (s)', scaleType: 'linear' }]}
          series={[{ dataKey: 'battery', label: 'Battery (%)', showMark: true }]}
          yAxis={[{ label: 'Battery (%)' }]}
          height={300}
          sx={{
            backgroundColor: '#1F2937',
            '.MuiChartsAxis-root .MuiChartsAxis-tickLabel': { fill: '#fff' },
            '.MuiChartsAxis-root .MuiChartsAxis-label': { fill: '#fff' },
            '.MuiChartsAxis-root .MuiChartsAxis-line': { stroke: '#fff' },
            '.MuiChartsLegend-root': { color: '#fff' },
            '.MuiLineElement-root': { stroke: '#3B82F6' },
          }}
        />
      </div>
    </div>
  );
}
