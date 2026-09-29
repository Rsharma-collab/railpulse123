import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  UserCheck,
  ShieldCheck,
  Wrench,
  Clock,
  Gauge,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  RefreshCw,
  Flame,
  Zap
} from 'lucide-react';

export const CrewRakeReadinessView: React.FC = () => {
  const { crew, rake, selectedTrain, prediction, setActiveTab } = useRailway();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              Operational Readiness Layer
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Crew & Rake Readiness Intelligence</h2>
          <p className="text-xs text-neutral-400">
            Monitoring locomotive health, rake mechanical clearance, crew duty hours, and platform turnaround
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs font-bold font-mono text-blue-400">
            Readiness Index: {crew.readiness === 'READY' && rake.maintenanceStatus === 'CLEARED' ? 'OPERATIONAL' : 'ATTENTION REQUIRED'}
          </div>
          <button
            onClick={() => setActiveTab('prediction')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>ETA Impact →</span>
          </button>
        </div>
      </div>

      {/* Operational Simulation Disclaimer */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs text-neutral-400 leading-relaxed">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-neutral-200">Simulated Operations Data:</strong> RailPulse does not directly access confidential CMS/FOIS crew logs. Operational readiness metrics are dynamically simulated to represent real-world railway dispatch constraints and feed directly into our dynamic ETA engine.
        </div>
      </div>

      {/* Dynamic Operational Impact Callout */}
      {rake.departureShiftMin > 0 || rake.coachReadiness !== '100% READY' ? (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-white block">Rake Readiness Constraint Active</strong>
              <span>
                Coach watering and mechanical brake test underway on Platform 2. Expected turnaround shifted by +{rake.departureShiftMin || 3} minutes.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('prediction')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/40"
          >
            See ETA Effect
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-200 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            All operational readiness constraints cleared for Train {selectedTrain.number}. Loco, rake, and crew sign-on confirmed nominal.
          </span>
        </div>
      )}

      {/* 5 Distinct Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: CREW STATUS */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Loco Pilot & Crew</h3>
                <span className="text-[11px] text-neutral-400">Sign-on & Duty Tracking</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              {crew.signOnStatus}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Assigned Driver:</span>
              <span className="font-semibold text-white">{crew.assignedDriver}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Assigned Guard:</span>
              <span className="text-neutral-200">{crew.assignedGuard}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Sign-on Timestamp:</span>
              <span className="font-mono text-neutral-200">{crew.signOnTime} IST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Duty Hours Logged:</span>
              <span className="font-mono text-neutral-200">{crew.dutyHoursElapsed}h / {crew.maxDutyHours}h max</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Breathalyzer Test:</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> PASSED 0.00%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Connecting Crew:</span>
              <span className="text-neutral-200">{crew.connectingCrewStatus} (Nagpur Lobby)</span>
            </div>
          </div>
        </div>

        {/* Card 2: LOCOMOTIVE HEALTH */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Locomotive Telemetry</h3>
                <span className="text-[11px] text-neutral-400">WAP-7 Dual Cab #30482</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              100% HEALTH
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Traction Motor Power:</span>
              <span className="font-mono font-semibold text-emerald-400">6,350 HP (AC 3-Phase)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">OHE Line Voltage:</span>
              <span className="font-mono text-neutral-200">25.4 kV AC (Nominal)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Regenerative Braking:</span>
              <span className="text-emerald-400">Active (Efficiency 98%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Kavach / TCAS System:</span>
              <span className="text-emerald-400 font-mono">LOCKED & ARMED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Traction Health:</span>
              <span className="font-mono text-white">{rake.acTractionHealthPct}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: RAKE INSPECTION */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Rake Composition</h3>
                <span className="text-[11px] text-neutral-400">{rake.rakeId}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {rake.coachCount} Coaches
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Mechanical Rolling Test:</span>
              <span className="font-semibold text-white">{rake.mechanicalInspection}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Coach Servicing:</span>
              <span className="text-amber-400 font-medium">{rake.coachReadiness}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Bio-Toilets Flushing:</span>
              <span className="text-neutral-200">Checked & Cleared</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Axle Temperature Sensor:</span>
              <span className="text-emerald-400 font-mono">NORMAL (52°C)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Coach Watering:</span>
              <span className="text-neutral-200">Tanks at 92%</span>
            </div>
          </div>
        </div>

        {/* Card 4: BRAKE & MAINTENANCE */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Gauge className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Pneumatic & Brake Circuit</h3>
                <span className="text-[11px] text-neutral-400">Twin-pipe Air Brake</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              NOMINAL
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Brake Pipe Pressure (BP):</span>
              <span className="font-mono font-bold text-white">{rake.brakePressurePsi.toFixed(1)} kg/cm²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Feed Pipe Pressure (FP):</span>
              <span className="font-mono font-bold text-white">6.0 kg/cm²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Continuity Verification:</span>
              <span className="text-emerald-400">End-to-End Confirmed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Maintenance Schedule:</span>
              <span className="text-neutral-200">Trip Inspection Cleared</span>
            </div>
          </div>
        </div>

        {/* Card 5: TURNAROUND & DWELL */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Platform Turnaround & Dwell</h3>
                <span className="text-[11px] text-neutral-400">Itarsi Jn Platform 2 Schedule</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {rake.turnaroundRemainingMin} min remaining
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] uppercase font-mono block mb-1">Scheduled Dwell</span>
              <span className="font-mono text-base font-bold text-white">10 min</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">15:25 → 15:35</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] uppercase font-mono block mb-1">Predicted Dwell</span>
              <span className="font-mono text-base font-bold text-amber-400">11 min</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">15:36 → 15:47</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] uppercase font-mono block mb-1">Departure Variance</span>
              <span className="font-mono text-base font-bold text-white">+{rake.departureShiftMin || 2} min</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">Servicing & Crossing Buffer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
