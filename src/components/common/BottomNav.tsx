/**
 * @license
 * CareContinuum - Bottom Navigation Bar
 * 4 Wireframe Tabs: Home, Medicines, Routines, Alerts
 */

import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { Home, Pill, Clock, Bell } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, state } = useApp();

  const unreadAlerts = state.alerts.filter(a => !a.dismissed).length;

  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'medicines',
      label: 'Medicines',
      icon: <Pill className="w-5 h-5" />
    },
    {
      id: 'routines',
      label: 'Routines',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadAlerts
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 z-30">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 min-w-[64px] transition-colors ${
                isActive ? 'text-[#1E7B99] font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-6 h-0.5 bg-[#1E7B99] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
