import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Train as TrainIcon,
  Bus,
  Car,
  Plane,
  ArrowRight,
  Plus,
  Trash2,
  Info,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Connection } from '../../types/railway';

export const ConnectionProtectionView: React.FC = () => {
  const {
    connections,
    addConnection,
    removeConnection,
    prediction,
    selectedTrain,
    setActiveTab
  } = useRailway();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'TRAIN' as Connection['type'],
    transportName: '',
    identifier: '',
    destination: '',
    departureTime: '',
    platformOrGate: '',
    walkingTimeMin: 6
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transportName || !formData.departureTime) return;

    addConnection({
      type: formData.type,
      transportName: formData.transportName,
      identifier: formData.identifier || formData.transportName,
      destination: formData.destination || 'Next Destination',
      departureTime: formData.departureTime,
      platformOrGate: formData.platformOrGate || 'Platform 1',
      walkingTimeMin: Number(formData.walkingTimeMin) || 5
    });

    setFormData({
      type: 'TRAIN',
      transportName: '',
      identifier: '',
      destination: '',
      departureTime: '',
      platformOrGate: '',
      walkingTimeMin: 6
    });
    setShowAddForm(false);
  };

  const getTransportIcon = (type: Connection['type']) => {
    switch (type) {
      case 'TRAIN':
        return <TrainIcon className="h-4 w-4" />;
      case 'BUS':
        return <Bus className="h-4 w-4" />;
      case 'CAB':
        return <Car className="h-4 w-4" />;
      case 'FLIGHT':
        return <Plane className="h-4 w-4" />;
      default:
        return <TrainIcon className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (risk: Connection['riskLevel']) => {
    switch (risk) {
      case 'SAFE':
        return {
          text: 'SAFE BUFFER',
          badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          cardBorder: 'border-neutral-800'
        };
      case 'WATCH':
        return {
          text: 'WATCH BUFFER',
          badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          cardBorder: 'border-amber-500/30'
        };
      case 'AT_RISK':
        return {
          text: 'CONNECTION AT RISK',
          badgeClass: 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse',
          cardBorder: 'border-red-500/40 bg-red-950/10'
        };
    }
  };

  const currentStop = selectedTrain.stops.find(s => s.status === 'current') || selectedTrain.stops[1];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider font-mono">
              Intermodal Protection Layer
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Smart Connection Protection</h2>
          <p className="text-xs text-neutral-400">
            Dynamically recalculating transfer buffers against your predicted arrival at {currentStop.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Connection</span>
          </button>
        </div>
      </div>

      {/* Advisory Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs text-neutral-400 leading-relaxed">
        <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-neutral-200">Advisory Protection System:</strong> RailPulse monitors transit margin windows and walking corridors. Recommendations are guidance only and do not automatically alter tickets or modify operational rail schedules.
        </div>
      </div>

      {/* Add Connection Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-white">Track a Connecting Journey</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Transport Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as Connection['type'] })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="TRAIN">Connecting Train</option>
                <option value="BUS">Interstate / City Bus</option>
                <option value="METRO">City Metro</option>
                <option value="CAB">Prepaid Taxi / App Cab</option>
                <option value="FLIGHT">Connecting Flight</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Transport Name / Number</label>
              <input
                type="text"
                placeholder="e.g. 12138 Punjab Mail"
                value={formData.transportName}
                onChange={e => setFormData({ ...formData, transportName: e.target.value })}
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Departure Time (HH:MM)</label>
              <input
                type="text"
                placeholder="e.g. 15:52"
                value={formData.departureTime}
                onChange={e => setFormData({ ...formData, departureTime: e.target.value })}
                required
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Platform / Bay / Gate</label>
              <input
                type="text"
                placeholder="e.g. Platform 4"
                value={formData.platformOrGate}
                onChange={e => setFormData({ ...formData, platformOrGate: e.target.value })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Destination Station / City</label>
              <input
                type="text"
                placeholder="e.g. CSMT Mumbai"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Estimated Walk Time (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.walkingTimeMin}
                onChange={e => setFormData({ ...formData, walkingTimeMin: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
              >
                Save & Calculate Buffer
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Current Arrival Baseline Banner */}
      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-emerald-400" />
          <span>
            Arrival Baseline at <strong className="text-white">{currentStop.name}</strong>:{' '}
            <strong className="text-emerald-400 font-mono text-sm">{prediction.predictedETA}</strong>
            <span className="text-neutral-500 ml-1.5">(Scheduled: {prediction.scheduledArrival})</span>
          </span>
        </div>

        <button
          onClick={() => setActiveTab('prediction')}
          className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
        >
          <span>Why did arrival change?</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Connection Cards List */}
      <div className="space-y-4">
        {connections.map(conn => {
          const badge = getRiskBadge(conn.riskLevel);
          const effectiveBuffer = Math.max(0, conn.bufferRemainingMin - conn.walkingTimeMin);

          return (
            <div
              key={conn.id}
              className={`rounded-2xl border ${badge.cardBorder} bg-neutral-900/60 p-5 space-y-4 transition-all hover:border-neutral-700`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-200">
                    {getTransportIcon(conn.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{conn.transportName}</h3>
                      <span className="text-xs text-neutral-400">({conn.identifier})</span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      To <strong className="text-neutral-200">{conn.destination}</strong> · Departs at{' '}
                      <strong className="text-white font-mono">{conn.departureTime}</strong> from{' '}
                      <strong className="text-emerald-400">{conn.platformOrGate}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg border text-xs font-bold font-mono ${badge.badgeClass}`}>
                    {badge.text}
                  </span>
                  <button
                    onClick={() => removeConnection(conn.id)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    title="Remove connection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Buffer Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800/80 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-mono block">Your Train Arrival</span>
                  <span className="font-mono text-sm font-bold text-white">{prediction.predictedETA}</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-mono block">Connection Dep</span>
                  <span className="font-mono text-sm font-bold text-white">{conn.departureTime}</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-mono block">Transfer Walk Time</span>
                  <span className="font-mono text-sm font-bold text-neutral-200">{conn.walkingTimeMin} min</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] uppercase font-mono block">Remaining Safety Buffer</span>
                  <span
                    className={`font-mono text-sm font-bold ${
                      conn.riskLevel === 'AT_RISK'
                        ? 'text-red-400'
                        : conn.riskLevel === 'WATCH'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {conn.bufferRemainingMin} min ({effectiveBuffer}m net)
                  </span>
                </div>
              </div>

              {/* Actionable Guidance Panel */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  conn.riskLevel === 'AT_RISK'
                    ? 'border-red-500/30 bg-red-950/20 text-red-200'
                    : conn.riskLevel === 'WATCH'
                    ? 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                    : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {conn.riskLevel === 'AT_RISK' ? (
                      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong className="text-white block mb-0.5">Actionable Transfer Guidance:</strong>
                      {conn.guidance}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('station_guide')}
                    className="shrink-0 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-white font-medium hover:border-neutral-500 transition-colors"
                  >
                    Open Station Map →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
