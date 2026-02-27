import { render, screen, fireEvent } from '@testing-library/react';
import { MyCare } from '../../../app/pages/patient/MyCare';
import { MemoryRouter } from 'react-router';

const renderMyCare = () =>
  render(
    <MemoryRouter>
      <MyCare />
    </MemoryRouter>,
  );

describe('MyCare', () => {
  it('renders the page heading', () => {
    renderMyCare();
    expect(
      screen.getByRole('heading', { name: 'My Care Plan' }),
    ).toBeInTheDocument();
  });

  it('renders the back button', () => {
    renderMyCare();
    expect(screen.getByLabelText('Back')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderMyCare();
    expect(
      screen.getByText('Your personalized care plan and daily goals'),
    ).toBeInTheDocument();
  });

  it('renders Today\'s Goals region', () => {
    renderMyCare();
    const region = screen.getByRole('region', {
      name: "Today's care goals",
    });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent("Today's Goals");
  });

  it('renders all three care goals with status', () => {
    renderMyCare();
    expect(
      screen.getByText('Take morning medications by 9 AM'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Complete physical therapy exercises'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Evening walk for 15 minutes'),
    ).toBeInTheDocument();
    expect(screen.getByText('Due: 9:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Due: 2:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Due: 6:00 PM')).toBeInTheDocument();
  });

  it('shows Completed icon for completed goal', () => {
    renderMyCare();
    const completedIcon = screen.getByLabelText('Completed');
    expect(completedIcon).toBeInTheDocument();
  });

  it('shows Pending icon for pending goals', () => {
    renderMyCare();
    const pendingIcons = screen.getAllByLabelText('Pending');
    expect(pendingIcons).toHaveLength(2);
  });

  it('renders Your Care Team region', () => {
    renderMyCare();
    const region = screen.getByRole('region', { name: 'Your care team' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('Your Care Team');
    expect(region).toHaveTextContent('Dr. Sarah Johnson');
    expect(region).toHaveTextContent('Primary Physician');
    expect(region).toHaveTextContent('sjohnson@hospital.com');
    expect(region).toHaveTextContent('Michael Chen');
    expect(region).toHaveTextContent('Physical Therapist');
    expect(region).toHaveTextContent('mchen@therapy.com');
    expect(region).toHaveTextContent('Emma Williams');
    expect(region).toHaveTextContent('Primary Caregiver');
    expect(region).toHaveTextContent('emma.w@careconnect.com');
  });

  it('care team emails are mailto links with correct aria-label', () => {
    renderMyCare();
    expect(screen.getByRole('link', { name: 'Email Dr. Sarah Johnson' })).toHaveAttribute(
      'href',
      'mailto:sjohnson@hospital.com',
    );
    expect(screen.getByRole('link', { name: 'Email Michael Chen' })).toHaveAttribute(
      'href',
      'mailto:mchen@therapy.com',
    );
    expect(screen.getByRole('link', { name: 'Email Emma Williams' })).toHaveAttribute(
      'href',
      'mailto:emma.w@careconnect.com',
    );
  });

  it('applies hover and focus on care team email links', () => {
    renderMyCare();
    const link = screen.getByRole('link', { name: 'Email Dr. Sarah Johnson' });
    fireEvent.mouseEnter(link);
    expect(link.style.textDecoration).toBe('underline');
    fireEvent.mouseLeave(link);
    expect(link.style.textDecoration).toBe('none');
    fireEvent.focus(link);
    expect(link.style.outline).toContain('solid');
    fireEvent.blur(link);
    expect(link.style.outline).toBe('none');
  });

  it('renders Care Instructions section with all four items', () => {
    renderMyCare();
    const region = screen.getByRole('region', { name: 'Care instructions' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('Important Care Instructions');
    expect(region).toHaveTextContent(
      'Take all medications with food to avoid stomach upset',
    );
    expect(region).toHaveTextContent(
      'Monitor blood pressure daily before morning medication',
    );
    expect(region).toHaveTextContent(
      'Contact your care team if you experience dizziness or fatigue',
    );
    expect(region).toHaveTextContent(
      'Stay hydrated - aim for 8 glasses of water per day',
    );
  });
});
