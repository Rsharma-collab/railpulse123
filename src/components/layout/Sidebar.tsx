import React from 'react';
import { useRailway, ActiveTab } from '../../context/RailwayContext';
import { THEME_CONFIGS } from '../../types/theme';
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
  Settings
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, unreadAlertCount, theme, themePalette } = useRailway();
  const isDark = theme === 'dark';
  const currentTheme = THEME_CONFIGS[themePalette];

  const mainNav: NavItem[] = [
    { id: 'landing', label: 'Platform Overview', icon: Sparkles },
    { id: 'dashboard', label: 'Live Dashboard', icon: LayoutDashboard },
    { id: 'route_finder', label: 'Find Trains', icon: Search },
    { id: 'gps', label: 'Live Train Location', icon: Navigation },
    { id: 'timeline', label: 'Station Stops', icon: Clock },
    { id: 'station_guide', label: 'Platform & Coach Finder', icon: MapPin },
    { id: 'connection', label: 'Connection & Cab Safety', icon: ShieldCheck },
    { id: 'discovery', label: 'Food, Meds & Halt Radar', icon: Coffee },
    { id: 'my_journeys', label: 'My Saved Trips', icon: Bookmark }
  ];

  const advancedNav: NavItem[] = [
    { id: 'prediction', label: 'Prediction Details', icon: Clock },
    { id: 'network', label: 'Signal & Track Info', icon: Activity },
    { id: 'simulation', label: 'Demo Simulation', icon: SlidersHorizontal },
    { id: 'settings', label: 'Preferences & Themes', icon: Settings }
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <div
        className={`px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        {title}
      </div>
      <div className="space-y-1">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'home');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? currentTheme.activeNav
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isDark
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className={`hidden lg:flex w-64 shrink-0 flex-col justify-between border-r p-4 overflow-y-auto transition-colors duration-200 ${
        isDark
          ? 'border-slate-800/80 bg-slate-950 text-slate-300'
          : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <div>
        {renderNavGroup('Your Journey', mainNav)}
        {renderNavGroup('More Details', advancedNav)}
      </div>

      {/* Helpful footer */}
      <div
        className={`pt-4 border-t px-2 text-xs ${
          isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
        }`}
      >
        <p className="text-[11px]">
          Need immediate assistance?
        </p>
        <div
          className={`flex items-center gap-2 mt-1.5 font-semibold ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          <span className="text-emerald-500">●</span>
          <span>Helpline: Dial 139</span>
        </div>
      </div>
    </aside>
  );
};
