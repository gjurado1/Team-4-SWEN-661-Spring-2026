import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MedicationSchedule } from '../../app/pages/MedicationSchedule';
import { MemoryRouter } from 'react-router';

const renderMedicationSchedule = () =>
  render(
    <MemoryRouter>
      <MedicationSchedule />
    </MemoryRouter>,
  );

describe('MedicationSchedule', () => {
  it('should render the page heading', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Medication Schedule')).toBeVisible();
  });

  it('should render the back button', () => {
    renderMedicationSchedule();

    expect(screen.getByLabelText('Back')).toBeVisible();
  });

  it('should render the Add Medication button', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Add Medication')).toBeVisible();
  });

  it("should display today's schedule with the current date", () => {
    renderMedicationSchedule();

    const todayFormatted = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    expect(screen.getByText(`Today's Schedule • ${todayFormatted}`)).toBeVisible();
  });

  // --- Medication 1: Metformin ---

  it('should render Metformin medication entry', () => {
    renderMedicationSchedule();

    const metforminCard = screen.getByText('Metformin').closest('div.p-4');
    expect(metforminCard).toBeInTheDocument();
    expect(screen.getByText('Metformin')).toBeVisible();
    expect(within(metforminCard as HTMLElement).getByText('Dosage: 500mg')).toBeVisible();
    expect(within(metforminCard as HTMLElement).getByText('08:00 AM')).toBeVisible();
  });

  it('should show Metformin as scheduled with Patient Margaret Thompson', () => {
    renderMedicationSchedule();

    const metforminCard = screen.getByText('Metformin').closest('div.p-4');
    expect(within(metforminCard as HTMLElement).getByText('Patient: Margaret Thompson')).toBeVisible();
  });

  it('should show Metformin frequency as Daily', () => {
    renderMedicationSchedule();

    expect(screen.getAllByText('Daily').length).toBeGreaterThanOrEqual(1);
  });

  // --- Medication 2: Lisinopril ---

  it('should render Lisinopril medication entry', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Lisinopril')).toBeVisible();
    expect(screen.getByText('Dosage: 10mg')).toBeVisible();
  });

  // --- Medication 3: Pain Relief ---

  it('should render Pain Relief medication entry', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Pain Relief')).toBeVisible();
    expect(screen.getByText('Dosage: 400mg')).toBeVisible();
    expect(screen.getByText('12:00 PM')).toBeVisible();
  });

  it('should show Pain Relief patient as Robert Chen', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Patient: Robert Chen')).toBeVisible();
  });

  it('should show Pain Relief frequency as "As needed"', () => {
    renderMedicationSchedule();

    expect(screen.getByText('As needed')).toBeVisible();
  });

  // --- Medication 4: Aspirin ---

  it('should render Aspirin medication entry', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Aspirin')).toBeVisible();
    expect(screen.getByText('Dosage: 81mg')).toBeVisible();
    expect(screen.getByText('09:00 AM')).toBeVisible();
  });

  it('should show Aspirin patient as Maria Garcia', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Patient: Maria Garcia')).toBeVisible();
  });

  // --- Status badges ---

  it('should show 2 "Scheduled" badges for scheduled medications', () => {
    renderMedicationSchedule();

    const scheduledBadges = screen.getAllByText('Scheduled');
    expect(scheduledBadges).toHaveLength(2);
  });

  it('should show 2 "Completed" badges for completed medications', () => {
    renderMedicationSchedule();

    const completedBadges = screen.getAllByText('Completed');
    expect(completedBadges).toHaveLength(2);
  });

  // --- Mark Complete buttons ---

  it('should show "Mark Complete" buttons only for scheduled medications', () => {
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    expect(markCompleteButtons).toHaveLength(2);
  });

  it('should not show "Mark Complete" button for completed medications', () => {
    renderMedicationSchedule();

    // There are exactly 2 Mark Complete buttons (for Metformin and Pain Relief)
    // Lisinopril and Aspirin (completed) should NOT have them
    const markCompleteButtons = screen.getAllByText('Mark Complete');
    expect(markCompleteButtons).toHaveLength(2);
  });

  // --- Add Medication button hover ---

  it('should apply hover styles on Add Medication button mouseEnter', async () => {
    const user = userEvent.setup();
    renderMedicationSchedule();

    const addButton = screen.getByText('Add Medication').closest('button')!;
    await user.hover(addButton);

    expect(addButton.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(addButton.style.color).toBe('var(--btn-primary-hover-fg)');
  });

  it('should reset styles on Add Medication button mouseLeave', async () => {
    const user = userEvent.setup();
    renderMedicationSchedule();

    const addButton = screen.getByText('Add Medication').closest('button')!;
    await user.hover(addButton);
    await user.unhover(addButton);

    expect(addButton.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(addButton.style.color).toBe('var(--btn-primary-fg)');
  });

  // --- Add Medication button focus/blur ---

  it('should apply focus styles on Add Medication button focus', () => {
    renderMedicationSchedule();

    const addButton = screen.getByText('Add Medication').closest('button')!;
    addButton.focus();

    expect(addButton.style.outline).toContain('solid');
  });

  it('should remove focus styles on Add Medication button blur', () => {
    renderMedicationSchedule();

    const addButton = screen.getByText('Add Medication').closest('button')!;
    addButton.focus();
    addButton.blur();

    expect(addButton.style.outline).toBe('none');
  });

  // --- Mark Complete button hover ---

  it('should apply hover styles on Mark Complete button mouseEnter', async () => {
    const user = userEvent.setup();
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const firstButton = markCompleteButtons[0].closest('button')!;
    await user.hover(firstButton);

    expect(firstButton.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(firstButton.style.color).toBe('var(--btn-primary-hover-fg)');
  });

  it('should reset styles on Mark Complete button mouseLeave', async () => {
    const user = userEvent.setup();
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const firstButton = markCompleteButtons[0].closest('button')!;
    await user.hover(firstButton);
    await user.unhover(firstButton);

    expect(firstButton.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(firstButton.style.color).toBe('var(--btn-primary-fg)');
  });

  // --- Mark Complete button focus/blur ---

  it('should apply focus styles on Mark Complete button focus', () => {
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const firstButton = markCompleteButtons[0].closest('button')!;
    firstButton.focus();

    expect(firstButton.style.outline).toContain('solid');
  });

  it('should remove focus styles on Mark Complete button blur', () => {
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const firstButton = markCompleteButtons[0].closest('button')!;
    firstButton.focus();
    firstButton.blur();

    expect(firstButton.style.outline).toBe('none');
  });

  // --- Second Mark Complete button (Pain Relief) hover ---

  it('should apply hover styles on the second Mark Complete button mouseEnter', async () => {
    const user = userEvent.setup();
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const secondButton = markCompleteButtons[1].closest('button')!;
    await user.hover(secondButton);

    expect(secondButton.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(secondButton.style.color).toBe('var(--btn-primary-hover-fg)');
  });

  it('should reset styles on the second Mark Complete button mouseLeave', async () => {
    const user = userEvent.setup();
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const secondButton = markCompleteButtons[1].closest('button')!;
    await user.hover(secondButton);
    await user.unhover(secondButton);

    expect(secondButton.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(secondButton.style.color).toBe('var(--btn-primary-fg)');
  });

  // --- Second Mark Complete button focus/blur ---

  it('should apply focus styles on the second Mark Complete button focus', () => {
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const secondButton = markCompleteButtons[1].closest('button')!;
    secondButton.focus();

    expect(secondButton.style.outline).toContain('solid');
  });

  it('should remove focus styles on the second Mark Complete button blur', () => {
    renderMedicationSchedule();

    const markCompleteButtons = screen.getAllByText('Mark Complete');
    const secondButton = markCompleteButtons[1].closest('button')!;
    secondButton.focus();
    secondButton.blur();

    expect(secondButton.style.outline).toBe('none');
  });

  // --- All four medications render ---

  it('should render all four medication names', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Metformin')).toBeVisible();
    expect(screen.getByText('Lisinopril')).toBeVisible();
    expect(screen.getByText('Pain Relief')).toBeVisible();
    expect(screen.getByText('Aspirin')).toBeVisible();
  });

  it('should render all patient names', () => {
    renderMedicationSchedule();

    const margaretTexts = screen.getAllByText('Patient: Margaret Thompson');
    expect(margaretTexts.length).toBeGreaterThanOrEqual(1);
    expect(margaretTexts[0]).toBeVisible();
    expect(screen.getByText('Patient: Robert Chen')).toBeVisible();
    expect(screen.getByText('Patient: Maria Garcia')).toBeVisible();
  });

  it('should show Margaret Thompson twice since she has two medications', () => {
    renderMedicationSchedule();

    // Margaret Thompson appears for both Metformin and Lisinopril
    // But each card renders "Patient: Margaret Thompson" so there should be 2
    const margaretTexts = screen.getAllByText('Patient: Margaret Thompson');
    expect(margaretTexts).toHaveLength(2);
  });

  it('should render all dosage values', () => {
    renderMedicationSchedule();

    expect(screen.getByText('Dosage: 500mg')).toBeVisible();
    expect(screen.getByText('Dosage: 10mg')).toBeVisible();
    expect(screen.getByText('Dosage: 400mg')).toBeVisible();
    expect(screen.getByText('Dosage: 81mg')).toBeVisible();
  });

  it('should render all time values', () => {
    renderMedicationSchedule();

    // 08:00 AM appears twice (Metformin and Lisinopril)
    const eightAMs = screen.getAllByText('08:00 AM');
    expect(eightAMs).toHaveLength(2);
    expect(screen.getByText('12:00 PM')).toBeVisible();
    expect(screen.getByText('09:00 AM')).toBeVisible();
  });

  it('should render frequency values including "Daily" appearing 3 times', () => {
    renderMedicationSchedule();

    const dailyTexts = screen.getAllByText('Daily');
    expect(dailyTexts).toHaveLength(3);
    expect(screen.getByText('As needed')).toBeVisible();
  });
});
