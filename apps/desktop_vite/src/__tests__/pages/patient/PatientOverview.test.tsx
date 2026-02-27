import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { PatientOverview } from '../../../app/pages/patient/PatientOverview';
import { UserProvider } from '../../../app/contexts/UserContext';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderPatientOverview = () =>
  render(
    <MemoryRouter>
      <UserProvider>
        <PatientOverview />
      </UserProvider>
    </MemoryRouter>,
  );

describe('PatientOverview', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('renders welcome heading with fallback when no userName', () => {
    renderPatientOverview();
    expect(
      screen.getByRole('heading', { name: 'Welcome back, Patient!' }),
    ).toBeInTheDocument();
  });

  it('renders welcome heading with userName when set', () => {
    localStorage.setItem('careconnect-user-name', 'Jane');
    renderPatientOverview();
    expect(
      screen.getByRole('heading', { name: 'Welcome back, Jane!' }),
    ).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderPatientOverview();
    expect(
      screen.getByText("Here's your health overview for today"),
    ).toBeInTheDocument();
  });

  it('renders quick stats region with four cards', () => {
    renderPatientOverview();
    const region = screen.getByRole('region', {
      name: 'Quick health statistics',
    });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('Medications Today');
    expect(region).toHaveTextContent('2 of 3');
    expect(region).toHaveTextContent('Next Appointment');
    expect(region).toHaveTextContent('Feb 22');
    expect(region).toHaveTextContent('Care Goals');
    expect(region).toHaveTextContent('1 of 3');
    expect(region).toHaveTextContent('Journal Entries');
    expect(region).toHaveTextContent('2 this week');
  });

  it('renders Today\'s Tasks region with pending count', () => {
    renderPatientOverview();
    const region = screen.getByRole('region', { name: "Today's tasks" });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent("Today's Tasks");
    expect(region).toHaveTextContent('3 Pending');
  });

  it('renders all three tasks with time and completed/pending state', () => {
    renderPatientOverview();
    const tasksRegion = screen.getByRole('region', { name: "Today's tasks" });
    expect(tasksRegion).toHaveTextContent('Take evening medication');
    expect(tasksRegion).toHaveTextContent('9:00 PM');
    expect(tasksRegion).toHaveTextContent('Complete physical therapy exercises');
    expect(tasksRegion).toHaveTextContent('2:00 PM');
    expect(tasksRegion).toHaveTextContent('Record health journal entry');
    expect(tasksRegion).toHaveTextContent('Anytime');
  });

  it('renders View Full Care Plan button and navigates on click', async () => {
    const user = userEvent.setup();
    renderPatientOverview();
    const btn = screen.getByRole('button', {
      name: 'View complete care plan',
    });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/my-care');
  });

  it('applies hover and focus on View Full Care Plan button', () => {
    renderPatientOverview();
    const btn = screen.getByRole('button', {
      name: 'View complete care plan',
    });
    fireEvent.mouseEnter(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
    fireEvent.mouseLeave(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-secondary-bg)');
    fireEvent.focus(btn);
    expect(btn.style.outline).toContain('solid');
    fireEvent.blur(btn);
    expect(btn.style.outline).toBe('none');
  });

  it('renders Upcoming Appointments region', () => {
    renderPatientOverview();
    const region = screen.getByRole('region', {
      name: 'Upcoming appointments',
    });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('Upcoming Appointments');
    expect(region).toHaveTextContent('Follow-up with Dr. Johnson');
    expect(region).toHaveTextContent('Feb 22');
    expect(region).toHaveTextContent('10:00 AM');
    expect(region).toHaveTextContent('Physical Therapy Session');
    expect(region).toHaveTextContent('Feb 24');
    expect(region).toHaveTextContent('2:00 PM');
  });

  it('renders View All Appointments button and navigates on click', async () => {
    const user = userEvent.setup();
    renderPatientOverview();
    const btn = screen.getByRole('button', { name: 'View all appointments' });
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/my-appointments');
  });

  it('applies hover and focus on View All Appointments button', () => {
    renderPatientOverview();
    const btn = screen.getByRole('button', { name: 'View all appointments' });
    fireEvent.mouseEnter(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
    fireEvent.mouseLeave(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-secondary-bg)');
    fireEvent.focus(btn);
    expect(btn.style.outline).toContain('solid');
    fireEvent.blur(btn);
    expect(btn.style.outline).toBe('none');
  });

  it('renders Quick Actions region with three action buttons', () => {
    renderPatientOverview();
    const region = screen.getByRole('region', { name: 'Quick actions' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('Quick Actions');
    expect(screen.getByRole('button', { name: 'View my medications' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open health journal' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check messages' })).toBeInTheDocument();
  });

  it('My Medications button navigates to my-medications', async () => {
    const user = userEvent.setup();
    renderPatientOverview();
    await user.click(screen.getByRole('button', { name: 'View my medications' }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/my-medications');
  });

  it('Health Journal button navigates to health-journal', async () => {
    const user = userEvent.setup();
    renderPatientOverview();
    await user.click(screen.getByRole('button', { name: 'Open health journal' }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/health-journal');
  });

  it('Messages button navigates to email', async () => {
    const user = userEvent.setup();
    renderPatientOverview();
    await user.click(screen.getByRole('button', { name: 'Check messages' }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/email');
  });

  it('applies hover and focus on Quick Action buttons', () => {
    renderPatientOverview();
    const medBtn = screen.getByRole('button', { name: 'View my medications' });
    fireEvent.mouseEnter(medBtn);
    expect(medBtn.style.borderColor).toBe('var(--color-focus)');
    expect(medBtn.style.boxShadow).toBe('var(--shadow-sm)');
    fireEvent.mouseLeave(medBtn);
    expect(medBtn.style.borderColor).toBe('var(--color-border)');
    expect(medBtn.style.boxShadow).toBe('none');
    fireEvent.focus(medBtn);
    expect(medBtn.style.outline).toContain('solid');
    fireEvent.blur(medBtn);
    expect(medBtn.style.outline).toBe('none');
  });

  it('renders Quick Action labels and descriptions', () => {
    renderPatientOverview();
    expect(screen.getByText('My Medications')).toBeInTheDocument();
    expect(screen.getByText('View medication schedule')).toBeInTheDocument();
    expect(screen.getByText('Health Journal')).toBeInTheDocument();
    expect(screen.getByText('Track your daily health')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Connect with care team')).toBeInTheDocument();
  });
});
