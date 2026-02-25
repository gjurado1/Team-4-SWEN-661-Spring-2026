import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyboardShortcuts } from '../../app/pages/KeyboardShortcuts';
import { MemoryRouter } from 'react-router';

// Mock window.print
const mockPrint = vi.fn();
Object.defineProperty(window, 'print', { value: mockPrint, writable: true });

// Mock the hooks module so we can control isMac
vi.mock('../../app/hooks/useKeyboardShortcuts', async () => {
  const actual = await vi.importActual('../../app/hooks/useKeyboardShortcuts');
  return {
    ...actual,
  };
});

const renderKeyboardShortcuts = () =>
  render(
    <MemoryRouter>
      <KeyboardShortcuts />
    </MemoryRouter>,
  );

describe('KeyboardShortcuts', () => {
  beforeEach(() => {
    mockPrint.mockClear();
  });

  // 1. Renders heading, back button, print button
  it('should render the heading, back button, and print button', () => {
    renderKeyboardShortcuts();

    expect(screen.getByText('Keyboard Shortcuts')).toBeVisible();
    expect(screen.getByLabelText('Back')).toBeVisible();
    expect(screen.getByText('Print Reference Card')).toBeVisible();
  });

  // 2. Shows platform text (macOS or Windows/Linux)
  it('should show platform-specific subtitle text', () => {
    renderKeyboardShortcuts();

    // The subtitle will contain either "macOS" or "Windows/Linux" depending on platform
    const subtitle = screen.getByText(/shortcuts for efficient navigation/);
    expect(subtitle).toBeVisible();
    expect(subtitle.textContent).toMatch(/^(macOS|Windows\/Linux) shortcuts for efficient navigation$/);
  });

  // 3. Search filtering by description
  it('should filter shortcuts by description when searching', async () => {
    const user = userEvent.setup();
    renderKeyboardShortcuts();

    const searchInput = screen.getByPlaceholderText('Search shortcuts...');
    await user.type(searchInput, 'Save');

    // "Save" should still be visible
    expect(screen.getByText('Save')).toBeVisible();

    // Unrelated shortcuts should not be visible
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
    expect(screen.queryByText('Close Tab')).not.toBeInTheDocument();
  });

  // 4. Search filtering showing "No shortcuts found" for non-matching query
  it('should show "No shortcuts found" message for non-matching query', async () => {
    const user = userEvent.setup();
    renderKeyboardShortcuts();

    const searchInput = screen.getByPlaceholderText('Search shortcuts...');
    await user.type(searchInput, 'xyznonexistent');

    expect(
      screen.getByText(/No shortcuts found matching "xyznonexistent"/),
    ).toBeVisible();
  });

  // 5. Category filter buttons render
  it('should render category filter buttons including All', () => {
    renderKeyboardShortcuts();

    // "All" is always present
    expect(screen.getByRole('button', { name: 'All' })).toBeVisible();

    // Categories from the shortcuts data
    const expectedCategories = ['File', 'Tabs', 'Edit', 'View', 'Tools', 'Help', 'Navigation'];
    for (const category of expectedCategories) {
      expect(screen.getByRole('button', { name: category })).toBeVisible();
    }
  });

  // 6. Clicking category filters shortcuts
  it('should filter shortcuts when a category button is clicked', async () => {
    const user = userEvent.setup();
    renderKeyboardShortcuts();

    // Click the "Tabs" category
    await user.click(screen.getByRole('button', { name: 'Tabs' }));

    // Tab-related shortcuts should be visible
    expect(screen.getByText('New Tab')).toBeVisible();
    expect(screen.getByText('Close Tab')).toBeVisible();

    // Other category shortcuts should not be in the document
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
    expect(screen.queryByText('Zoom In')).not.toBeInTheDocument();
  });

  // 7. Active vs inactive category hover behavior
  it('should apply hover styles only on inactive category buttons', () => {
    renderKeyboardShortcuts();

    const allButton = screen.getByRole('button', { name: 'All' });
    const fileButton = screen.getByRole('button', { name: 'File' });

    // "All" is the active button by default - hover should NOT change bg
    fireEvent.mouseEnter(allButton);
    // Active button keeps its primary bg (hover condition is guarded by selectedCategory !== category)
    expect(allButton.style.backgroundColor).not.toBe('var(--btn-secondary-hover-bg)');

    fireEvent.mouseLeave(allButton);
    // Active button keeps its primary bg
    expect(allButton.style.backgroundColor).not.toBe('var(--color-surface)');

    // "File" is inactive - hover SHOULD change bg
    fireEvent.mouseEnter(fileButton);
    expect(fileButton.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');

    fireEvent.mouseLeave(fileButton);
    expect(fileButton.style.backgroundColor).toBe('var(--color-surface)');
  });

  // 8. Category button focus/blur
  it('should apply focus and blur styles on category buttons', () => {
    renderKeyboardShortcuts();

    const fileButton = screen.getByRole('button', { name: 'File' });

    fireEvent.focus(fileButton);
    expect(fileButton.style.outline).toBe('var(--focus-ring-width) solid var(--focus-ring-color)');
    expect(fileButton.style.outlineOffset).toBe('var(--focus-ring-offset)');

    fireEvent.blur(fileButton);
    expect(fileButton.style.outline).toBe('none');
  });

  // 9. Print button hover/focus/blur + calls window.print on click
  it('should handle print button hover, focus, blur, and click to call window.print', async () => {
    const user = userEvent.setup();
    renderKeyboardShortcuts();

    const printButton = screen.getByText('Print Reference Card').closest('button')!;

    // Hover
    fireEvent.mouseEnter(printButton);
    expect(printButton.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    expect(printButton.style.color).toBe('var(--btn-primary-hover-fg)');

    fireEvent.mouseLeave(printButton);
    expect(printButton.style.backgroundColor).toBe('var(--btn-primary-bg)');
    expect(printButton.style.color).toBe('var(--btn-primary-fg)');

    // Focus
    fireEvent.focus(printButton);
    expect(printButton.style.outline).toBe('var(--focus-ring-width) solid var(--focus-ring-color)');
    expect(printButton.style.outlineOffset).toBe('var(--focus-ring-offset)');

    // Blur
    fireEvent.blur(printButton);
    expect(printButton.style.outline).toBe('none');

    // Click calls window.print
    await user.click(printButton);
    expect(mockPrint).toHaveBeenCalledTimes(1);
  });

  // 10. Search input focus/blur handlers
  it('should apply focus and blur styles on the search input', () => {
    renderKeyboardShortcuts();

    const searchInput = screen.getByPlaceholderText('Search shortcuts...');

    fireEvent.focus(searchInput);
    expect(searchInput.style.borderColor).toBe('var(--color-focus)');
    expect(searchInput.style.outline).toBe('var(--focus-ring-width) solid var(--focus-ring-color)');
    expect(searchInput.style.outlineOffset).toBe('var(--focus-ring-offset)');

    fireEvent.blur(searchInput);
    expect(searchInput.style.borderColor).toBe('var(--color-border)');
    expect(searchInput.style.outline).toBe('none');
  });

  // 11. Shortcut row hover effects
  it('should apply hover effects on shortcut rows', () => {
    renderKeyboardShortcuts();

    // Find a shortcut row by its description text, then get the parent row div
    const descriptionSpan = screen.getByText('Save');
    const row = descriptionSpan.closest('.flex.items-center.justify-between')!;

    fireEvent.mouseEnter(row);
    expect((row as HTMLElement).style.backgroundColor).toBe('var(--color-panel)');

    fireEvent.mouseLeave(row);
    expect((row as HTMLElement).style.backgroundColor).toBe('transparent');
  });

  // 12. Shortcuts display with kbd elements
  it('should display shortcuts with kbd elements containing formatted key combos', () => {
    renderKeyboardShortcuts();

    // There should be kbd elements in the document
    const kbdElements = document.querySelectorAll('kbd');
    expect(kbdElements.length).toBeGreaterThan(0);

    // Each shortcut description should have a corresponding kbd sibling
    // Check a specific shortcut - "Save" should have a kbd with Ctrl/Cmd + S
    const saveDescription = screen.getByText('Save');
    const saveRow = saveDescription.closest('.flex.items-center.justify-between')!;
    const saveKbd = saveRow.querySelector('kbd');
    expect(saveKbd).toBeTruthy();
    expect(saveKbd!.textContent).toBeTruthy();
    // The kbd should contain 'S' (the key, regardless of platform modifier)
    expect(saveKbd!.textContent).toMatch(/S/);
  });

  // Additional: print-only section exists
  it('should contain the print-only header with CareConnect title', () => {
    renderKeyboardShortcuts();

    expect(screen.getByText('CareConnect Keyboard Shortcuts')).toBeInTheDocument();
  });

  // Additional: style tag with print CSS exists
  it('should include a style tag with print media CSS', () => {
    renderKeyboardShortcuts();

    const styleTags = document.querySelectorAll('style');
    const printStyle = Array.from(styleTags).find((s) =>
      s.textContent?.includes('@media print'),
    );
    expect(printStyle).toBeTruthy();
  });

  // Additional: combining search and category filter
  it('should filter by both search query and category simultaneously', async () => {
    const user = userEvent.setup();
    renderKeyboardShortcuts();

    // Select "Edit" category
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    // Type search for "Copy"
    const searchInput = screen.getByPlaceholderText('Search shortcuts...');
    await user.type(searchInput, 'Copy');

    // Only "Copy" in the Edit category should show
    expect(screen.getByText('Copy')).toBeVisible();

    // Other Edit shortcuts should not be present
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
    expect(screen.queryByText('Paste')).not.toBeInTheDocument();

    // Shortcuts from other categories should not be present
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  // Additional: clicking "All" resets category filter
  it('should show all shortcuts when "All" category is clicked after filtering', async () => {
    const user = userEvent.setup();
    renderKeyboardShortcuts();

    // First filter to Tabs
    await user.click(screen.getByRole('button', { name: 'Tabs' }));
    expect(screen.queryByText('Save')).not.toBeInTheDocument();

    // Click All to reset
    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Save')).toBeVisible();
    expect(screen.getByText('New Tab')).toBeVisible();
  });
});
