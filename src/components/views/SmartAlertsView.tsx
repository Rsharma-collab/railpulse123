import React, { useState } from 'react';
import { useRailway, ActiveTab } from '../../context/RailwayContext';
import {
  Bell,
  CheckCheck,
  Filter,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Activity,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { SmartAlert, AlertSeverity } from '../../types/railway';

export const SmartAlertsView: React.FC = () => {
  const {
    alerts,
    unreadAlertCount,
    markAlertRead,
    markAllAlertsRead,
    setActiveTab
  } = useRailway();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'journey' | 'network' | 'operations' | 'connection'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter(a => {
    const matchCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    return matchCategory && matchSeverity;
  });

  const getSeverityStyle = (sev: AlertSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          icon: <ShieldAlert className="h-4 w-4 text-red-400" />,
          badge: 'text-red-400 bg-red-500/10 border-red-500/30',
          border: 'border-red-500/30 hover:border-red-500/50'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
          badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          border: 'border-amber-500/30 hover:border-amber-500/50'
        };
      case 'info':
        return {
          icon: <Info className="h-4 w-4 text-blue-400" />,
          badge: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          border: 'border-neutral-800 hover:border-neutral-700'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          border: 'border-emerald-500/30 hover:border-emerald-500/50'
        };
    }
  };

  const handleAlertClick = (alert: SmartAlert) => {
    markAlertRead(alert.id);
    setActiveTab(alert.targetTab as ActiveTab);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Event Dispatch & Notification Layer
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Smart Alerts & Operational Notifications</h2>
          <p className="text-xs text-neutral-400">
            Real-time multi-channel alerts for ETA variance, platform changes, and connection risks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadAlertCount > 0 && (
            <button
              onClick={markAllAlertsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-emerald-400 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-neutral-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          {(['all', 'journey', 'network', 'connection', 'operations'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-colors ${
                categoryFilter === cat
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400 font-medium mr-1">Severity:</span>
          {(['all', 'critical', 'warning', 'info'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                severityFilter === sev
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-400">
            <Bell className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-200">No alerts match your filter</p>
            <p className="text-xs text-neutral-500 mt-1">Try resetting the category or severity filter</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`p-4 rounded-xl border ${style.border} ${
                  alert.read ? 'bg-neutral-950/40 opacity-80' : 'bg-neutral-900/90 shadow-sm'
                } cursor-pointer transition-all space-y-2`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 mt-0.5">
                      {style.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                        {!alert.read && (
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[11px] font-mono text-neutral-400">{alert.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${style.badge}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                  <span className="capitalize">Channel: {alert.category}</span>
                  <div className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span>Open Module ({alert.targetTab})</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
