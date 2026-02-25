import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientList } from '../../app/pages/PatientList';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPatientList() {
  return render(
    <MemoryRouter>
      <PatientList />
    </MemoryRouter>,
  );
}

describe('PatientList', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    (window as any).tabManager = { openNewTab: vi.fn() };
  });

  afterEach(() => {
    delete (window as any).tabManager;
  });

  // 1. Renders heading, back button, add patient button
  it('renders heading, back button, and add patient button', () => {
    renderPatientList();

    expect(screen.getByText('Patient List')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Add Patient')).toBeInTheDocument();
  });

  // 2. Shows search input
  it('shows the search input with correct placeholder', () => {
    renderPatientList();

    const searchInput = screen.getByPlaceholderText('Search patients by name or condition...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  // 3. Renders all 3 patient cards with name, age, condition, last visit
  it('renders all 3 patient cards with name, age, condition, and last visit', () => {
    renderPatientList();

    // Use same date formatting as component so assertions pass in any timezone
    const formatLastVisit = (iso: string) =>
      new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Patient 1
    expect(screen.getByText('Margaret Smith')).toBeInTheDocument();
    expect(screen.getByText(/Age: 78/)).toBeInTheDocument();
    expect(screen.getByText(/Diabetes Management/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(formatLastVisit('2026-02-17')))).toBeInTheDocument();

    // Patient 2
    expect(screen.getByText('Robert Williams')).toBeInTheDocument();
    expect(screen.getByText(/Age: 82/)).toBeInTheDocument();
    expect(screen.getByText(/Post-Surgery Care/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(formatLastVisit('2026-02-18')))).toBeInTheDocument();

    // Patient 3
    expect(screen.getByText('John Davis')).toBeInTheDocument();
    expect(screen.getByText(/Age: 65/)).toBeInTheDocument();
    expect(screen.getByText(/Heart Disease/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(formatLastVisit('2026-02-19')))).toBeInTheDocument();
  });

  // 4. Add Patient button hover/focus/blur
  it('applies hover styles on Add Patient button', async () => {
    const user = userEvent.setup();
    renderPatientList();

    const addButton = screen.getByText('Add Patient').closest('button')!;

    await user.hover(addButton);
    expect(addButton.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(addButton.style.color).toBe('var(--btn-primary-hover-fg)');

    await user.unhover(addButton);
    expect(addButton.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(addButton.style.color).toBe('var(--btn-primary-fg)');
  });

  it('applies focus and blur styles on Add Patient button', () => {
    renderPatientList();

    const addButton = screen.getByText('Add Patient').closest('button')!;

    addButton.focus();
    addButton.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(addButton.style.outline).toContain('solid');

    addButton.blur();
    addButton.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    expect(addButton.style.outline).toBe('none');
  });

  // 5. Search input focus/blur handlers
  it('applies focus and blur styles on search input', async () => {
    const user = userEvent.setup();
    renderPatientList();

    const searchInput = screen.getByPlaceholderText('Search patients by name or condition...');

    await user.click(searchInput);
    expect(searchInput.style.borderColor).toBe('var(--input-border-focus)');
    expect(searchInput.style.outline).toContain('solid');

    await user.tab();
    expect(searchInput.style.borderColor).toBe('var(--input-border)');
    expect(searchInput.style.outline).toBe('none');
  });

  // 6. Patient card hover effects
  it('applies hover styles on patient cards', async () => {
    const user = userEvent.setup();
    renderPatientList();

    const margaretCard = screen.getByText('Margaret Smith').closest('[class*="cursor-pointer"]')!;

    await user.hover(margaretCard);
    expect((margaretCard as HTMLElement).style.boxShadow).toBe('var(--shadow-panel)');
    expect((margaretCard as HTMLElement).style.borderColor).toBe('var(--color-focus)');

    await user.unhover(margaretCard);
    expect((margaretCard as HTMLElement).style.boxShadow).toBe('var(--shadow-sm)');
    expect((margaretCard as HTMLElement).style.borderColor).toBe('var(--color-border)');
  });

  // 7. Clicking patient card navigates
  it('navigates to patient detail page when card is clicked', async () => {
    const user = userEvent.setup();
    renderPatientList();

    const margaretCard = screen.getByText('Margaret Smith').closest('[class*="cursor-pointer"]')!;
    await user.click(margaretCard);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/patients/1');

    mockNavigate.mockClear();

    const robertCard = screen.getByText('Robert Williams').closest('[class*="cursor-pointer"]')!;
    await user.click(robertCard);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/patients/2');

    mockNavigate.mockClear();

    const johnCard = screen.getByText('John Davis').closest('[class*="cursor-pointer"]')!;
    await user.click(johnCard);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/patients/3');
  });

  // 8. Ctrl+click opens in new tab via tabManager
  it('opens patient in new tab when Ctrl+clicking a card', async () => {
    renderPatientList();

    const margaretCard = screen.getByText('Margaret Smith').closest('[class*="cursor-pointer"]')!;

    // Simulate Ctrl+click using fireEvent since userEvent doesn't support modifier clicks on divs easily
    const { fireEvent } = await import('@testing-library/react');
    fireEvent.click(margaretCard, { ctrlKey: true });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect((window as any).tabManager.openNewTab).toHaveBeenCalledWith('/dashboard/patients/1');
  });

  it('opens patient in new tab when Meta+clicking a card', async () => {
    renderPatientList();

    const margaretCard = screen.getByText('Margaret Smith').closest('[class*="cursor-pointer"]')!;

    const { fireEvent } = await import('@testing-library/react');
    fireEvent.click(margaretCard, { metaKey: true });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect((window as any).tabManager.openNewTab).toHaveBeenCalledWith('/dashboard/patients/1');
  });

  // 9. External link button hover/focus/blur
  it('applies hover styles on external link buttons', async () => {
    const user = userEvent.setup();
    renderPatientList();

    // Get all external link buttons (one per patient card)
    const externalLinkButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg') && btn.closest('[class*="cursor-pointer"]'));
    expect(externalLinkButtons.length).toBe(3);

    const firstLinkBtn = externalLinkButtons[0];

    await user.hover(firstLinkBtn);
    expect(firstLinkBtn.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
    expect(firstLinkBtn.style.color).toBe('var(--btn-secondary-hover-fg)');

    await user.unhover(firstLinkBtn);
    expect(firstLinkBtn.style.backgroundColor).toBe('var(--btn-secondary-bg)');
    expect(firstLinkBtn.style.color).toBe('var(--btn-secondary-fg)');
  });

  it('applies focus and blur styles on external link buttons', () => {
    renderPatientList();

    const externalLinkButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg') && btn.closest('[class*="cursor-pointer"]'));
    const firstLinkBtn = externalLinkButtons[0];

    // Simulate focus
    firstLinkBtn.focus();
    firstLinkBtn.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(firstLinkBtn.style.outline).toContain('solid');

    // Simulate blur
    firstLinkBtn.blur();
    firstLinkBtn.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    expect(firstLinkBtn.style.outline).toBe('none');
  });

  // External link button calls openPatientInNewTab and stops propagation
  it('opens patient in new tab when external link button is clicked', async () => {
    const user = userEvent.setup();
    renderPatientList();

    const externalLinkButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg') && btn.closest('[class*="cursor-pointer"]'));

    await user.click(externalLinkButtons[0]);
    expect((window as any).tabManager.openNewTab).toHaveBeenCalledWith('/dashboard/patients/1');
    // Should NOT navigate because stopPropagation prevents card click
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('external link button click does not trigger card navigation', async () => {
    const user = userEvent.setup();
    renderPatientList();

    const externalLinkButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg') && btn.closest('[class*="cursor-pointer"]'));

    await user.click(externalLinkButtons[1]);
    expect((window as any).tabManager.openNewTab).toHaveBeenCalledWith('/dashboard/patients/2');
    expect(mockNavigate).not.toHaveBeenCalled();

    await user.click(externalLinkButtons[2]);
    expect((window as any).tabManager.openNewTab).toHaveBeenCalledWith('/dashboard/patients/3');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
