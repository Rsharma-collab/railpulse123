import React, { useState } from 'react';
import { useRailway, ActiveTab } from '../../context/RailwayContext';
import {
  Sparkles,
  LayoutDashboard,
  Navigation,
  Clock,
  MapPin,
  Search,
  Bookmark,
  Coffee,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
  Settings,
  Menu,
  X
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, unreadAlertCount, theme } = useRailway();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDark = theme === 'dark';

  const mainTabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'route_finder', label: 'Trains', icon: Search },
    { id: 'gps', label: 'Live GPS', icon: Navigation }
  ];

  const drawerTabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'station_guide', label: 'Platform & Coach Finder', icon: MapPin },
    { id: 'connection', label: 'Connection & Cab Safety', icon: ShieldCheck },
    { id: 'timeline', label: 'Station Stops Timeline', icon: Clock },
    { id: 'discovery', label: 'Food, Meds & Halt Radar', icon: Coffee },
    { id: 'my_journeys', label: 'My Saved Trips', icon: Bookmark },
    { id: 'network', label: 'Signal & Track Info', icon: Activity },
    { id: 'simulation', label: 'Demo Simulation', icon: SlidersHorizontal },
    { id: 'settings', label: 'Preferences & Themes', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div
            className={`max-h-[85vh] w-full rounded-t-2xl border-t p-5 overflow-y-auto ${
              isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between pb-3 border-b mb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className="text-sm font-semibold">All Trip Features</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-6">
              {drawerTabs.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                      isActive
                        ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-semibold'
                        : isDark
                        ? 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t px-2 backdrop-blur-lg lg:hidden transition-colors duration-200 ${
          isDark
            ? 'border-slate-800 bg-slate-950/95 text-slate-400'
            : 'border-slate-200 bg-white/95 text-slate-600 shadow-md'
        }`}
      >
        {mainTabs.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
                isActive ? 'text-blue-500 font-semibold' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
