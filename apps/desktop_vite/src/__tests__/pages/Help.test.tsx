import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Help } from '../../app/pages/Help';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderHelp = () =>
  render(
    <MemoryRouter>
      <Help />
    </MemoryRouter>,
  );

describe('Help', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ── Header ──────────────────────────────────────────────────────────

  it('should render the back button', () => {
    renderHelp();

    expect(screen.getByLabelText('Back')).toBeVisible();
  });

  it('should render the page heading', () => {
    renderHelp();

    expect(screen.getByText('Help & Support')).toBeVisible();
  });

  it('should render the subtitle', () => {
    renderHelp();

    expect(screen.getByText('Get assistance and learn more about CareConnect')).toBeVisible();
  });

  // ── Keyboard Shortcuts section ──────────────────────────────────────

  it('should render the Keyboard Shortcuts heading', () => {
    renderHelp();

    expect(screen.getByText('Keyboard Shortcuts')).toBeVisible();
  });

  it('should render all four keyboard shortcuts with descriptions', () => {
    renderHelp();

    expect(screen.getByText('Alt + T')).toBeVisible();
    expect(screen.getByText('Toggle theme switcher')).toBeVisible();

    expect(screen.getByText('Ctrl + /')).toBeVisible();
    expect(screen.getByText('Keyboard shortcuts')).toBeVisible();

    expect(screen.getByText('F1')).toBeVisible();
    expect(screen.getByText('Help documentation')).toBeVisible();

    expect(screen.getByText('Esc')).toBeVisible();
    expect(screen.getByText('Close dialog or go back')).toBeVisible();
  });

  it('should render shortcut keys inside kbd elements', () => {
    renderHelp();

    const altT = screen.getByText('Alt + T');
    expect(altT.tagName).toBe('KBD');

    const ctrlSlash = screen.getByText('Ctrl + /');
    expect(ctrlSlash.tagName).toBe('KBD');

    const f1 = screen.getByText('F1');
    expect(f1.tagName).toBe('KBD');

    const esc = screen.getByText('Esc');
    expect(esc.tagName).toBe('KBD');
  });

  it('should navigate to /dashboard/shortcuts when "View All Shortcuts" is clicked', async () => {
    const user = userEvent.setup();
    renderHelp();

    await user.click(screen.getByText('View All Shortcuts'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/shortcuts');
  });

  it('should handle "View All Shortcuts" button hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    const button = screen.getByText('View All Shortcuts').closest('button')!;
    await user.hover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(button.style.color).toBe('var(--btn-primary-hover-fg)');

    await user.unhover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(button.style.color).toBe('var(--btn-primary-fg)');
  });

  it('should handle "View All Shortcuts" button focus/blur styles', () => {
    renderHelp();

    const button = screen.getByText('View All Shortcuts').closest('button')!;
    button.focus();
    expect(button.style.outline).toContain('solid');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  // ── Accessibility Features section ──────────────────────────────────

  it('should render the Accessibility Features heading', () => {
    renderHelp();

    expect(screen.getByRole('heading', { name: 'Accessibility Features' })).toBeVisible();
  });

  it('should render all 8 accessibility feature list items', () => {
    renderHelp();

    expect(screen.getByText('Screen Reader Support:')).toBeVisible();
    expect(screen.getByText('Keyboard Navigation:')).toBeVisible();
    expect(screen.getByText('Skip Links:')).toBeVisible();
    expect(screen.getByText('Adjustable Text Size:')).toBeVisible();
    expect(screen.getByText('Adjustable UI Elements:')).toBeVisible();
    expect(screen.getByText('High Contrast Themes:')).toBeVisible();
    expect(screen.getByText('Focus Management:')).toBeVisible();
    expect(screen.getByText('Live Regions:')).toBeVisible();
  });

  it('should render accessibility feature descriptions', () => {
    renderHelp();

    expect(screen.getByText(/Full ARIA labels, roles, and landmarks/)).toBeVisible();
    expect(screen.getByText(/Complete keyboard-only navigation/)).toBeVisible();
    expect(screen.getByText(/Press Tab on page load/)).toBeVisible();
    expect(screen.getByText(/Scale text from 100% to 250%/)).toBeVisible();
    expect(screen.getByText(/Resize radial menu/)).toBeVisible();
    expect(screen.getByText(/WCAG-compliant color contrast ratios/)).toBeVisible();
    expect(screen.getByText(/Clear focus indicators with customizable focus rings/)).toBeVisible();
    expect(screen.getByText(/Screen reader announcements for dynamic content/)).toBeVisible();
  });

  it('should navigate to /dashboard/settings when "Adjust Accessibility Settings" is clicked', async () => {
    const user = userEvent.setup();
    renderHelp();

    await user.click(screen.getByText('Adjust Accessibility Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/settings');
  });

  it('should have correct aria-label on "Adjust Accessibility Settings" button', () => {
    renderHelp();

    expect(
      screen.getByLabelText('Go to Settings to adjust accessibility features'),
    ).toBeVisible();
  });

  it('should handle "Adjust Accessibility Settings" button hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    const button = screen.getByText('Adjust Accessibility Settings').closest('button')!;
    await user.hover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
    expect(button.style.color).toBe('var(--btn-secondary-hover-fg)');

    await user.unhover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-secondary-bg)');
    expect(button.style.color).toBe('var(--btn-secondary-fg)');
  });

  it('should handle "Adjust Accessibility Settings" button focus/blur styles', () => {
    renderHelp();

    const button = screen.getByText('Adjust Accessibility Settings').closest('button')!;
    button.focus();
    expect(button.style.outline).toContain('solid');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  it('should navigate to /dashboard/accessibility-annotations when "View WCAG Compliance Documentation" is clicked', async () => {
    const user = userEvent.setup();
    renderHelp();

    await user.click(screen.getByText('View WCAG Compliance Documentation'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/accessibility-annotations');
  });

  it('should have correct aria-label on "View WCAG Compliance Documentation" button', () => {
    renderHelp();

    expect(
      screen.getByLabelText('View detailed accessibility compliance documentation'),
    ).toBeVisible();
  });

  it('should handle "View WCAG Compliance Documentation" button hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    const button = screen.getByText('View WCAG Compliance Documentation').closest('button')!;
    await user.hover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(button.style.color).toBe('var(--btn-primary-hover-fg)');

    await user.unhover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(button.style.color).toBe('var(--btn-primary-fg)');
  });

  it('should handle "View WCAG Compliance Documentation" button focus/blur styles', () => {
    renderHelp();

    const button = screen.getByText('View WCAG Compliance Documentation').closest('button')!;
    button.focus();
    expect(button.style.outline).toContain('solid');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  // ── UI Component Library section ────────────────────────────────────

  it('should render the UI Component Library heading', () => {
    renderHelp();

    expect(screen.getByText('UI Component Library')).toBeVisible();
  });

  it('should render the UI Component Library description', () => {
    renderHelp();

    expect(
      screen.getByText(/Explore the complete design system with all UI components/),
    ).toBeVisible();
  });

  it('should navigate to /dashboard/ui-library when "View Component Library" is clicked', async () => {
    const user = userEvent.setup();
    renderHelp();

    await user.click(screen.getByText('View Component Library'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/ui-library');
  });

  it('should have correct aria-label on "View Component Library" button', () => {
    renderHelp();

    expect(screen.getByLabelText('View the complete UI component library')).toBeVisible();
  });

  it('should handle "View Component Library" button hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    const button = screen.getByText('View Component Library').closest('button')!;
    await user.hover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(button.style.color).toBe('var(--btn-primary-hover-fg)');

    await user.unhover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(button.style.color).toBe('var(--btn-primary-fg)');
  });

  it('should handle "View Component Library" button focus/blur styles', () => {
    renderHelp();

    const button = screen.getByText('View Component Library').closest('button')!;
    button.focus();
    expect(button.style.outline).toContain('solid');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  // ── Documentation section ───────────────────────────────────────────

  it('should render the Documentation heading', () => {
    renderHelp();

    expect(screen.getByText('Documentation')).toBeVisible();
  });

  it('should render all three documentation links', () => {
    renderHelp();

    expect(screen.getByText('Getting Started Guide')).toBeVisible();
    expect(screen.getByText('User Manual')).toBeVisible();
    // "Accessibility Features" appears as both a section heading and a doc link
    const links = screen.getAllByText('Accessibility Features');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it('should render documentation links as anchor elements', () => {
    renderHelp();

    const gettingStarted = screen.getByText('Getting Started Guide');
    expect(gettingStarted.tagName).toBe('A');
    expect(gettingStarted).toHaveAttribute('href', '#');

    const userManual = screen.getByText('User Manual');
    expect(userManual.tagName).toBe('A');
    expect(userManual).toHaveAttribute('href', '#');
  });

  it('should handle "Getting Started Guide" link hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    const link = screen.getByText('Getting Started Guide');
    await user.hover(link);
    expect(link.style.textDecoration).toBe('underline');

    await user.unhover(link);
    expect(link.style.textDecoration).toBe('none');
  });

  it('should handle "Getting Started Guide" link focus/blur styles', () => {
    renderHelp();

    const link = screen.getByText('Getting Started Guide');
    link.focus();
    expect(link.style.outline).toContain('solid');

    link.blur();
    expect(link.style.outline).toBe('none');
  });

  it('should handle "User Manual" link hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    const link = screen.getByText('User Manual');
    await user.hover(link);
    expect(link.style.textDecoration).toBe('underline');

    await user.unhover(link);
    expect(link.style.textDecoration).toBe('none');
  });

  it('should handle "User Manual" link focus/blur styles', () => {
    renderHelp();

    const link = screen.getByText('User Manual');
    link.focus();
    expect(link.style.outline).toContain('solid');

    link.blur();
    expect(link.style.outline).toBe('none');
  });

  it('should handle "Accessibility Features" doc link hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    // The doc link is an anchor element; the section heading is an h3
    const allMatches = screen.getAllByText('Accessibility Features');
    const link = allMatches.find((el) => el.tagName === 'A')!;

    await user.hover(link);
    expect(link.style.textDecoration).toBe('underline');

    await user.unhover(link);
    expect(link.style.textDecoration).toBe('none');
  });

  it('should handle "Accessibility Features" doc link focus/blur styles', () => {
    renderHelp();

    const allMatches = screen.getAllByText('Accessibility Features');
    const link = allMatches.find((el) => el.tagName === 'A')!;

    link.focus();
    expect(link.style.outline).toContain('solid');

    link.blur();
    expect(link.style.outline).toBe('none');
  });

  // ── Contact Support section ─────────────────────────────────────────

  it('should render the Contact Support heading', () => {
    renderHelp();

    expect(screen.getByText('Contact Support')).toBeVisible();
  });

  it('should render the support description', () => {
    renderHelp();

    expect(screen.getByText('Need help? Our support team is here for you.')).toBeVisible();
  });

  it('should render email contact info', () => {
    renderHelp();

    expect(screen.getByText('Email:')).toBeVisible();
    expect(screen.getByText(/support@careconnect\.com/)).toBeVisible();
  });

  it('should render phone contact info', () => {
    renderHelp();

    expect(screen.getByText('Phone:')).toBeVisible();
    expect(screen.getByText(/1-800-CARE-123/)).toBeVisible();
  });

  it('should render hours info', () => {
    renderHelp();

    expect(screen.getByText('Hours:')).toBeVisible();
    expect(screen.getByText(/Monday - Friday, 8AM - 8PM EST/)).toBeVisible();
  });

  it('should render the "Send Feedback" button', () => {
    renderHelp();

    expect(screen.getByText('Send Feedback')).toBeVisible();
  });

  it('should handle "Send Feedback" button hover styles', async () => {
    const user = userEvent.setup();
    renderHelp();

    const button = screen.getByText('Send Feedback');
    await user.hover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(button.style.color).toBe('var(--btn-primary-hover-fg)');

    await user.unhover(button);
    expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(button.style.color).toBe('var(--btn-primary-fg)');
  });

  it('should handle "Send Feedback" button focus/blur styles', () => {
    renderHelp();

    const button = screen.getByText('Send Feedback');
    button.focus();
    expect(button.style.outline).toContain('solid');

    button.blur();
    expect(button.style.outline).toBe('none');
  });

  // ── About CareConnect section ───────────────────────────────────────

  it('should render the About CareConnect heading', () => {
    renderHelp();

    expect(screen.getByText('About CareConnect')).toBeVisible();
  });

  it('should render the version number', () => {
    renderHelp();

    expect(screen.getByText('Version 1.0.0')).toBeVisible();
  });

  it('should render the about description', () => {
    renderHelp();

    expect(
      screen.getByText(
        /CareConnect is designed to help caregivers provide the best possible care/,
      ),
    ).toBeVisible();
  });

  // ── Back button navigation ──────────────────────────────────────────

  it('should navigate back when back button is clicked', async () => {
    const user = userEvent.setup();
    renderHelp();

    await user.click(screen.getByLabelText('Back'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
