import React from 'react';
import { useRailway, ActiveTab } from '../../context/RailwayContext';
import {
  Sliders,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Sparkles,
  Activity,
  UserCheck,
  BarChart3,
  Clock,
  ShieldAlert,
  Bell,
  MapPin,
  Navigation,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SIMULATION_PIPELINE_STEPS } from '../../services/mockRailwayData';

export const SimulationModeView: React.FC = () => {
  const {
    simStep,
    isSimulating,
    simSpeed,
    setSimSpeed,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    nextSimStep,
    prevSimStep,
    jumpToSimStep,
    prediction,
    gps,
    setActiveTab
  } = useRailway();

  const currentStepDef = SIMULATION_PIPELINE_STEPS.find(s => s.step === simStep) || SIMULATION_PIPELINE_STEPS[0];

  const getTargetViewForStep = (step: number): ActiveTab => {
    switch (step) {
      case 1:
      case 2:
        return 'gps';
      case 3:
      case 4:
        return 'network';
      case 5:
        return 'crew_rake';
      case 6:
        return 'historical';
      case 7:
      case 8:
        return 'prediction';
      case 9:
        return 'connection';
      case 10:
        return 'alerts';
      case 11:
        return 'station_guide';
      default:
        return 'home';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Complete Intelligence Demonstration
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">RailPulse Pipeline Simulation Studio</h2>
          <p className="text-xs text-neutral-400">
            Simulate and demonstrate the full end-to-end intelligence cascade from a single interactive control cockpit
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Speed selector */}
          <div className="flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
            <span className="text-[10px] text-neutral-500 font-mono px-2">SPEED:</span>
            {([1, 2, 5] as const).map(s => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-2 py-0.5 rounded font-mono font-medium transition-colors ${
                  simSpeed === s ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-900 border border-neutral-800">
            <button
              onClick={prevSimStep}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
              title="Previous Step"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            {isSimulating ? (
              <button
                onClick={pauseSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={startSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Play Simulation</span>
              </button>
            )}

            <button
              onClick={nextSimStep}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
              title="Next Step"
            >
              <SkipForward className="h-4 w-4" />
            </button>

            <button
              onClick={resetSimulation}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white ml-1 border-l border-neutral-800"
              title="Reset to Step 1"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Step Feature Showcase Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                STEP {currentStepDef.step} OF 11
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Corridor: {currentStepDef.section}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {currentStepDef.title}
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
              {currentStepDef.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setActiveTab(getTargetViewForStep(simStep))}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-2"
            >
              <span>Inspect Result in Module</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Live Active Step Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-neutral-800/80 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-500 text-[10px] uppercase font-mono block">Speed</span>
            <span className="font-mono text-base font-bold text-emerald-400">{currentStepDef.speedKmph} km/h</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-500 text-[10px] uppercase font-mono block">Network Delay</span>
            <span className="font-mono text-base font-bold text-amber-400">+{currentStepDef.delayMin} min</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-500 text-[10px] uppercase font-mono block">Signal State</span>
            <span className={`font-mono text-base font-bold ${
              currentStepDef.signalAspect === 'GREEN' ? 'text-emerald-400' : currentStepDef.signalAspect === 'YELLOW' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {currentStepDef.signalAspect}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-500 text-[10px] uppercase font-mono block">Predicted ETA</span>
            <span className="font-mono text-base font-bold text-white">{prediction.predictedETA}</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 col-span-2 sm:col-span-1">
            <span className="text-neutral-500 text-[10px] uppercase font-mono block">Connection Window</span>
            <span className={`font-mono text-base font-bold ${
              currentStepDef.connectionRisk === 'AT_RISK' ? 'text-red-400' : currentStepDef.connectionRisk === 'WATCH' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {currentStepDef.connectionBufferMin}m ({currentStepDef.connectionRisk})
            </span>
          </div>
        </div>
      </div>

      {/* The 11 Pipeline Steps Interactive Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
          Full Pipeline Architecture Cascade (11 Discrete Stages)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SIMULATION_PIPELINE_STEPS.map(stepItem => {
            const isCurrent = simStep === stepItem.step;
            const isPast = simStep > stepItem.step;

            return (
              <div
                key={stepItem.step}
                onClick={() => jumpToSimStep(stepItem.step)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-neutral-900 shadow-md ring-2 ring-emerald-500/20'
                    : isPast
                    ? 'border-neutral-800/80 bg-neutral-950/60 opacity-80 hover:opacity-100 hover:border-neutral-700'
                    : 'border-neutral-800/80 bg-neutral-950/30 opacity-60 hover:opacity-90 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold font-mono ${
                        isCurrent
                          ? 'bg-emerald-500 text-black'
                          : isPast
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-neutral-900 text-neutral-500'
                      }`}
                    >
                      {stepItem.step}
                    </span>
                    <span className="font-bold text-white line-clamp-1">{stepItem.title}</span>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                      LIVE
                    </span>
                  )}
                </div>

                <p className="text-neutral-400 line-clamp-2 leading-relaxed text-[11px] mb-3">
                  {stepItem.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-500 font-mono">
                  <span>Speed: {stepItem.speedKmph} km/h</span>
                  <span className="text-neutral-400">Delay: +{stepItem.delayMin}m</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
