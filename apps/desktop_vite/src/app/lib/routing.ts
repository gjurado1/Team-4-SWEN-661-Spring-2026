/**
 * Route path → display title mapping for tabs/nav.
 * Unknown paths are derived from the last URL segment (kebab-case → Title Case).
 */
const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/patients': 'Patient List',
  '/dashboard/email': 'Email',
  '/dashboard/medications': 'Medication Schedule',
  '/dashboard/appointments': 'Appointments',
  '/dashboard/settings': 'Settings',
  '/dashboard/help': 'Help',
  '/dashboard/shortcuts': 'Keyboard Shortcuts',
  '/dashboard/ui-library': 'UI Library',
  '/dashboard/accessibility-annotations': 'Accessibility Annotations',
  '/dashboard/patient-overview': 'Patient Overview',
  '/dashboard/my-care': 'My Care Plan',
  '/dashboard/my-medications': 'My Medications',
  '/dashboard/my-appointments': 'My Appointments',
  '/dashboard/health-journal': 'Health Journal',
};

/** Get a human-readable page title for a given path. */
export function getPageTitle(path: string): string {
  if (ROUTE_TITLES[path]) return ROUTE_TITLES[path];
  if (path.startsWith('/dashboard/patients/')) return 'Patient Details';

  const lastSegment = path.split('/').filter(Boolean).pop();
  if (!lastSegment) return 'Dashboard';

  return lastSegment
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}
