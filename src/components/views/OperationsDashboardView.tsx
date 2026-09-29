import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Cpu,
  Activity,
  AlertTriangle,
  Radio,
  Share2,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Clock,
  Terminal,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';

export const OperationsDashboardView: React.FC = () => {
  const {
    signals,
    blocks,
    junctions,
    crew,
    rake,
    selectedTrain,
    prediction,
    gps,
    setActiveTab
  } = useRailway();

  const [activeActionLog, setActiveActionLog] = useState<string[]>([
    '15:14:02 - Interlocking logic holding diamond switch 14A for freight clearance.',
    '15:16:30 - Caution order issued to Train 12951: Speed limit 60 km/h on Indore Area.',
    '15:18:12 - Platform 2 turnaround servicing flagged: coach watering verified.'
  ]);

  const [executedAction, setExecutedAction] = useState<string | null>(null);

  const handleExecuteAdvisory = (actionName: string, detail: string) => {
    setExecutedAction(actionName);
    setActiveActionLog(prev => [
      `${new Date().toLocaleTimeString()} - OPERATOR ADVISORY: ${detail}`,
      ...prev
    ]);
    setTimeout(() => {
      setExecutedAction(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Control Room Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                DISPATCH CONTROL CONSOLE
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-neutral-500">SECTION: WCR-BPL-DIV</span>
            </div>
            <h2 className="text-xl font-bold text-white font-mono">Itarsi (ET) Section Operations Control</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
            Active Conflicts: <strong className="text-amber-400">1 DETECTED</strong>
          </div>
          <button
            onClick={() => setActiveTab('network')}
            className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white transition-colors"
          >
            Interlocking Schematics →
          </button>
        </div>
      </div>

      {/* Advisory Infrastructure Disclaimer */}
      <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 font-mono text-xs text-neutral-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>ADVISORY OPERATIONAL ENGINE · Hardware interlocking safety invariants enforced by Solid State Interlocking (SSI).</span>
        </div>
        <span className="text-neutral-500 text-[10px]">CTC-SPEC 4.1</span>
      </div>

      {/* Conflict Detection Priority Alert */}
      {junctions[0]?.conflictDetected && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold">
              <ShieldAlert className="h-4 w-4" />
              <span>MOVEMENT CONFLICT IDENTIFIED — JUNCTION J12 NORTH THROAT</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[10px]">
              CRITICAL INTERLOCKING QUEUE
            </span>
          </div>
          <p className="text-neutral-200 font-mono">
            {junctions[0].conflictSummary ||
              'Train 12951 route holds overlap with crossing freight rake 01215 at diamond switch 14A.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                handleExecuteAdvisory(
                  'priority-12951',
                  'Clearance precedence granted to Train 12951 Rajdhani over freight 01215.'
                )
              }
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                executedAction === 'priority-12951'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
              }`}
            >
              {executedAction === 'priority-12951' ? '✓ Advisory Sent to Cabin' : '1. Grant Precedence to 12951'}
            </button>

            <button
              onClick={() =>
                handleExecuteAdvisory(
                  'hold-freight',
                  'Signal S14 holds Freight 01215 at Itarsi North Goods Loop.'
                )
              }
              className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 border border-neutral-700"
            >
              2. Loop Freight at Outer Siding
            </button>
          </div>
        </div>
      )}

      {/* Grid of Control Room Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: Platform Allocation Matrix */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-white uppercase">Platform Allocation Matrix</span>
              <span className="text-xs text-neutral-500 font-mono">(Itarsi Jn 6 Platforms)</span>
            </div>
            <span className="text-xs font-mono text-emerald-400">4 / 6 Active</span>
          </div>

          <div className="space-y-2">
            {[
              { pf: 'Platform 1', train: '12616 Grand Trunk Express', status: 'DWELL UNDERWAY', dep: '15:40', state: 'occupied' },
              { pf: 'Platform 2', train: '12951 Mumbai Rajdhani Exp', status: 'APPROACHING (S18)', dep: '15:47', state: 'allocated' },
              { pf: 'Platform 3', train: '01215 Freight Container', status: 'CLEARING CROSSOVER', dep: '15:32', state: 'occupied' },
              { pf: 'Platform 4', train: '12138 Punjab Mail', status: 'READY FOR ARRIVAL', dep: '15:52', state: 'allocated' },
              { pf: 'Platform 5', train: 'None (Available)', status: 'AVAILABLE', dep: '—', state: 'available' },
              { pf: 'Platform 6', train: 'Maintenance Machine #44', status: 'SIDING DOCKED', dep: '16:30', state: 'occupied' }
            ].map(row => (
              <div
                key={row.pf}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-800/80 bg-neutral-950 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white w-24">{row.pf}</span>
                  <span className="text-neutral-300">{row.train}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.state === 'occupied'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : row.state === 'allocated'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {row.status}
                  </span>
                  <span className="text-neutral-400 text-[11px] w-16 text-right">Dep: {row.dep}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Active Signals Telemetry Matrix */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <span className="text-sm font-mono font-bold text-white uppercase">Signal Status Board</span>
            <span className="text-xs font-mono text-neutral-400">Track Corridor</span>
          </div>

          <div className="space-y-2">
            {signals.map(sig => (
              <div
                key={sig.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800/80 bg-neutral-950 font-mono text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{sig.code}</span>
                  <span className="text-[10px] text-neutral-500 truncate block max-w-[130px]">{sig.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-400">{sig.speedLimitKmph} km/h</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sig.aspect === 'GREEN'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : sig.aspect === 'YELLOW'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {sig.aspect}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operations Event Log Console */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-white uppercase">Section Dispatch Log Ticker</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-500">AUTO-SCROLLING TELEMETRY</span>
        </div>

        <div className="p-3 rounded-lg bg-black/60 border border-neutral-900 font-mono text-xs text-neutral-400 space-y-1.5 max-h-40 overflow-y-auto">
          {activeActionLog.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-emerald-500 shrink-0">{'>'}</span>
              <span className={i === 0 ? 'text-neutral-200' : 'text-neutral-500'}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
