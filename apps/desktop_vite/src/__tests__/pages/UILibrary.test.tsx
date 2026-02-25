import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UILibrary } from '../../app/pages/UILibrary';
import { MemoryRouter } from 'react-router';

function renderUILibrary() {
  return render(
    <MemoryRouter>
      <UILibrary />
    </MemoryRouter>
  );
}

describe('UILibrary', () => {
  // 1. Renders heading, subtitle, back button
  it('renders the heading, subtitle, and back button', () => {
    renderUILibrary();

    expect(screen.getByText('UI Component Library')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Complete design system showcasing all UI components with tokenized styling'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  // 2. Typography section headings
  it('renders typography section headings', () => {
    renderUILibrary();

    expect(screen.getByText('Typography')).toBeInTheDocument();
    expect(screen.getByText('Heading 1 - 3XL Bold')).toBeInTheDocument();
    expect(screen.getByText('Heading 2 - 2XL Semibold')).toBeInTheDocument();
    expect(screen.getByText('Heading 3 - XL Semibold')).toBeInTheDocument();
    expect(screen.getByText('Body Text - Base Normal')).toBeInTheDocument();
    expect(
      screen.getByText('Small Text - SM Normal (Secondary)')
    ).toBeInTheDocument();
  });

  // 3. Primary/Secondary/Danger button renders
  it('renders primary, secondary, and danger buttons', () => {
    renderUILibrary();

    expect(
      screen.getByRole('heading', { name: 'Primary Button' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Primary Action' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Secondary Button' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Secondary Action' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Danger Button' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete Action' })
    ).toBeInTheDocument();
  });

  // 4. Disabled buttons are disabled
  it('renders disabled buttons as disabled', () => {
    renderUILibrary();

    const disabledButtons = screen.getAllByRole('button', { name: 'Disabled' });
    expect(disabledButtons).toHaveLength(2);
    disabledButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  // 5. Primary Action button hover/focus/blur
  it('handles hover, focus, and blur on Primary Action button', async () => {
    const user = userEvent.setup();
    renderUILibrary();

    const button = screen.getByRole('button', { name: 'Primary Action' });

    await user.hover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(button.style.boxShadow).toBe('var(--shadow-md)');

    await user.unhover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(button.style.boxShadow).toBe('var(--shadow-sm)');

    await user.tab();
    // Find the focused button — tab order may vary, so focus directly
    button.focus();
    expect(button.style.outline).toBe('2px solid var(--focus-ring)');
    expect(button.style.outlineOffset).toBe('2px');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  // 6. Secondary Action button hover/focus/blur
  it('handles hover, focus, and blur on Secondary Action button', async () => {
    const user = userEvent.setup();
    renderUILibrary();

    const button = screen.getByRole('button', { name: 'Secondary Action' });

    await user.hover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');

    await user.unhover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-secondary-bg)');

    button.focus();
    expect(button.style.outline).toBe('2px solid var(--focus-ring)');
    expect(button.style.outlineOffset).toBe('2px');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  // 7. Delete Action button hover/focus/blur (filter brightness)
  it('handles hover, focus, and blur on Delete Action button', async () => {
    const user = userEvent.setup();
    renderUILibrary();

    const button = screen.getByRole('button', { name: 'Delete Action' });

    await user.hover(button);
    expect(button.style.filter).toBe('brightness(0.9)');

    await user.unhover(button);
    expect(button.style.filter).toBe('brightness(1)');

    button.focus();
    expect(button.style.outline).toBe('2px solid var(--focus-ring)');
    expect(button.style.outlineOffset).toBe('2px');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  // 8. Text input renders with placeholder, focus/blur
  it('renders text input with placeholder and handles focus/blur', () => {
    renderUILibrary();

    const input = screen.getByPlaceholderText('Enter text...');
    expect(input).toBeInTheDocument();
    expect(screen.getByLabelText('Text Input')).toBeInTheDocument();

    input.focus();
    expect(input.style.outline).toBe('2px solid var(--focus-ring)');
    expect(input.style.borderColor).toBe('var(--focus-ring)');

    input.blur();
    expect(input.style.outline).toBe('none');
    expect(input.style.borderColor).toBe('var(--input-border)');
  });

  // 9. Checkbox toggle
  it('toggles the checkbox when clicked', async () => {
    const user = userEvent.setup();
    renderUILibrary();

    const checkbox = screen.getByRole('checkbox', { name: /Checkbox Option/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  // 10. Radio button selection
  it('selects radio buttons when clicked', async () => {
    const user = userEvent.setup();
    renderUILibrary();

    const radios = screen.getAllByRole('radio');
    const option1 = radios[0];
    const option2 = radios[1];

    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();

    await user.click(option2);
    expect(option2).toBeChecked();
    expect(option1).not.toBeChecked();

    await user.click(option1);
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();
  });

  // 11. Select dropdown change
  it('changes value when selecting a dropdown option', async () => {
    const user = userEvent.setup();
    renderUILibrary();

    const select = screen.getByLabelText('Select Dropdown');
    expect(select).toHaveValue('option1');

    await user.selectOptions(select, 'option2');
    expect(select).toHaveValue('option2');

    await user.selectOptions(select, 'option3');
    expect(select).toHaveValue('option3');
  });

  // 12. Range slider change
  it('updates the range slider value on change', async () => {
    renderUILibrary();

    const slider = screen.getByLabelText(/Range Slider: 50/);
    expect(slider).toHaveValue('50');

    // fireEvent is needed for range inputs since userEvent doesn't fully support them
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.change(slider, { target: { value: '75' } });

    expect(screen.getByLabelText(/Range Slider: 75/)).toBeInTheDocument();
    expect(slider).toHaveValue('75');
  });

  // 13. Icon labels render
  it('renders all icon labels', () => {
    renderUILibrary();

    const iconLabels = [
      'Users',
      'Pill',
      'Calendar',
      'Settings',
      'Help',
      'Mail',
      'Search',
      'Bell',
      'Menu',
      'Close',
      'Check',
      'Alert',
    ];

    iconLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  // 14. Card headings render
  it('renders card headings', () => {
    renderUILibrary();

    expect(screen.getByText('Cards & Surfaces')).toBeInTheDocument();
    expect(screen.getByText('Card with Shadow SM')).toBeInTheDocument();
    expect(screen.getByText('Card with Shadow MD')).toBeInTheDocument();
    expect(screen.getByText('Card with Shadow LG')).toBeInTheDocument();
  });

  // 15. Alert types render
  it('renders all alert types', () => {
    renderUILibrary();

    expect(
      screen.getByText('Alerts & Notifications')
    ).toBeInTheDocument();
    expect(screen.getByText('Information')).toBeInTheDocument();
    // Success, Warning, Danger appear in both Alerts and Color Tokens sections
    expect(screen.getAllByText('Success').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Warning').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Danger').length).toBeGreaterThanOrEqual(1);
  });

  // 16. Color token labels render
  it('renders all color token labels', () => {
    renderUILibrary();

    expect(screen.getByText('Color Tokens')).toBeInTheDocument();

    const colorTokensSection = screen
      .getByRole('heading', { name: 'Color Tokens' })
      .closest('section');
    expect(colorTokensSection).toBeInTheDocument();

    const tokenLabels = [
      'Background',
      'Surface',
      'Text',
      'Text Secondary',
      'Border',
      'Primary Button',
      'Success',
      'Warning',
      'Danger',
      'Info',
      'Focus Ring',
      'Toolbar BG',
    ];

    tokenLabels.forEach((label) => {
      expect(within(colorTokensSection!).getByText(label)).toBeInTheDocument();
    });
  });
});
