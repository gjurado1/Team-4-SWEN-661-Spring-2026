import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibilityAnnotations } from '../../app/pages/AccessibilityAnnotations';
import { MemoryRouter } from 'react-router';

vi.mock('../../app/components/ScreenReaderOrderModal', () => ({
  ScreenReaderOrderModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <div data-testid="modal"><button onClick={onClose}>Close Modal</button></div> : null,
}));

function renderComponent() {
  return render(
    <MemoryRouter>
      <AccessibilityAnnotations />
    </MemoryRouter>,
  );
}

describe('AccessibilityAnnotations', () => {
  // 1. Renders heading, subtitle, back button
  describe('header section', () => {
    it('renders the main heading', () => {
      renderComponent();
      expect(screen.getByRole('heading', { name: 'Accessibility Annotations' })).toBeInTheDocument();
    });

    it('renders the subtitle about WCAG 2.1 AA', () => {
      renderComponent();
      expect(screen.getByText('WCAG 2.1 AA compliance documentation and accessibility features')).toBeInTheDocument();
    });

    it('renders a back button', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });
  });

  // 2. WCAG compliant banner
  describe('WCAG compliant banner', () => {
    it('renders the WCAG 2.1 Level AA Compliant heading', () => {
      renderComponent();
      expect(screen.getByRole('heading', { name: 'WCAG 2.1 Level AA Compliant' })).toBeInTheDocument();
    });

    it('renders the banner description text', () => {
      renderComponent();
      expect(
        screen.getByText(/CareConnect meets Web Content Accessibility Guidelines/),
      ).toBeInTheDocument();
    });
  });

  // 3. All 8 feature card headings
  describe('feature card headings', () => {
    const featureHeadings = [
      'Complete Keyboard Navigation',
      'Visible Focus Indicators',
      'Screen Reader Compatible',
      'WCAG Contrast Ratios',
      'Scalable Typography',
      'Clear Interactive States',
      'Low Vision Friendly',
      'Responsive & Adaptive',
    ];

    it.each(featureHeadings)('renders the "%s" feature card heading', (heading) => {
      renderComponent();
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    });
  });

  // 4. Feature card details (keyboard shortcuts list, etc.)
  describe('feature card details', () => {
    it('renders keyboard navigation shortcuts', () => {
      renderComponent();
      expect(screen.getByText(/Tab\/Shift\+Tab:/)).toBeInTheDocument();
      expect(screen.getByText(/Enter\/Space:/)).toBeInTheDocument();
      expect(screen.getByText(/Arrow Keys:/)).toBeInTheDocument();
      expect(screen.getByText(/Escape:/)).toBeInTheDocument();
      expect(screen.getByText(/Alt\+T:/)).toBeInTheDocument();
      expect(screen.getByText(/Ctrl\+K:/)).toBeInTheDocument();
    });

    it('renders screen reader compatible list items', () => {
      renderComponent();
      expect(screen.getByText(/Semantic HTML:/)).toBeInTheDocument();
      expect(screen.getByText(/ARIA Labels:/)).toBeInTheDocument();
      expect(screen.getByText(/ARIA Live Regions:/)).toBeInTheDocument();
      expect(screen.getByText(/Alt Text:/)).toBeInTheDocument();
      expect(screen.getByText(/Form Labels:/)).toBeInTheDocument();
      expect(screen.getByText(/Skip Links:/)).toBeInTheDocument();
    });

    it('renders contrast ratio sections', () => {
      renderComponent();
      expect(screen.getByText('Normal Text')).toBeInTheDocument();
      expect(screen.getByText('Minimum 4.5:1 ratio')).toBeInTheDocument();
      expect(screen.getByText('Large Text')).toBeInTheDocument();
      expect(screen.getByText('Minimum 3:1 ratio')).toBeInTheDocument();
    });

    it('renders scalable typography list items', () => {
      renderComponent();
      expect(screen.getByText(/Uses relative units/)).toBeInTheDocument();
      expect(screen.getByText(/Respects user's browser text size preferences/)).toBeInTheDocument();
      expect(screen.getByText(/Layouts adapt gracefully/)).toBeInTheDocument();
      expect(screen.getByText(/No horizontal scrolling/)).toBeInTheDocument();
    });

    it('renders low vision friendly theme list items', () => {
      renderComponent();
      expect(screen.getByText(/Warm Theme:/)).toBeInTheDocument();
      expect(screen.getByText(/Medical Theme:/)).toBeInTheDocument();
      expect(screen.getByText(/Dark Theme:/)).toBeInTheDocument();
    });

    it('renders responsive & adaptive list items', () => {
      renderComponent();
      expect(screen.getByText('Mobile-friendly layouts')).toBeInTheDocument();
      expect(screen.getByText('Touch-optimized controls')).toBeInTheDocument();
      expect(screen.getByText('Flexible grid systems')).toBeInTheDocument();
      expect(screen.getByText('No loss of functionality on small screens')).toBeInTheDocument();
    });
  });

  // 5. WCAG compliance badges text
  describe('WCAG compliance badges', () => {
    const badges = [
      'WCAG 2.1.1 (Level A) - Keyboard Accessible',
      'WCAG 2.4.7 (Level AA) - Focus Visible',
      'WCAG 4.1.2 (Level A) - Name, Role, Value',
      'WCAG 1.4.3 (Level AA) - Contrast (Minimum)',
      'WCAG 1.4.4 (Level AA) - Resize Text',
      'WCAG 1.4.1 (Level A) - Use of Color',
      'WCAG 1.4.11 (Level AA) - Non-text Contrast',
      'WCAG 1.4.10 (Level AA) - Reflow',
    ];

    it.each(badges)('renders badge "%s"', (badge) => {
      renderComponent();
      expect(screen.getByText(`✓ ${badge}`)).toBeInTheDocument();
    });
  });

  // 6. Tab to Focus Me button focus/blur handlers
  describe('"Tab to Focus Me" button', () => {
    it('applies focus outline on focus and removes it on blur', async () => {
      renderComponent();
      const button = screen.getByRole('button', { name: 'Tab to Focus Me' });

      button.focus();
      expect(button.style.outline).toBe('2px solid var(--focus-ring)');
      expect(button.style.outlineOffset).toBe('2px');

      button.blur();
      expect(button.style.outline).toBe('none');
    });
  });

  // 7. Or focus this input focus/blur handlers
  describe('"Or focus this input" input', () => {
    it('applies focus outline on focus and removes it on blur', async () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Or focus this input');

      input.focus();
      expect(input.style.outline).toBe('2px solid var(--focus-ring)');
      expect(input.style.outlineOffset).toBe('0px');

      input.blur();
      expect(input.style.outline).toBe('none');
    });
  });

  // 8. Hover Me button hover handlers
  describe('"Hover Me" button', () => {
    it('changes background on mouse enter and restores on mouse leave', async () => {
      const user = userEvent.setup();
      renderComponent();
      const button = screen.getByRole('button', { name: 'Hover Me' });

      await user.hover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');

      await user.unhover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
    });
  });

  // 9. Disabled button is disabled
  describe('"Disabled" button', () => {
    it('is rendered as disabled', () => {
      renderComponent();
      const button = screen.getByRole('button', { name: 'Disabled' });
      expect(button).toBeDisabled();
    });
  });

  // 10. View Screen Reader Order Diagram button hover/focus/blur
  describe('"View Screen Reader Order Diagram" button', () => {
    it('has the correct aria-label', () => {
      renderComponent();
      expect(
        screen.getByRole('button', { name: 'View screen reader reading order diagram for the dashboard' }),
      ).toBeInTheDocument();
    });

    it('changes style on mouse enter and restores on mouse leave', async () => {
      const user = userEvent.setup();
      renderComponent();
      const button = screen.getByRole('button', {
        name: 'View screen reader reading order diagram for the dashboard',
      });

      await user.hover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
      expect(button.style.boxShadow).toBe('var(--shadow-lg)');

      await user.unhover(button);
      expect(button.style.backgroundColor).toBe('var(--btn-primary-bg)');
      expect(button.style.boxShadow).toBe('var(--shadow-md)');
    });

    it('applies focus outline on focus and removes it on blur', () => {
      renderComponent();
      const button = screen.getByRole('button', {
        name: 'View screen reader reading order diagram for the dashboard',
      });

      button.focus();
      expect(button.style.outline).toBe('2px solid var(--focus-ring)');
      expect(button.style.outlineOffset).toBe('2px');

      button.blur();
      expect(button.style.outline).toBe('none');
    });

    it('renders the description about screen reader traversal', () => {
      renderComponent();
      expect(
        screen.getByText(/See how screen readers traverse the dashboard interface/),
      ).toBeInTheDocument();
    });
  });

  // 11. Clicking diagram button opens modal
  describe('modal open', () => {
    it('opens the modal when clicking the diagram button', async () => {
      const user = userEvent.setup();
      renderComponent();

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

      const button = screen.getByRole('button', {
        name: 'View screen reader reading order diagram for the dashboard',
      });
      await user.click(button);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });

  // 12. Closing modal
  describe('modal close', () => {
    it('closes the modal when clicking the close button', async () => {
      const user = userEvent.setup();
      renderComponent();

      const openButton = screen.getByRole('button', {
        name: 'View screen reader reading order diagram for the dashboard',
      });
      await user.click(openButton);
      expect(screen.getByTestId('modal')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: 'Close Modal' });
      await user.click(closeButton);
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  // 13. WCAG checklist items render (spot check a few)
  describe('WCAG compliance checklist', () => {
    it('renders the checklist section heading', () => {
      renderComponent();
      expect(
        screen.getByRole('heading', { name: 'WCAG 2.1 Level AA Compliance Checklist' }),
      ).toBeInTheDocument();
    });

    it('renders checklist item "1.1.1 - Non-text Content"', () => {
      renderComponent();
      expect(screen.getByText('1.1.1 - Non-text Content')).toBeInTheDocument();
    });

    it('renders checklist item "1.3.1 - Info and Relationships"', () => {
      renderComponent();
      expect(screen.getByText('1.3.1 - Info and Relationships')).toBeInTheDocument();
    });

    it('renders checklist item "2.1.1 - Keyboard"', () => {
      renderComponent();
      expect(screen.getByText('2.1.1 - Keyboard')).toBeInTheDocument();
    });

    it('renders checklist item "2.4.7 - Focus Visible"', () => {
      renderComponent();
      expect(screen.getByText('2.4.7 - Focus Visible')).toBeInTheDocument();
    });

    it('renders checklist item "4.1.3 - Status Messages"', () => {
      renderComponent();
      expect(screen.getByText('4.1.3 - Status Messages')).toBeInTheDocument();
    });

    it('renders all 18 checklist items', () => {
      renderComponent();
      const allItems = [
        '1.1.1 - Non-text Content',
        '1.3.1 - Info and Relationships',
        '1.4.1 - Use of Color',
        '1.4.3 - Contrast (Minimum)',
        '1.4.4 - Resize Text',
        '1.4.10 - Reflow',
        '1.4.11 - Non-text Contrast',
        '2.1.1 - Keyboard',
        '2.1.2 - No Keyboard Trap',
        '2.4.3 - Focus Order',
        '2.4.6 - Headings and Labels',
        '2.4.7 - Focus Visible',
        '3.2.3 - Consistent Navigation',
        '3.2.4 - Consistent Identification',
        '3.3.1 - Error Identification',
        '3.3.2 - Labels or Instructions',
        '4.1.2 - Name, Role, Value',
        '4.1.3 - Status Messages',
      ];
      for (const item of allItems) {
        expect(screen.getByText(item)).toBeInTheDocument();
      }
    });
  });

  // 14. Testing tools section
  describe('Testing & Validation section', () => {
    it('renders the Testing & Validation heading', () => {
      renderComponent();
      expect(screen.getByRole('heading', { name: 'Testing & Validation' })).toBeInTheDocument();
    });

    it('renders the Recommended Testing Tools subheading', () => {
      renderComponent();
      expect(screen.getByRole('heading', { name: 'Recommended Testing Tools' })).toBeInTheDocument();
    });

    const tools = [
      'WAVE (Web Accessibility Evaluation Tool):',
      'axe DevTools:',
      'NVDA/JAWS:',
      'VoiceOver:',
      'Lighthouse:',
      'Keyboard Navigation:',
      'Color Contrast Analyzer:',
    ];

    it.each(tools)('renders testing tool "%s"', (tool) => {
      renderComponent();
      expect(screen.getByText(new RegExp(tool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
    });
  });

  // 15. All WCAG level badges (Level A, Level AA)
  describe('WCAG level badges in checklist', () => {
    it('renders Level A badges', () => {
      renderComponent();
      const levelABadges = screen.getAllByText('Level A');
      // Items with Level A: 1.1.1, 1.3.1, 1.4.1, 2.1.1, 2.1.2, 2.4.3, 3.3.1, 3.3.2, 4.1.2 = 9 items
      expect(levelABadges).toHaveLength(9);
    });

    it('renders Level AA badges', () => {
      renderComponent();
      const levelAABadges = screen.getAllByText('Level AA');
      // Items with Level AA: 1.4.3, 1.4.4, 1.4.10, 1.4.11, 2.4.6, 2.4.7, 3.2.3, 3.2.4, 4.1.3 = 9 items
      expect(levelAABadges).toHaveLength(9);
    });
  });
});
