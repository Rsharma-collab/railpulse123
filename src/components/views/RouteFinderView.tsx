import React from 'react';
import { RouteSelectorHub } from '../route/RouteSelectorHub';
import { PanicFreeAssistanceHub } from '../assistance/PanicFreeAssistanceHub';
import { useRailway } from '../../context/RailwayContext';
import { Compass, Sparkles, ShieldCheck } from 'lucide-react';

export const RouteFinderView: React.FC = () => {
  const { selectedTrain } = useRailway();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Route Finder Core */}
      <RouteSelectorHub />

      {/* When a train is selected, show immediate assistance companion */}
      {selectedTrain && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Journey Help for {selectedTrain.name} ({selectedTrain.number})
            </h3>
          </div>
          <PanicFreeAssistanceHub />
        </div>
      )}
    </div>
  );
};
