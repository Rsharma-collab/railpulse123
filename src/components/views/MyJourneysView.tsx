import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Bookmark,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowRight,
  Train as TrainIcon,
  Calendar,
  Ticket,
  Clock,
  Sparkles
} from 'lucide-react';
import { SavedJourney } from '../../types/railway';

export const MyJourneysView: React.FC = () => {
  const {
    savedJourneys,
    removeSavedJourney,
    renameSavedJourney,
    saveCurrentJourney,
    setSelectedTrain,
    trains,
    setActiveTab
  } = useRailway();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    source: 'Bhopal Jn',
    destination: 'Mumbai Central',
    date: '28 Sep 2026',
    pnr: '',
    coach: 'B4',
    berth: '32 (Lower)'
  });

  const handleStartEdit = (journey: SavedJourney) => {
    setEditingId(journey.id);
    setEditName(journey.trainName);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameSavedJourney(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleOpenJourney = (journey: SavedJourney) => {
    const matchedTrain = trains.find(t => t.number === journey.trainNumber) || trains[0];
    setSelectedTrain(matchedTrain);
    setActiveTab('home');
  };

  const handleCreateJourney = (e: React.FormEvent) => {
    e.preventDefault();
    saveCurrentJourney(formData.pnr || undefined, formData.coach, formData.berth);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Offline Persistent Travel Vault
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">My Saved Journeys</h2>
          <p className="text-xs text-neutral-400">
            Locally persisted tickets, tracking preferences, and trip histories
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Journey</span>
        </button>
      </div>

      {/* Add Journey Modal / Form */}
      {showAddModal && (
        <form
          onSubmit={handleCreateJourney}
          className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-white">Save a Railway Journey</h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Train Number</label>
              <select
                value={formData.trainNumber}
                onChange={e => {
                  const num = e.target.value;
                  const t = trains.find(tr => tr.number === num);
                  setFormData({
                    ...formData,
                    trainNumber: num,
                    trainName: t ? t.name : formData.trainName,
                    source: t ? t.source : formData.source,
                    destination: t ? t.destination : formData.destination
                  });
                }}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {trains.map(t => (
                  <option key={t.number} value={t.number}>
                    {t.number} - {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Date of Journey</label>
              <input
                type="text"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">PNR Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 248-9182741"
                value={formData.pnr}
                onChange={e => setFormData({ ...formData, pnr: e.target.value })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Coach & Seat/Berth</label>
              <input
                type="text"
                placeholder="e.g. B4 - 32"
                value={formData.coach}
                onChange={e => setFormData({ ...formData, coach: e.target.value })}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                Save to Vault
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Journeys List */}
      <div className="space-y-4">
        {savedJourneys.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-400">
            <Bookmark className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-200">No journeys saved yet</p>
            <p className="text-xs text-neutral-500 mt-1">Save your frequent trains for rapid tracking</p>
          </div>
        ) : (
          savedJourneys.map(journey => {
            const isEditing = editingId === journey.id;

            return (
              <div
                key={journey.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4 hover:border-neutral-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-bold text-emerald-400">
                        {journey.trainNumber}
                      </span>

                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="rounded border border-neutral-700 bg-neutral-950 px-2 py-0.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSaveEdit(journey.id)}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>{journey.trainName}</span>
                          <button
                            onClick={() => handleStartEdit(journey)}
                            className="text-neutral-500 hover:text-white p-0.5"
                            title="Rename Journey"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </h3>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span>{journey.source}</span>
                      <ArrowRight className="h-3 w-3 text-neutral-600" />
                      <span>{journey.destination}</span>
                      <span>·</span>
                      <span>{journey.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenJourney(journey)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Track Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => removeSavedJourney(journey.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                      title="Remove journey"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Ticket Details Strip */}
                <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-4">
                    {journey.pnr && (
                      <div>
                        <span className="text-neutral-500 text-[10px] block">PNR</span>
                        <span className="text-neutral-200">{journey.pnr}</span>
                      </div>
                    )}
                    {journey.coach && (
                      <div>
                        <span className="text-neutral-500 text-[10px] block">COACH / BERTH</span>
                        <span className="text-neutral-200">
                          {journey.coach} {journey.berth ? `· ${journey.berth}` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-emerald-400 text-[11px] font-sans">
                    ✓ Cached for Offline Access
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
