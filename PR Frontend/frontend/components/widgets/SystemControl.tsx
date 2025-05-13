import React from "react";
import SystemStates from "@/components/widgets/SystemStates";
import Alerts from "@/components/widgets/Alerts";
import QuickActions from "@/components/widgets/QuickActions";
import { TSSData } from "@/types/tss";

export default function SystemControl({
  handleAddPoint,
  alertData,
  tssData,
}: {
  handleAddPoint: () => void;
  alertData: Alert[];
  tssData: TSSData;
}) {
  return (
    <div className="overflow-y-auto min-h-screen border-l border-blue-600 bg-gray-800 flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-center">
        <span className="font-bold">SYSTEM CONTROL</span>
      </div>
      <QuickActions handleAddPoint={handleAddPoint} />
      <SystemStates tssData={tssData} />
    </div>
  );
}
