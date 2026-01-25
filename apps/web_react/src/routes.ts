import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { RegisterPage } from './pages/RegisterPage';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { PatientListPage } from './pages/PatientListPage';
import { SchedulePage } from './pages/SchedulePage';
import { PatientCheckInPage } from './pages/PatientCheckInPage';
import { SymptomsPage } from './pages/SymptomsPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { EmergencyPage } from './pages/EmergencyPage';


export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage
  },
  {
    path: '/login',
    Component: LoginPage
  },
  {
    path: '/forgot-password',
    Component: ForgotPasswordPage
  },
  {
    path: '/register',
    Component: RegisterPage
  },
  {
    path: '/caregiver/dashboard',
    Component: CaregiverDashboard
  },
  {
    path: '/caregiver/patients',
    Component: PatientListPage
  },
  {
    path: '/caregiver/schedule',
    Component: SchedulePage
  },
  {
    path: '/patient/dashboard',
    Component: PatientDashboard
  },
  {
    path: '/patient/checkin',
    Component: PatientCheckInPage
  },
  {
    path: '/patient/symptoms',
    Component: SymptomsPage
  },
  {
    path: '/patient/medications',
    Component: MedicationsPage
  },
  {
    path: '/patient/reports',
    Component: ReportsPage
  },
  {
    path: '/messages',
    Component: MessagesPage
  },
  {
    path: '/settings',
    Component: SettingsPage
  },
  {
    path: '/profile',
    Component: ProfilePage
  },
  {
    path: '/emergency',
    Component: EmergencyPage
  },
  {
    path: '*',
    Component: LoginPage
  }
]);