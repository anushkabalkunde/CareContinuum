/**
 * @license
 * CareContinuum - Main Application Entry & Screen Router
 * Connects all 19 wireframe screens, Netflix-style joint family profiles,
 * and smart medicine aid box companion workflows.
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/common/AndroidFrame';
import { BottomNav } from './components/common/BottomNav';
import { NetflixProfileModal } from './components/common/NetflixProfileModal';
import { DuplicatePurchaseModal } from './components/common/DuplicatePurchaseModal';
import { DocsViewerModal } from './components/common/DocsViewerModal';

// Screens
import {
  SetupWelcome,
  SetupSignUp,
  SetupSignIn,
  SetupHouseholdChoice,
  SetupCreateHousehold,
  SetupJoinHousehold,
  SetupPendingApproval,
  SetupJoinRequestsAdmin,
  SetupConnectBox
} from './components/screens/SetupScreens';
import { HomeScreen } from './components/screens/HomeScreen';
import { MedicinesScreen } from './components/screens/MedicinesScreen';
import { MedicineDetailsScreen } from './components/screens/MedicineDetailsScreen';
import { ScanMedicineScreen } from './components/screens/ScanMedicineScreen';
import { CheckScannedDetailsScreen } from './components/screens/CheckScannedDetailsScreen';
import { RoutinesScreen } from './components/screens/RoutinesScreen';
import { NewRoutineWizard } from './components/screens/NewRoutineWizard';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { AdherenceHistoryScreen } from './components/screens/AdherenceHistoryScreen';
import { HouseholdManagementScreen } from './components/screens/HouseholdManagementScreen';
import { MedicineBoxScreen } from './components/screens/MedicineBoxScreen';
import { ProfileSettingsScreen } from './components/screens/ProfileSettingsScreen';

const ScreenRouter: React.FC = () => {
  const { currentScreen, state } = useApp();

  const isAuthScreen = [
    '01_welcome',
    '02_signup',
    '03_signin',
    '04_caring_for',
    '05_setup_household',
    '05_join_household',
    '06_pending_approval',
    '06_join_requests_admin',
    '07_connect_box'
  ].includes(currentScreen);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case '01_welcome':
        return <SetupWelcome />;
      case '02_signup':
        return <SetupSignUp />;
      case '03_signin':
        return <SetupSignIn />;
      case '04_caring_for':
        return <SetupHouseholdChoice />;
      case '05_setup_household':
        return <SetupCreateHousehold />;
      case '05_join_household':
        return <SetupJoinHousehold />;
      case '06_pending_approval':
        return <SetupPendingApproval />;
      case '06_join_requests_admin':
        return <SetupJoinRequestsAdmin />;
      case '07_connect_box':
        return <SetupConnectBox />;
      case '08_home':
        return <HomeScreen />;
      case '09_medicines':
        return <MedicinesScreen />;
      case '10_scan_medicine':
        return <ScanMedicineScreen />;
      case '11_check_scanned_details':
        return <CheckScannedDetailsScreen />;
      case '12_medicine_details':
        return <MedicineDetailsScreen />;
      case '13_routines':
        return <RoutinesScreen />;
      case '14_new_routine_wizard':
        return <NewRoutineWizard />;
      case '15_alerts':
        return <AlertsScreen />;
      case '16_adherence_history':
        return <AdherenceHistoryScreen />;
      case '17_household':
        return <HouseholdManagementScreen />;
      case '18_medicine_box':
        return <MedicineBoxScreen />;
      case '19_profile_settings':
        return <ProfileSettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full h-full">
      {renderActiveScreen()}

      {/* Show 4 Bottom Tabs only when logged in and outside of initial onboarding */}
      {!isAuthScreen && state.user && <BottomNav />}

      {/* Global Interactive Modals */}
      <NetflixProfileModal />
      <DuplicatePurchaseModal />
      <DocsViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidFrame>
        <ScreenRouter />
      </AndroidFrame>
    </AppProvider>
  );
}
