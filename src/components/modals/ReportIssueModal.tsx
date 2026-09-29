import React, { useState, useEffect } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  X,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Droplets,
  Utensils,
  Clock,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IssueCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  darkBgColor: string;
  placeholder: string;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ isOpen, onClose }) => {
  const { selectedTrain, addAlert, theme } = useRailway();
  const isDark = theme === 'dark';

  const categories: IssueCategory[] = [
    {
      id: 'cleanliness',
      name: 'Coach Cleanliness',
      icon: Sparkles,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      darkBgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      placeholder: 'e.g. Washroom needs cleaning, trash bin overflowing in coach lobby...'
    },
    {
      id: 'electrical',
      name: 'Electrical & AC',
      icon: Zap,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
      darkBgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      placeholder: 'e.g. Mobile charging point near seat not working, AC too cold...'
    },
    {
      id: 'water',
      name: 'Water Shortage',
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 border-blue-200 text-blue-900',
      darkBgColor: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      placeholder: 'e.g. No water available in rear washroom taps...'
    },
    {
      id: 'security',
      name: 'Security & Safety',
      icon: ShieldAlert,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50 border-rose-200 text-rose-900',
      darkBgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      placeholder: 'e.g. Unauthorized passengers occupying seats, need RPF personnel...'
    },
    {
      id: 'pantry',
      name: 'Pantry & Food',
      icon: Utensils,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-900',
      darkBgColor: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      placeholder: 'e.g. Packaged meal quality issue or overcharging query...'
    },
    {
      id: 'punctuality',
      name: 'Delays & Schedule',
      icon: Clock,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 border-cyan-200 text-cyan-900',
      darkBgColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      placeholder: 'e.g. Train unscheduled halt enquiry or connecting train query...'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('cleanliness');
  const [coach, setCoach] = useState<string>('B4');
  const [berth, setBerth] = useState<string>('24');
  const [pnr, setPnr] = useState<string>('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('urgent');
  const [description, setDescription] = useState<string>('');
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    category: string;
    etaResolution: string;
  } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSubmittedTicket(null);
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `RP-ISSUE-${Math.floor(100000 + Math.random() * 900000)}`;
    const catName = categories.find(c => c.id === selectedCategory)?.name || 'General Query';
    
    // Add alert into notification system
    addAlert({
      type: 'OPERATIONAL_DELAY',
      title: `Issue Ticket ${ticketId} Lodged`,
      message: `${catName} reported for Coach ${coach || 'General'}, Seat ${berth || '-'}. Dispatched to train superintendent.`,
      severity: urgency === 'emergency' ? 'critical' : urgency === 'urgent' ? 'warning' : 'info',
      category: 'operations',
      targetTab: 'alerts'
    });

    setSubmittedTicket({
      ticketId,
      category: catName,
      etaResolution: urgency === 'emergency' ? 'Immediate (< 10 mins)' : 'Next Junction Halt (~20 mins)'
    });
  };

  const activeCategoryObj = categories.find(c => c.id === selectedCategory) || categories[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Report Issue & Passenger Assistance
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Direct link to on-board superintendent & RailMadad support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {submittedTicket ? (
            /* Ticket Confirmation View */
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold">Issue Successfully Lodged</h3>
                <p className={`text-xs mt-1 max-w-md mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Your issue has been logged and assigned to on-board staff and the RailPulse operations desk.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border max-w-md mx-auto text-left space-y-2 text-xs font-mono ${
                  isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-700/50">
                  <span className="text-slate-500">Ticket Reference:</span>
                  <span className="font-bold text-sm text-blue-500">{submittedTicket.ticketId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Train:</span>
                  <span className="font-sans font-medium">{selectedTrain.number} - {selectedTrain.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coach / Seat:</span>
                  <span className="font-sans font-medium">{coach || 'General'} · Seat {berth || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-sans font-medium">{submittedTicket.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Response:</span>
                  <span className="font-sans font-semibold text-emerald-500">{submittedTicket.etaResolution}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    isDark
                      ? 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Report Another Issue
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Issue Lodging Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Active Train Context Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className={`block text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Active Journey
                  </span>
                  <span className="font-bold">
                    {selectedTrain.number} · {selectedTrain.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`block text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Route
                  </span>
                  <span className="font-medium">
                    {selectedTrain.sourceCode} → {selectedTrain.destCode}
                  </span>
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Select Issue Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? isDark
                              ? `${cat.darkBgColor} ring-1 ring-blue-500`
                              : `${cat.bgColor} ring-1 ring-blue-500`
                            : isDark
                            ? 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isDark ? 'bg-slate-800' : 'bg-white shadow-2xs'}`}>
                          <Icon className={`h-4 w-4 ${cat.color}`} />
                        </div>
                        <span className="text-xs font-semibold leading-tight line-clamp-1">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coach, Berth & PNR */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Coach No.
                  </label>
                  <input
                    type="text"
                    value={coach}
                    onChange={e => setCoach(e.target.value.toUpperCase())}
                    placeholder="e.g. B4"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors uppercase ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500 focus:outline-hidden'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:outline-hidden'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Seat / Berth
                  </label>
                  <input
                    type="text"
                    value={berth}
                    onChange={e => setBerth(e.target.value)}
                    placeholder="e.g. 24"
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500 focus:outline-hidden'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:outline-hidden'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    PNR (Optional)
                  </label>
                  <input
                    type="text"
                    value={pnr}
                    onChange={e => setPnr(e.target.value)}
                    placeholder="10 digits"
                    maxLength={10}
                    className={`w-full px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500 focus:outline-hidden'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:outline-hidden'
                    }`}
                  />
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('normal')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      urgency === 'normal'
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Normal (Routine)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      urgency === 'urgent'
                        ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                        : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Urgent (Next Halt)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('emergency')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                      urgency === 'emergency'
                        ? 'bg-rose-600 text-white border-rose-600 font-semibold'
                        : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Emergency (Immediate)
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description & Specific Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={activeCategoryObj.placeholder}
                  className={`w-full px-3 py-2 rounded-xl border text-xs transition-colors resize-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500 focus:outline-hidden placeholder-slate-600'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:outline-hidden placeholder-slate-400'
                  }`}
                  required
                />
              </div>

              {/* Direct Railway Helplines */}
              <div
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                  isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Emergency Helplines:
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono font-bold">
                  <span className="text-blue-500">139 (RailMadad)</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-rose-500">182 (RPF Security)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    isDark
                      ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-xs flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
