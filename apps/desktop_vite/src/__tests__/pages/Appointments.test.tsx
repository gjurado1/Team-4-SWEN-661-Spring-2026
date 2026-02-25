import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Appointments } from '../../app/pages/Appointments';
import { MemoryRouter } from 'react-router';

const renderAppointments = () =>
  render(
    <MemoryRouter>
      <Appointments />
    </MemoryRouter>,
  );

describe('Appointments', () => {
  it('should render the page heading, back button, and schedule button', () => {
    renderAppointments();

    expect(screen.getByText('Appointments')).toBeVisible();
    expect(screen.getByLabelText('Back')).toBeVisible();
    expect(screen.getByText('Schedule Appointment')).toBeVisible();
  });

  it('should show today\'s date formatted correctly', () => {
    renderAppointments();

    const todayFormatted = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    expect(screen.getByText(todayFormatted)).toBeVisible();
  });

  it('should render all 3 appointments with patient names', () => {
    renderAppointments();

    expect(screen.getByText('Patient: Margaret Thompson')).toBeVisible();
    expect(screen.getByText('Patient: Robert Chen')).toBeVisible();
    expect(screen.getByText('Patient: Maria Garcia')).toBeVisible();
  });

  it('should render appointment types', () => {
    renderAppointments();

    expect(screen.getByText('Home Visit - Checkup')).toBeVisible();
    expect(screen.getByText('Physical Therapy Session')).toBeVisible();
    expect(screen.getByText('Cardiology Consultation')).toBeVisible();
  });

  it('should render appointment times and durations', () => {
    renderAppointments();

    expect(screen.getByText(/10:00 AM/)).toBeVisible();
    expect(screen.getByText(/02:00 PM/)).toBeVisible();
    expect(screen.getByText(/11:00 AM/)).toBeVisible();
    expect(screen.getByText(/45 min/)).toBeVisible();
    expect(screen.getByText(/60 min/)).toBeVisible();
    expect(screen.getByText(/30 min/)).toBeVisible();
  });

  it('should render appointment locations', () => {
    renderAppointments();

    expect(screen.getByText('123 Oak Street, Springfield')).toBeVisible();
    expect(screen.getByText('Care Center - Room 204')).toBeVisible();
    expect(screen.getByText('Springfield Medical Center')).toBeVisible();
  });

  it('should render appointment dates formatted correctly', () => {
    renderAppointments();

    const date1 = new Date('2026-02-20').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const date2 = new Date('2026-02-19').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Two appointments share the same date (2026-02-20)
    expect(screen.getAllByText(date1).length).toBe(2);
    expect(screen.getByText(date2)).toBeVisible();
  });

  it('should show correct status badges - 2 Upcoming and 1 Completed', () => {
    renderAppointments();

    const upcomingBadges = screen.getAllByText('Upcoming');
    expect(upcomingBadges).toHaveLength(2);
    upcomingBadges.forEach((badge) => expect(badge).toBeVisible());

    const completedBadges = screen.getAllByText('Completed');
    expect(completedBadges).toHaveLength(1);
    expect(completedBadges[0]).toBeVisible();
  });

  it('should show Reschedule and View Details buttons for upcoming appointments', () => {
    renderAppointments();

    const rescheduleButtons = screen.getAllByText('Reschedule');
    expect(rescheduleButtons).toHaveLength(2);
    rescheduleButtons.forEach((btn) => expect(btn).toBeVisible());

    const viewDetailsButtons = screen.getAllByText('View Details');
    expect(viewDetailsButtons).toHaveLength(2);
    viewDetailsButtons.forEach((btn) => expect(btn).toBeVisible());
  });

  it('should NOT show Reschedule or View Details buttons for the completed appointment', () => {
    renderAppointments();

    // There are exactly 2 Reschedule and 2 View Details buttons (only for upcoming)
    expect(screen.getAllByText('Reschedule')).toHaveLength(2);
    expect(screen.getAllByText('View Details')).toHaveLength(2);
  });

  it('should handle Schedule Appointment button hover styles', async () => {
    const user = userEvent.setup();
    renderAppointments();

    const scheduleButton = screen.getByText('Schedule Appointment').closest('button')!;
    await user.hover(scheduleButton);
    expect(scheduleButton.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(scheduleButton.style.color).toBe('var(--btn-primary-hover-fg)');

    await user.unhover(scheduleButton);
    expect(scheduleButton.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(scheduleButton.style.color).toBe('var(--btn-primary-fg)');
  });

  it('should handle Schedule Appointment button focus/blur styles', () => {
    renderAppointments();

    const scheduleButton = screen.getByText('Schedule Appointment').closest('button')!;
    scheduleButton.focus();
    expect(scheduleButton.style.outline).toContain('solid');

    scheduleButton.blur();
    expect(scheduleButton.style.outline).toBe('none');
  });

  it('should handle Reschedule button hover styles', async () => {
    const user = userEvent.setup();
    renderAppointments();

    const rescheduleButtons = screen.getAllByText('Reschedule');
    for (const btn of rescheduleButtons) {
      const button = btn.closest('button')!;
      await user.hover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
      expect(button.style.color).toBe('var(--btn-secondary-hover-fg)');

      await user.unhover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-secondary-bg)');
      expect(button.style.color).toBe('var(--btn-secondary-fg)');
    }
  });

  it('should handle Reschedule button focus/blur styles', () => {
    renderAppointments();

    const rescheduleButtons = screen.getAllByText('Reschedule');
    for (const btn of rescheduleButtons) {
      const button = btn.closest('button')!;
      button.focus();
      expect(button.style.outline).toContain('solid');

      button.blur();
      expect(button.style.outline).toBe('none');
    }
  });

  it('should handle View Details button hover styles', async () => {
    const user = userEvent.setup();
    renderAppointments();

    const viewDetailsButtons = screen.getAllByText('View Details');
    for (const btn of viewDetailsButtons) {
      const button = btn.closest('button')!;
      await user.hover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
      expect(button.style.color).toBe('var(--btn-primary-hover-fg)');

      await user.unhover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
      expect(button.style.color).toBe('var(--btn-primary-fg)');
    }
  });

  it('should handle View Details button focus/blur styles', () => {
    renderAppointments();

    const viewDetailsButtons = screen.getAllByText('View Details');
    for (const btn of viewDetailsButtons) {
      const button = btn.closest('button')!;
      button.focus();
      expect(button.style.outline).toContain('solid');

      button.blur();
      expect(button.style.outline).toBe('none');
    }
  });
});
