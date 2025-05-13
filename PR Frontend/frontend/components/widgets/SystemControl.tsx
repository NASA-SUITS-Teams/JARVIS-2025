import React from "react";
import SystemStates from "@/components/widgets/SystemStates";
import Alerts from "@/components/widgets/Alerts";
import QuickActions from "@/components/widgets/QuickActions";
import { Alert } from "@/types/api";
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
    <div className="h-full border-l border-blue-600 bg-gray-800 flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-center">
        <span className="font-bold">SYSTEM CONTROL</span>
      </div>
      <QuickActions handleAddPoint={handleAddPoint} />
      <Alerts alertData={alertData} />
      <SystemStates tssData={tssData} />
    </div>
  );
}
