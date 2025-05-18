import React from "react";
import SystemStates from "@/components/widgets/SystemStates";
import QuickActions from "@/components/widgets/QuickActions";
import { TSSData } from "@/types/tss";

export default function SystemControl({
  tssData,
  changeLayout,
  setAddPinClicked,
  addPinClicked,
}: {
  handleAddPoint: () => void;
  alertData: Alert[];
  tssData: TSSData;
}) {
  return (
    <div className="overflow-y-auto sticky top-0 h-screen min-h-screen border-l border-blue-600 bg-gray-800 flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-center">
        <span className="font-bold">SYSTEM CONTROL</span>
      </div>
      <QuickActions
        setAddPinClicked={setAddPinClicked}
        addPinClicked={addPinClicked}
        tssData={tssData}
      />
      <SystemStates tssData={tssData} changeLayout={changeLayout} />
    </div>
  );
}
