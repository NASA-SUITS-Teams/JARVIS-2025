import React from 'react';
import SystemStates from '@/components/widgets/SystemStates';
import Alerts from '@/components/widgets/Alerts';
import QuickActions from '@/components/widgets/QuickActions';
import { Alert } from '@/types/api';

export default function SystemControl ({ handleAddPoint, alertData, dataError }: { handleAddPoint: () => void, alertData: Alert[] }) {
  return (
    <div className="h-full border-l border-blue-600 bg-gray-800 flex flex-col">
      <div className="bg-gray-700 p-2 border-b border-blue-600 flex items-center justify-center">
        <span className="font-bold">SYSTEM CONTROL</span>
      </div>
      <SystemStates dataError={dataError} />
      <Alerts alertData={alertData} />
      <QuickActions handleAddPoint={handleAddPoint} />
      <div className="mt-auto p-3 text-xs text-gray-500">
        <div className="text-center">TEAM JARVIS</div>
      </div>
    </div>
  );
};
