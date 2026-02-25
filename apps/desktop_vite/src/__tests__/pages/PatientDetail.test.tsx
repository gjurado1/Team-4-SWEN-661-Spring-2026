import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientDetail } from '../../app/pages/PatientDetail';
import { MemoryRouter, Route, Routes } from 'react-router';

const renderWithPatient = (patientId: string) =>
  render(
    <MemoryRouter initialEntries={[`/dashboard/patients/${patientId}`]}>
      <Routes>
        <Route path="/dashboard/patients/:patientId" element={<PatientDetail />} />
        <Route path="/dashboard/patients" element={<div>Patient List Page</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  (window as any).tabManager = {
    updateActiveTabTitle: vi.fn(),
    openNewTab: vi.fn(),
  };
});

afterEach(() => {
  delete (window as any).tabManager;
});

describe('PatientDetail', () => {
  // 1. Patient not found state
  describe('when patient is not found', () => {
    it('shows "Patient not found" message for an invalid ID', () => {
      renderWithPatient('999');
      expect(screen.getByText('Patient not found')).toBeInTheDocument();
    });

    it('renders a "Back to Patient List" button', () => {
      renderWithPatient('999');
      expect(screen.getByRole('button', { name: 'Back to Patient List' })).toBeInTheDocument();
    });

    it('navigates to /dashboard/patients when "Back to Patient List" is clicked', async () => {
      const user = userEvent.setup();
      renderWithPatient('999');
      await user.click(screen.getByRole('button', { name: 'Back to Patient List' }));
      expect(screen.getByText('Patient List Page')).toBeInTheDocument();
    });

    it('handles hover on "Back to Patient List" button', () => {
      renderWithPatient('999');
      const button = screen.getByRole('button', { name: 'Back to Patient List' });
      fireEvent.mouseEnter(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
      fireEvent.mouseLeave(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    });
  });

  // 2. Renders patient info for ID '1'
  describe('renders patient info for Margaret Smith (ID 1)', () => {
    it('displays patient name', () => {
      renderWithPatient('1');
      expect(screen.getByText('Margaret Smith')).toBeInTheDocument();
    });

    it('displays age and gender', () => {
      renderWithPatient('1');
      expect(screen.getByText(/78 years old/)).toBeInTheDocument();
      expect(screen.getByText(/Female/)).toBeInTheDocument();
    });

    it('displays admission date', () => {
      renderWithPatient('1');
      expect(screen.getByText(/Admitted: January 15, 2026/)).toBeInTheDocument();
    });
  });

  // 13. Patient avatar initials
  describe('patient avatar', () => {
    it('renders initials "MS" for Margaret Smith', () => {
      renderWithPatient('1');
      expect(screen.getByText('MS')).toBeInTheDocument();
    });

    it('renders initials "RW" for Robert Williams', () => {
      renderWithPatient('2');
      expect(screen.getByText('RW')).toBeInTheDocument();
    });

    it('renders initials "JD" for John Davis', () => {
      renderWithPatient('3');
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  // 3. Contact information section
  describe('contact information', () => {
    it('displays the section heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });

    it('displays the phone number', () => {
      renderWithPatient('1');
      expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
    });

    it('displays the email', () => {
      renderWithPatient('1');
      expect(screen.getByText('margaret.smith@email.com')).toBeInTheDocument();
    });

    it('displays the address', () => {
      renderWithPatient('1');
      expect(screen.getByText('123 Maple Street, Apt 4B, Springfield, IL 62701')).toBeInTheDocument();
    });
  });

  // 4. Emergency contact section
  describe('emergency contact', () => {
    it('displays the section heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Emergency Contact')).toBeInTheDocument();
    });

    it('displays the emergency contact name', () => {
      renderWithPatient('1');
      expect(screen.getByText('John Smith (Son)')).toBeInTheDocument();
    });

    it('displays the relationship', () => {
      renderWithPatient('1');
      expect(screen.getByText('Son')).toBeInTheDocument();
    });

    it('displays the emergency contact phone', () => {
      renderWithPatient('1');
      expect(screen.getByText('(555) 987-6543')).toBeInTheDocument();
    });
  });

  // 5. Recent vitals section
  describe('recent vitals', () => {
    it('displays the section heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Recent Vitals')).toBeInTheDocument();
    });

    it('displays blood pressure', () => {
      renderWithPatient('1');
      expect(screen.getByText('Blood Pressure')).toBeInTheDocument();
      expect(screen.getByText('142/88')).toBeInTheDocument();
    });

    it('displays heart rate', () => {
      renderWithPatient('1');
      expect(screen.getByText('Heart Rate')).toBeInTheDocument();
      expect(screen.getByText('76 bpm')).toBeInTheDocument();
    });

    it('displays temperature', () => {
      renderWithPatient('1');
      expect(screen.getByText('Temperature')).toBeInTheDocument();
      expect(screen.getByText('98.4\u00B0F')).toBeInTheDocument();
    });

    it('displays weight', () => {
      renderWithPatient('1');
      expect(screen.getByText('Weight')).toBeInTheDocument();
      expect(screen.getByText('165 lbs')).toBeInTheDocument();
    });

    it('displays last updated timestamp', () => {
      renderWithPatient('1');
      expect(screen.getByText(/Last updated: Mar 15, 2026 9:30 AM/)).toBeInTheDocument();
    });
  });

  // 6. Medical conditions and allergies
  describe('medical conditions and allergies', () => {
    it('displays the medical conditions heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Medical Conditions')).toBeInTheDocument();
    });

    it('lists all medical conditions', () => {
      renderWithPatient('1');
      expect(screen.getByText('Hypertension')).toBeInTheDocument();
      expect(screen.getByText('Type 2 Diabetes')).toBeInTheDocument();
      expect(screen.getByText('Osteoarthritis')).toBeInTheDocument();
    });

    it('displays the allergies heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Allergies')).toBeInTheDocument();
    });

    it('lists all allergies', () => {
      renderWithPatient('1');
      expect(screen.getByText('Penicillin')).toBeInTheDocument();
      expect(screen.getByText('Sulfa drugs')).toBeInTheDocument();
    });
  });

  // 7. Current medications
  describe('current medications', () => {
    it('displays the section heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Current Medications')).toBeInTheDocument();
    });

    it('displays Lisinopril with dosage and frequency', () => {
      renderWithPatient('1');
      expect(screen.getByText('Lisinopril')).toBeInTheDocument();
      expect(screen.getByText(/20mg/)).toBeInTheDocument();
      expect(screen.getByText(/Once daily/)).toBeInTheDocument();
    });

    it('displays Metformin with dosage and frequency', () => {
      renderWithPatient('1');
      expect(screen.getByText('Metformin')).toBeInTheDocument();
      expect(screen.getByText(/500mg/)).toBeInTheDocument();
      expect(screen.getByText(/Twice daily/)).toBeInTheDocument();
    });

    it('displays Ibuprofen with dosage and frequency', () => {
      renderWithPatient('1');
      expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
      expect(screen.getByText(/200mg/)).toBeInTheDocument();
      expect(screen.getByText(/As needed/)).toBeInTheDocument();
    });
  });

  // 8. Care notes
  describe('care notes', () => {
    it('displays the section heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Care Notes')).toBeInTheDocument();
    });

    it('displays the care notes content', () => {
      renderWithPatient('1');
      expect(
        screen.getByText(
          'Patient is responding well to recent medication adjustments. Continue monitoring blood pressure daily. Remind about physical therapy appointment on Thursday.'
        )
      ).toBeInTheDocument();
    });
  });

  // 9. "Open Another Patient" buttons
  describe('Open Another Patient section', () => {
    it('displays the section heading', () => {
      renderWithPatient('1');
      expect(screen.getByText('Open Another Patient (Demo)')).toBeInTheDocument();
    });

    it('displays description text', () => {
      renderWithPatient('1');
      expect(screen.getByText('Click to open other patient records in new tabs:')).toBeInTheDocument();
    });

    it('shows buttons for other patients but not the current one', () => {
      renderWithPatient('1');
      expect(screen.getByText('Robert Williams')).toBeInTheDocument();
      expect(screen.getByText('John Davis')).toBeInTheDocument();
      // Margaret Smith should not appear as a button in the "Open Another Patient" section
      // She is the current patient, so she should only appear in the header
      const margaretElements = screen.getAllByText('Margaret Smith');
      expect(margaretElements).toHaveLength(1); // only in the header
    });

    it('calls tabManager.openNewTab when clicking another patient button', async () => {
      const user = userEvent.setup();
      renderWithPatient('1');
      await user.click(screen.getByText('Robert Williams'));
      expect((window as any).tabManager.openNewTab).toHaveBeenCalledWith('/dashboard/patients/2');
    });

    it('calls tabManager.openNewTab for John Davis', async () => {
      const user = userEvent.setup();
      renderWithPatient('1');
      await user.click(screen.getByText('John Davis'));
      expect((window as any).tabManager.openNewTab).toHaveBeenCalledWith('/dashboard/patients/3');
    });
  });

  // 10. Edit Patient Info button hover/focus/blur
  describe('Edit Patient Info button interactions', () => {
    it('changes background on hover', () => {
      renderWithPatient('1');
      const button = screen.getByRole('button', { name: 'Edit Patient Info' });
      fireEvent.mouseEnter(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
      fireEvent.mouseLeave(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    });

    it('shows focus ring on focus and removes on blur', () => {
      renderWithPatient('1');
      const button = screen.getByRole('button', { name: 'Edit Patient Info' });
      fireEvent.focus(button);
      expect(button.style.outline).toBe('var(--focus-ring-width) solid var(--focus-ring-color)');
      expect(button.style.outlineOffset).toBe('var(--focus-ring-offset)');
      fireEvent.blur(button);
      expect(button.style.outline).toBe('none');
    });
  });

  // 11. Other patient buttons hover/focus/blur
  describe('other patient button interactions', () => {
    it('changes background on hover for other patient buttons', () => {
      renderWithPatient('1');
      const button = screen.getByText('Robert Williams').closest('button')!;
      fireEvent.mouseEnter(button);
      expect(button.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
      fireEvent.mouseLeave(button);
      expect(button.style.backgroundColor).toBe('var(--btn-secondary-bg)');
    });

    it('shows focus ring on focus and removes on blur for other patient buttons', () => {
      renderWithPatient('1');
      const button = screen.getByText('Robert Williams').closest('button')!;
      fireEvent.focus(button);
      expect(button.style.outline).toBe('var(--focus-ring-width) solid var(--focus-ring-color)');
      expect(button.style.outlineOffset).toBe('var(--focus-ring-offset)');
      fireEvent.blur(button);
      expect(button.style.outline).toBe('none');
    });
  });

  // BackButton in found state
  describe('BackButton component', () => {
    it('renders the BackButton with "Back to Patient List" label', () => {
      renderWithPatient('1');
      expect(screen.getByRole('button', { name: 'Back to Patient List' })).toBeInTheDocument();
      expect(screen.getByText('Back to Patient List')).toBeInTheDocument();
    });
  });

  // useEffect tab title update
  describe('tab title update', () => {
    it('calls tabManager.updateActiveTabTitle with the patient name', () => {
      renderWithPatient('1');
      expect((window as any).tabManager.updateActiveTabTitle).toHaveBeenCalledWith('Patient: Margaret Smith');
    });

    it('does not call updateActiveTabTitle for invalid patient', () => {
      renderWithPatient('999');
      expect((window as any).tabManager.updateActiveTabTitle).not.toHaveBeenCalled();
    });
  });
});
