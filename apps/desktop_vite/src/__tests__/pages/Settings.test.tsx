import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from '../../app/pages/Settings';
import { MemoryRouter } from 'react-router';
import { announce } from '../../app/components/ScreenReaderAnnouncer';
import { vi } from 'vitest';

vi.mock('../../app/components/ScreenReaderAnnouncer', () => ({
  announce: vi.fn(),
}));

const renderSettings = (props: { onThemeChange?: (theme: string) => void; currentTheme?: string } = {}) => {
  return render(
    <MemoryRouter>
      <Settings {...props} />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('Settings Page', () => {
  // 1. Renders heading, subtitle, back button
  describe('Header and navigation', () => {
    it('renders the heading "Settings & Preferences"', () => {
      renderSettings();
      expect(screen.getByText('Settings & Preferences')).toBeInTheDocument();
    });

    it('renders the subtitle "Customize your CareConnect experience"', () => {
      renderSettings();
      expect(screen.getByText('Customize your CareConnect experience')).toBeInTheDocument();
    });

    it('renders the back button', () => {
      renderSettings();
      expect(screen.getByLabelText('Back')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  // 2. Profile Settings inputs render with default values
  describe('Profile Settings', () => {
    it('renders Full Name input with default value "Sarah Johnson"', () => {
      renderSettings();
      const nameInput = screen.getByDisplayValue('Sarah Johnson');
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
    });

    it('renders Email input with default value "sarah.johnson@careconnect.com"', () => {
      renderSettings();
      const emailInput = screen.getByDisplayValue('sarah.johnson@careconnect.com');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders the "Profile Settings" section heading', () => {
      renderSettings();
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    });
  });

  // 3. Profile input focus/blur handlers
  describe('Profile input focus/blur handlers', () => {
    it('applies focus styles on Full Name input focus and removes on blur', () => {
      renderSettings();
      const nameInput = screen.getByDisplayValue('Sarah Johnson');

      fireEvent.focus(nameInput);
      expect(nameInput.style.borderColor).toBe('var(--input-border-focus)');
      expect(nameInput.style.outline).toContain('var(--focus-ring-color)');
      expect(nameInput.style.outlineOffset).toBe('var(--focus-ring-offset)');

      fireEvent.blur(nameInput);
      expect(nameInput.style.borderColor).toBe('var(--input-border)');
      expect(nameInput.style.outline).toBe('none');
    });

    it('applies focus styles on Email input focus and removes on blur', () => {
      renderSettings();
      const emailInput = screen.getByDisplayValue('sarah.johnson@careconnect.com');

      fireEvent.focus(emailInput);
      expect(emailInput.style.borderColor).toBe('var(--input-border-focus)');
      expect(emailInput.style.outline).toContain('var(--focus-ring-color)');

      fireEvent.blur(emailInput);
      expect(emailInput.style.borderColor).toBe('var(--input-border)');
      expect(emailInput.style.outline).toBe('none');
    });
  });

  // 4. Text Size slider renders with 100%
  describe('Text Size slider', () => {
    it('renders the Text Size label', () => {
      renderSettings();
      expect(screen.getByText('Text Size')).toBeInTheDocument();
    });

    it('displays the initial text scale as 100%', () => {
      renderSettings();
      expect(screen.getAllByText('100%').length).toBeGreaterThanOrEqual(1);
    });

    it('renders a range input with min 100, max 250, step 10', () => {
      renderSettings();
      const sliders = screen.getAllByRole('slider');
      const textSlider = sliders[0];
      expect(textSlider).toHaveAttribute('min', '100');
      expect(textSlider).toHaveAttribute('max', '250');
      expect(textSlider).toHaveAttribute('step', '10');
      expect(textSlider).toHaveValue('100');
    });

    it('updates the displayed percentage when slider value changes', () => {
      renderSettings();
      const sliders = screen.getAllByRole('slider');
      const textSlider = sliders[0];

      fireEvent.change(textSlider, { target: { value: '150' } });
      expect(screen.getAllByText('150%').length).toBeGreaterThanOrEqual(1);
    });
  });

  // 5. Radial Menu Size slider
  describe('Radial Menu Size slider', () => {
    it('renders the Radial Menu Size label', () => {
      renderSettings();
      expect(screen.getByText('Radial Menu Size')).toBeInTheDocument();
    });

    it('renders a range input with min 100, max 250, step 10', () => {
      renderSettings();
      const sliders = screen.getAllByRole('slider');
      const radialSlider = sliders[1];
      expect(radialSlider).toHaveAttribute('min', '100');
      expect(radialSlider).toHaveAttribute('max', '250');
      expect(radialSlider).toHaveAttribute('step', '10');
      expect(radialSlider).toHaveValue('100');
    });

    it('updates the displayed percentage when slider value changes', () => {
      renderSettings();
      const sliders = screen.getAllByRole('slider');
      const radialSlider = sliders[1];

      fireEvent.change(radialSlider, { target: { value: '200' } });
      expect(screen.getAllByText('200%').length).toBeGreaterThanOrEqual(1);
    });
  });

  // 6. Toolbar Icon Size slider
  describe('Toolbar Icon Size slider', () => {
    it('renders the Toolbar Icon Size label', () => {
      renderSettings();
      expect(screen.getByText('Toolbar Icon Size')).toBeInTheDocument();
    });

    it('renders a range input with min 100, max 150, step 5 and proper aria-label', () => {
      renderSettings();
      const toolbarSlider = screen.getByLabelText('Toolbar icon size slider from 100% to 150%');
      expect(toolbarSlider).toBeInTheDocument();
      expect(toolbarSlider).toHaveAttribute('min', '100');
      expect(toolbarSlider).toHaveAttribute('max', '150');
      expect(toolbarSlider).toHaveAttribute('step', '5');
      expect(toolbarSlider).toHaveValue('100');
    });

    it('updates the displayed percentage when slider value changes', () => {
      renderSettings();
      const toolbarSlider = screen.getByLabelText('Toolbar icon size slider from 100% to 150%');

      fireEvent.change(toolbarSlider, { target: { value: '125' } });
      expect(screen.getAllByText('125%').length).toBeGreaterThanOrEqual(1);
    });

    it('saves toolbar icon scale to localStorage on change', () => {
      renderSettings();
      const toolbarSlider = screen.getByLabelText('Toolbar icon size slider from 100% to 150%');

      fireEvent.change(toolbarSlider, { target: { value: '130' } });
      expect(localStorage.getItem('careconnect-toolbar-icon-scale')).toBe('130');
    });
  });

  // 7. Theme buttons render, clicking calls onThemeChange
  describe('Theme buttons', () => {
    it('renders all three theme buttons', () => {
      renderSettings();
      expect(screen.getByText('Warm Care')).toBeInTheDocument();
      expect(screen.getByText('Medical Blue')).toBeInTheDocument();
      expect(screen.getByText('Deep Focus Purple')).toBeInTheDocument();
    });

    it('renders the "Choose Theme" label', () => {
      renderSettings();
      expect(screen.getByText('Choose Theme')).toBeInTheDocument();
    });

    it('calls onThemeChange with "warm" when Warm Care is clicked', async () => {
      const onThemeChange = vi.fn();
      renderSettings({ onThemeChange });
      const user = userEvent.setup();

      await user.click(screen.getByText('Warm Care'));
      expect(onThemeChange).toHaveBeenCalledWith('warm');
    });

    it('calls onThemeChange with "medical" when Medical Blue is clicked', async () => {
      const onThemeChange = vi.fn();
      renderSettings({ onThemeChange });
      const user = userEvent.setup();

      await user.click(screen.getByText('Medical Blue'));
      expect(onThemeChange).toHaveBeenCalledWith('medical');
    });

    it('calls onThemeChange with "dark" when Deep Focus Purple is clicked', async () => {
      const onThemeChange = vi.fn();
      renderSettings({ onThemeChange });
      const user = userEvent.setup();

      await user.click(screen.getByText('Deep Focus Purple'));
      expect(onThemeChange).toHaveBeenCalledWith('dark');
    });

    it('calls announce when a theme button is clicked', async () => {
      const onThemeChange = vi.fn();
      renderSettings({ onThemeChange });
      const user = userEvent.setup();

      await user.click(screen.getByText('Medical Blue'));
      expect(announce).toHaveBeenCalledWith('Theme changed to Medical Blue', 'polite');
    });
  });

  // 8. Theme button aria-pressed state
  describe('Theme button aria-pressed state', () => {
    it('sets aria-pressed=true on the current theme button (default warm)', () => {
      renderSettings();
      const warmButton = screen.getByText('Warm Care').closest('button')!;
      const medicalButton = screen.getByText('Medical Blue').closest('button')!;
      const darkButton = screen.getByText('Deep Focus Purple').closest('button')!;

      expect(warmButton).toHaveAttribute('aria-pressed', 'true');
      expect(medicalButton).toHaveAttribute('aria-pressed', 'false');
      expect(darkButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('sets aria-pressed=true on medical theme when currentTheme is "medical"', () => {
      renderSettings({ currentTheme: 'medical' });
      const warmButton = screen.getByText('Warm Care').closest('button')!;
      const medicalButton = screen.getByText('Medical Blue').closest('button')!;
      const darkButton = screen.getByText('Deep Focus Purple').closest('button')!;

      expect(warmButton).toHaveAttribute('aria-pressed', 'false');
      expect(medicalButton).toHaveAttribute('aria-pressed', 'true');
      expect(darkButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('sets aria-pressed=true on dark theme when currentTheme is "dark"', () => {
      renderSettings({ currentTheme: 'dark' });
      const darkButton = screen.getByText('Deep Focus Purple').closest('button')!;

      expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // 9. Theme button focus/blur
  describe('Theme button focus/blur handlers', () => {
    it('applies focus outline on theme button focus and removes on blur', () => {
      renderSettings();
      const warmButton = screen.getByText('Warm Care').closest('button')!;

      fireEvent.focus(warmButton);
      expect(warmButton.style.outline).toContain('var(--focus-ring-color)');
      expect(warmButton.style.outlineOffset).toBe('var(--focus-ring-offset)');

      fireEvent.blur(warmButton);
      expect(warmButton.style.outline).toBe('none');
    });
  });

  // 10. Screen Reader checkbox toggle
  describe('Screen Reader Announcements checkbox', () => {
    it('renders as checked by default', () => {
      renderSettings();
      const checkbox = screen.getByLabelText('Enable or disable screen reader announcements');
      expect(checkbox).toBeChecked();
    });

    it('toggles off when clicked', async () => {
      renderSettings();
      const user = userEvent.setup();
      const checkbox = screen.getByLabelText('Enable or disable screen reader announcements');

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('persists screen reader setting to localStorage', async () => {
      renderSettings();
      const user = userEvent.setup();
      const checkbox = screen.getByLabelText('Enable or disable screen reader announcements');

      await user.click(checkbox);
      expect(localStorage.getItem('careconnect-screen-reader-enabled')).toBe('false');
    });

    it('renders the "Enable Screen Reader Announcements" text', () => {
      renderSettings();
      expect(screen.getByText('Enable Screen Reader Announcements')).toBeInTheDocument();
    });
  });

  // 11. Voice Commands checkbox toggle
  describe('Voice Commands checkbox', () => {
    it('renders as unchecked by default', () => {
      renderSettings();
      const checkbox = screen.getByLabelText('Enable or disable voice commands');
      expect(checkbox).not.toBeChecked();
    });

    it('toggles on when clicked', async () => {
      renderSettings();
      const user = userEvent.setup();
      const checkbox = screen.getByLabelText('Enable or disable voice commands');

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('persists voice commands setting to localStorage', async () => {
      renderSettings();
      const user = userEvent.setup();
      const checkbox = screen.getByLabelText('Enable or disable voice commands');

      await user.click(checkbox);
      expect(localStorage.getItem('careconnect-voice-commands-enabled')).toBe('true');
    });

    it('renders the "Enable Voice Commands" text', () => {
      renderSettings();
      expect(screen.getByText('Enable Voice Commands')).toBeInTheDocument();
    });
  });

  // 12. Open in New Tabs checkbox toggle
  describe('Open Radial Menu Navigation in New Tabs checkbox', () => {
    it('renders as unchecked by default', () => {
      renderSettings();
      const checkbox = screen.getByLabelText('Enable or disable opening menu navigation in new tabs');
      expect(checkbox).not.toBeChecked();
    });

    it('toggles on when clicked', async () => {
      renderSettings();
      const user = userEvent.setup();
      const checkbox = screen.getByLabelText('Enable or disable opening menu navigation in new tabs');

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('persists setting to localStorage', async () => {
      renderSettings();
      const user = userEvent.setup();
      const checkbox = screen.getByLabelText('Enable or disable opening menu navigation in new tabs');

      await user.click(checkbox);
      expect(localStorage.getItem('careconnect-menu-navigation-new-tab')).toBe('true');
    });

    it('renders the "Navigation Behavior" section heading', () => {
      renderSettings();
      expect(screen.getByText('Navigation Behavior')).toBeInTheDocument();
    });

    it('renders the "Open Radial Menu Navigation in New Tabs" text', () => {
      renderSettings();
      expect(screen.getByText('Open Radial Menu Navigation in New Tabs')).toBeInTheDocument();
    });
  });

  // 13. Notification checkboxes render
  describe('Notification checkboxes', () => {
    it('renders the "Notifications" section heading', () => {
      renderSettings();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('renders Medication reminders checkbox (checked by default)', () => {
      renderSettings();
      const label = screen.getByText('Medication reminders');
      expect(label).toBeInTheDocument();
      const checkbox = label.closest('label')!.querySelector('input[type="checkbox"]')!;
      expect(checkbox).toBeChecked();
    });

    it('renders Appointment alerts checkbox (checked by default)', () => {
      renderSettings();
      const label = screen.getByText('Appointment alerts');
      expect(label).toBeInTheDocument();
      const checkbox = label.closest('label')!.querySelector('input[type="checkbox"]')!;
      expect(checkbox).toBeChecked();
    });

    it('renders Email notifications checkbox (unchecked by default)', () => {
      renderSettings();
      const label = screen.getByText('Email notifications');
      expect(label).toBeInTheDocument();
      const checkbox = label.closest('label')!.querySelector('input[type="checkbox"]')!;
      expect(checkbox).not.toBeChecked();
    });
  });

  // 14. Change Password button hover/focus/blur
  describe('Change Password button', () => {
    it('renders the Change Password button', () => {
      renderSettings();
      expect(screen.getByText('Change Password')).toBeInTheDocument();
    });

    it('renders the "Security" section heading', () => {
      renderSettings();
      expect(screen.getByText('Security')).toBeInTheDocument();
    });

    it('applies hover styles on mouseEnter and reverts on mouseLeave', () => {
      renderSettings();
      const button = screen.getByText('Change Password');

      fireEvent.mouseEnter(button);
      expect(button.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
      expect(button.style.color).toBe('var(--btn-secondary-hover-fg)');

      fireEvent.mouseLeave(button);
      expect(button.style.backgroundColor).toBe('var(--btn-secondary-bg)');
      expect(button.style.color).toBe('var(--btn-secondary-fg)');
    });

    it('applies focus outline on focus and removes on blur', () => {
      renderSettings();
      const button = screen.getByText('Change Password');

      fireEvent.focus(button);
      expect(button.style.outline).toContain('var(--focus-ring-color)');
      expect(button.style.outlineOffset).toBe('var(--focus-ring-offset)');

      fireEvent.blur(button);
      expect(button.style.outline).toBe('none');
    });
  });

  // 15. Save Changes button hover/focus/blur and click calls announce
  describe('Save Changes button', () => {
    it('renders the Save Changes button with correct aria-label', () => {
      renderSettings();
      const button = screen.getByLabelText('Save all settings changes');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });

    it('calls announce with "Settings saved successfully" when clicked', async () => {
      renderSettings();
      const user = userEvent.setup();
      const button = screen.getByLabelText('Save all settings changes');

      await user.click(button);
      expect(announce).toHaveBeenCalledWith('Settings saved successfully', 'polite');
    });

    it('applies hover styles on mouseEnter and reverts on mouseLeave', () => {
      renderSettings();
      const button = screen.getByLabelText('Save all settings changes');

      fireEvent.mouseEnter(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
      expect(button.style.color).toBe('var(--btn-primary-hover-fg)');
      expect(button.style.boxShadow).toBe('var(--shadow-panel)');

      fireEvent.mouseLeave(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
      expect(button.style.color).toBe('var(--btn-primary-fg)');
      expect(button.style.boxShadow).toBe('var(--shadow-sm)');
    });

    it('applies focus outline on focus and removes on blur', () => {
      renderSettings();
      const button = screen.getByLabelText('Save all settings changes');

      fireEvent.focus(button);
      expect(button.style.outline).toContain('var(--focus-ring-color)');
      expect(button.style.outlineOffset).toBe('var(--focus-ring-offset)');

      fireEvent.blur(button);
      expect(button.style.outline).toBe('none');
    });
  });

  // 16. Slider focus/blur handlers
  describe('Slider focus/blur handlers', () => {
    it('applies focus outline on Text Size slider focus and removes on blur', () => {
      renderSettings();
      const sliders = screen.getAllByRole('slider');
      const textSlider = sliders[0];

      fireEvent.focus(textSlider);
      expect(textSlider.style.outline).toContain('var(--focus-ring-color)');
      expect(textSlider.style.outlineOffset).toBe('var(--focus-ring-offset)');

      fireEvent.blur(textSlider);
      expect(textSlider.style.outline).toBe('none');
    });

    it('applies focus outline on Radial Menu Size slider focus and removes on blur', () => {
      renderSettings();
      const sliders = screen.getAllByRole('slider');
      const radialSlider = sliders[1];

      fireEvent.focus(radialSlider);
      expect(radialSlider.style.outline).toContain('var(--focus-ring-color)');
      expect(radialSlider.style.outlineOffset).toBe('var(--focus-ring-offset)');

      fireEvent.blur(radialSlider);
      expect(radialSlider.style.outline).toBe('none');
    });

    it('applies focus outline on Toolbar Icon Size slider focus and removes on blur', () => {
      renderSettings();
      const toolbarSlider = screen.getByLabelText('Toolbar icon size slider from 100% to 150%');

      fireEvent.focus(toolbarSlider);
      expect(toolbarSlider.style.outline).toContain('var(--focus-ring-color)');
      expect(toolbarSlider.style.outlineOffset).toBe('var(--focus-ring-offset)');

      fireEvent.blur(toolbarSlider);
      expect(toolbarSlider.style.outline).toBe('none');
    });
  });

  // Additional: Shortcut tip text
  describe('Shortcut tip', () => {
    it('renders the shortcut tip text', () => {
      renderSettings();
      expect(screen.getByText('Shortcut: use Alt+T to cycle themes quickly.')).toBeInTheDocument();
    });
  });

  // Additional: Accessibility & Voice section heading
  describe('Accessibility & Voice section', () => {
    it('renders the "Accessibility & Voice" section heading', () => {
      renderSettings();
      expect(screen.getByText('Accessibility & Voice')).toBeInTheDocument();
    });
  });
});
