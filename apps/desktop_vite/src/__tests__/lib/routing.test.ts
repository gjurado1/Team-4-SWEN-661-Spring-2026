import { describe, it, expect } from 'vitest';
import { getPageTitle } from '../../app/lib/routing';

describe('routing business logic', () => {
  describe('getPageTitle', () => {
    it('returns known route titles', () => {
      expect(getPageTitle('/dashboard')).toBe('Dashboard');
      expect(getPageTitle('/dashboard/patients')).toBe('Patient List');
      expect(getPageTitle('/dashboard/email')).toBe('Email');
      expect(getPageTitle('/dashboard/settings')).toBe('Settings');
      expect(getPageTitle('/dashboard/health-journal')).toBe('Health Journal');
    });

    it('returns Patient Details for patient detail paths', () => {
      expect(getPageTitle('/dashboard/patients/1')).toBe('Patient Details');
      expect(getPageTitle('/dashboard/patients/abc')).toBe('Patient Details');
    });

    it('derives title from last segment (kebab-case to Title Case)', () => {
      expect(getPageTitle('/dashboard/some-new-page')).toBe('Some New Page');
      expect(getPageTitle('/dashboard/medications')).toBe('Medication Schedule'); // known route
    });

    it('returns Dashboard for empty or root-like path', () => {
      expect(getPageTitle('')).toBe('Dashboard');
      expect(getPageTitle('/')).toBe('Dashboard');
    });
  });
});
