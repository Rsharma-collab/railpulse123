/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SearchTrainModal } from './components/modals/SearchTrainModal';
import { ReportIssueModal } from './components/modals/ReportIssueModal';
import { StationFinderModal } from './components/modals/StationFinderModal';
import { RailPulseAiChatbot } from './components/chat/RailPulseAiChatbot';
import { ArrowLeft } from 'lucide-react';

import { LandingPageView } from './components/views/LandingPageView';
import { DashboardView } from './components/views/DashboardView';
import { HomeCommandCenter } from './components/views/HomeCommandCenter';
import { LiveGpsView } from './components/views/LiveGpsView';
import { NetworkIntelligenceView } from './components/views/NetworkIntelligenceView';
import { CrewRakeReadinessView } from './components/views/CrewRakeReadinessView';
import { HistoricalIntelligenceView } from './components/views/HistoricalIntelligenceView';
import { DynamicEtaView } from './components/views/DynamicEtaView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { JourneyTimelineView } from './components/views/JourneyTimelineView';
import { ConnectionProtectionView } from './components/views/ConnectionProtectionView';
import { StationOrientationView } from './components/views/StationOrientationView';
import { SmartAlertsView } from './components/views/SmartAlertsView';
import { LocalDiscoveryView } from './components/views/LocalDiscoveryView';
import { OperationsDashboardView } from './components/views/OperationsDashboardView';
import { MyJourneysView } from './components/views/MyJourneysView';
import { SettingsView } from './components/views/SettingsView';
import { SimulationModeView } from './components/views/SimulationModeView';
import { RouteFinderView } from './components/views/RouteFinderView';

const MainContent: React.FC = () => {
  const { activeTab, theme, canGoBack, goBack } = useRailway();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [isStationFinderOpen, setIsStationFinderOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    const handleOpenReport = () => setIsReportIssueOpen(true);
    const handleOpenStationFinder = () => setIsStationFinderOpen(true);

    window.addEventListener('open-search-train', handleOpenSearch);
    window.addEventListener('open-report-issue', handleOpenReport);
    window.addEventListener('open-station-finder', handleOpenStationFinder);

    return () => {
      window.removeEventListener('open-search-train', handleOpenSearch);
      window.removeEventListener('open-report-issue', handleOpenReport);
      window.removeEventListener('open-station-finder', handleOpenStationFinder);
    };
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPageView />;
      case 'dashboard':
        return <DashboardView />;
      case 'home':
        return <DashboardView />;
      case 'route_finder':
        return <RouteFinderView />;
      case 'gps':
        return <LiveGpsView />;
      case 'network':
        return <NetworkIntelligenceView />;
      case 'crew_rake':
        return <CrewRakeReadinessView />;
      case 'historical':
        return <HistoricalIntelligenceView />;
      case 'prediction':
        return <DynamicEtaView />;
      case 'digital_twin':
        return <DigitalTwinView />;
      case 'timeline':
        return <JourneyTimelineView />;
      case 'connection':
        return <ConnectionProtectionView />;
      case 'station_guide':
        return <StationOrientationView />;
      case 'alerts':
        return <SmartAlertsView />;
      case 'discovery':
        return <LocalDiscoveryView />;
      case 'operations':
        return <OperationsDashboardView />;
      case 'my_journeys':
        return <MyJourneysView />;
      case 'settings':
        return <SettingsView />;
      case 'simulation':
        return <SimulationModeView />;
      default:
        return <HomeCommandCenter />;
    }
  };

  return (
    <div
      className={`flex h-screen w-full flex-col overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Scrollable Viewport Frame */}
        <main id="main-scroll-container" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 scroll-smooth">
          {canGoBack && activeTab !== 'home' && (
            <div className="max-w-5xl mx-auto mb-4">
              <button
                onClick={goBack}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all group ${
                  theme === 'dark'
                    ? 'border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-2xs'
                }`}
                title="Return to previous page"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-blue-500" />
                <span>← Back to previous page</span>
              </button>
            </div>
          )}
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Drawer */}
      <MobileNav />

      {/* Search Train Modal */}
      <SearchTrainModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Report Issue Modal (Global Access) */}
      <ReportIssueModal
        isOpen={isReportIssueOpen}
        onClose={() => setIsReportIssueOpen(false)}
      />

      {/* Station Finder Modal (Global Access) */}
      <StationFinderModal
        isOpen={isStationFinderOpen}
        onClose={() => setIsStationFinderOpen(false)}
      />

      {/* Multilingual AI Chatbot Assistant */}
      <RailPulseAiChatbot
        onOpenReportIssue={() => setIsReportIssueOpen(true)}
        onOpenStationFinder={() => setIsStationFinderOpen(true)}
        onOpenSearchTrain={() => setIsSearchOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <RailwayProvider>
      <MainContent />
    </RailwayProvider>
  );
}
