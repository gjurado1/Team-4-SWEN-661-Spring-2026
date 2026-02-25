import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Overview } from '../../app/pages/Overview';
import { UserProvider } from '../../app/contexts/UserContext';
import { MemoryRouter } from 'react-router';

const renderOverview = () =>
  render(
    <MemoryRouter>
      <UserProvider>
        <Overview />
      </UserProvider>
    </MemoryRouter>,
  );

describe('Overview', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── Back Button ──────────────────────────────────────────────────────

  it('should render the back button', () => {
    renderOverview();

    expect(screen.getByLabelText('Back')).toBeVisible();
  });

  // ── Greeting ─────────────────────────────────────────────────────────

  it('should greet with "there" when no userName is set', () => {
    renderOverview();

    expect(screen.getByText('Good morning, there')).toBeVisible();
  });

  it('should greet with the stored userName when one exists', () => {
    localStorage.setItem('careconnect-user-name', 'Alice');

    renderOverview();

    expect(screen.getByText('Good morning, Alice')).toBeVisible();
  });

  it('should fall back to "there" when userName is only whitespace', () => {
    localStorage.setItem('careconnect-user-name', '   ');

    renderOverview();

    expect(screen.getByText('Good morning, there')).toBeVisible();
  });

  it('should show the task summary text', () => {
    renderOverview();

    expect(
      screen.getByText('You have 4 tasks scheduled for today'),
    ).toBeVisible();
  });

  // ── Tip Card ─────────────────────────────────────────────────────────

  it('should show the tip card by default', () => {
    renderOverview();

    expect(screen.getByText('Tip')).toBeVisible();
    expect(
      screen.getByText(
        'The radial MENU button is draggable. Move it anywhere on the screen that works best for you.',
      ),
    ).toBeVisible();
  });

  it('should hide the tip card when localStorage has it dismissed', () => {
    localStorage.setItem('careconnect-menu-tip-dismissed', 'true');

    renderOverview();

    expect(screen.queryByText('Tip')).not.toBeInTheDocument();
  });

  it('should dismiss the tip card when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    renderOverview();

    const dismissButton = screen.getByLabelText('Dismiss menu tip');
    expect(dismissButton).toBeVisible();

    await user.click(dismissButton);

    expect(screen.queryByText('Tip')).not.toBeInTheDocument();
    expect(localStorage.getItem('careconnect-menu-tip-dismissed')).toBe(
      'true',
    );
  });

  // ── Stats Grid ───────────────────────────────────────────────────────

  describe('Stats Grid', () => {
    const statCards = [
      { label: 'Active Care Plans', value: '3' },
      { label: 'This Week Appointments', value: '5' },
      { label: 'Care Contacts', value: '12' },
      { label: 'Medications', value: '8' },
    ];

    it.each(statCards)(
      'should render "$label" stat card with value $value',
      ({ label, value }) => {
        renderOverview();

        expect(screen.getByText(label)).toBeVisible();
        expect(screen.getByText(value)).toBeVisible();
      },
    );

    it('should apply hover styles on mouseEnter and reset on mouseLeave for stat cards', () => {
      renderOverview();

      const carePlansLabel = screen.getByText('Active Care Plans');
      // The stat card container is the grandparent of the label text
      const card = carePlansLabel.closest('[class*="rounded-lg"]') as HTMLElement;

      fireEvent.mouseEnter(card);
      expect(card.style.boxShadow).toBe('var(--shadow-panel)');
      expect(card.style.transform).toBe('translateY(-2px)');

      fireEvent.mouseLeave(card);
      expect(card.style.boxShadow).toBe('var(--shadow-sm)');
      expect(card.style.transform).toBe('translateY(0)');
    });
  });

  // ── Today's Schedule ─────────────────────────────────────────────────

  describe("Today's Schedule", () => {
    it('should render the section heading', () => {
      renderOverview();

      expect(screen.getByText("Today's Schedule")).toBeVisible();
    });

    const tasks = [
      { name: 'Morning Medication', time: '9:00 AM' },
      { name: 'Doctor Appointment - Dr. Smith', time: '10:30 AM' },
      { name: 'Physical Therapy Session', time: '2:00 PM' },
      { name: 'Evening Medication', time: '6:00 PM' },
    ];

    it.each(tasks)(
      'should render task "$name" with time $time',
      ({ name, time }) => {
        renderOverview();

        expect(screen.getByText(name)).toBeVisible();
        expect(screen.getByText(time)).toBeVisible();
      },
    );

    it('should apply hover background on mouseEnter and reset on mouseLeave for task rows', () => {
      renderOverview();

      const taskText = screen.getByText('Morning Medication');
      const taskRow = taskText.closest('[class*="rounded-lg"]') as HTMLElement;

      fireEvent.mouseEnter(taskRow);
      expect(taskRow.style.backgroundColor).toBe('var(--menu-hover-bg)');

      fireEvent.mouseLeave(taskRow);
      expect(taskRow.style.backgroundColor).toBe('var(--color-panel)');
    });

    it('should render the "View All" button', () => {
      renderOverview();

      expect(screen.getByText('View All')).toBeVisible();
    });

    it('should apply hover styles on the "View All" button', () => {
      renderOverview();

      const viewAllButton = screen.getByText('View All');

      fireEvent.mouseEnter(viewAllButton);
      expect(viewAllButton.style.backgroundColor).toBe(
        'var(--btn-secondary-hover-bg)',
      );
      expect(viewAllButton.style.color).toBe('var(--btn-secondary-hover-fg)');

      fireEvent.mouseLeave(viewAllButton);
      expect(viewAllButton.style.backgroundColor).toBe(
        'var(--btn-secondary-bg)',
      );
      expect(viewAllButton.style.color).toBe('var(--btn-secondary-fg)');
    });
  });

  // ── Quick Actions ────────────────────────────────────────────────────

  describe('Quick Actions', () => {
    it('should render the section heading', () => {
      renderOverview();

      expect(screen.getByText('Quick Actions')).toBeVisible();
    });

    const actions = [
      'Add Medication',
      'Schedule Appointment',
      'Update Care Plan',
      'Contact Provider',
    ];

    it.each(actions)('should render "%s" button', (actionLabel) => {
      renderOverview();

      expect(screen.getByText(actionLabel)).toBeVisible();
    });

    it('should apply hover background on mouseEnter and reset on mouseLeave for quick action buttons', () => {
      renderOverview();

      const actionButton = screen.getByText('Add Medication').closest(
        'button',
      ) as HTMLElement;

      fireEvent.mouseEnter(actionButton);
      expect(actionButton.style.backgroundColor).toBe('var(--menu-hover-bg)');

      fireEvent.mouseLeave(actionButton);
      expect(actionButton.style.backgroundColor).toBe('var(--color-panel)');
    });
  });

  // ── Health Summary ───────────────────────────────────────────────────

  describe('Health Summary', () => {
    it('should render the section heading', () => {
      renderOverview();

      expect(screen.getByText('Health Summary')).toBeVisible();
    });

    it('should render Medication Adherence at 92%', () => {
      renderOverview();

      expect(screen.getByText('Medication Adherence')).toBeVisible();
      expect(screen.getByText('92%')).toBeVisible();
    });

    it('should render Appointment Completion at 100%', () => {
      renderOverview();

      expect(screen.getByText('Appointment Completion')).toBeVisible();
      expect(screen.getByText('100%')).toBeVisible();
    });
  });
});
