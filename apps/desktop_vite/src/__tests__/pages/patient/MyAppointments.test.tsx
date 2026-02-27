import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyAppointments } from '../../../app/pages/patient/MyAppointments';
import { MemoryRouter } from 'react-router';

const renderMyAppointments = () =>
  render(
    <MemoryRouter>
      <MyAppointments />
    </MemoryRouter>,
  );

describe('MyAppointments', () => {
  it('renders the page heading', () => {
    renderMyAppointments();
    expect(
      screen.getByRole('heading', { name: 'My Appointments' }),
    ).toBeInTheDocument();
  });

  it('renders the back button', () => {
    renderMyAppointments();
    expect(screen.getByLabelText('Back')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderMyAppointments();
    expect(
      screen.getByText(
        'View and manage your upcoming medical appointments',
      ),
    ).toBeInTheDocument();
  });

  it('renders next appointment region with first appointment', () => {
    renderMyAppointments();
    const region = screen.getByRole('region', { name: 'Next appointment' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent('NEXT APPOINTMENT');
    expect(region).toHaveTextContent('Follow-up with Dr. Johnson');
    expect(region).toHaveTextContent(
      new Date('2026-02-22').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    );
    expect(region).toHaveTextContent('10:00 AM');
    expect(region).toHaveTextContent('Medical Center, Room 304');
  });

  it('renders Upcoming Appointments section', () => {
    renderMyAppointments();
    expect(
      screen.getByRole('heading', { name: 'Upcoming Appointments' }),
    ).toBeInTheDocument();
  });

  it('renders all three appointments in the list', () => {
    renderMyAppointments();
    const section = screen.getByRole('region', { name: 'All appointments' });
    const list = within(section).getByRole('list');
    const listItems = within(list).getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(section).toHaveTextContent('Follow-up with Dr. Johnson');
    expect(section).toHaveTextContent('Physical Therapy Session');
    expect(section).toHaveTextContent('Telehealth Check-in');
  });

  it('shows provider and specialty for each appointment', () => {
    renderMyAppointments();
    expect(screen.getByText('Dr. Sarah Johnson • Primary Care')).toBeInTheDocument();
    expect(screen.getByText('Michael Chen, PT • Physical Therapy')).toBeInTheDocument();
    expect(screen.getByText('Nurse Emma Williams • Care Coordination')).toBeInTheDocument();
  });

  it('shows In-Person badge for in-person appointments', () => {
    renderMyAppointments();
    expect(screen.getAllByText('In-Person').length).toBe(2);
  });

  it('shows Video badge for video appointment', () => {
    renderMyAppointments();
    expect(screen.getByText('Video')).toBeInTheDocument();
  });

  it('renders Join Video Call button only for video appointment', () => {
    renderMyAppointments();
    const joinBtn = screen.getByRole('button', {
      name: 'Join video call for Telehealth Check-in',
    });
    expect(joinBtn).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Join video call/ })).toHaveLength(1);
  });

  it('renders Contact button for each appointment', () => {
    renderMyAppointments();
    const contactButtons = screen.getAllByRole('button', { name: /Call provider for/ });
    expect(contactButtons).toHaveLength(3);
  });

  it('applies hover and focus on Join Video Call button', () => {
    renderMyAppointments();
    const btn = screen.getByRole('button', {
      name: 'Join video call for Telehealth Check-in',
    });
    fireEvent.mouseEnter(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    fireEvent.mouseLeave(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-primary-bg)');
    fireEvent.focus(btn);
    expect(btn.style.outline).toContain('solid');
    fireEvent.blur(btn);
    expect(btn.style.outline).toBe('none');
  });

  it('applies hover and focus on Contact button', () => {
    renderMyAppointments();
    const contactButtons = screen.getAllByRole('button', { name: /Call provider for/ });
    const first = contactButtons[0];
    fireEvent.mouseEnter(first);
    expect(first.style.backgroundColor).toBe('var(--btn-secondary-hover-bg)');
    fireEvent.mouseLeave(first);
    expect(first.style.backgroundColor).toBe('var(--btn-secondary-bg)');
    fireEvent.focus(first);
    expect(first.style.outline).toContain('solid');
    fireEvent.blur(first);
    expect(first.style.outline).toBe('none');
  });

  it('shows date, time, duration and location for each appointment', () => {
    renderMyAppointments();
    expect(
      screen.getByText(
        new Date('2026-02-22').toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('10:00 AM (30 min)')).toBeInTheDocument();
    expect(screen.getByText('Video Call')).toBeInTheDocument();
    expect(screen.getByText('11:00 AM (15 min)')).toBeInTheDocument();
  });
});
