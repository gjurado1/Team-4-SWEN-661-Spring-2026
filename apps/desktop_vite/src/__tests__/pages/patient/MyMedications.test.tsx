import { render, screen, fireEvent, within } from '@testing-library/react';
import { MyMedications } from '../../../app/pages/patient/MyMedications';
import { MemoryRouter } from 'react-router';

const renderMyMedications = () =>
  render(
    <MemoryRouter>
      <MyMedications />
    </MemoryRouter>,
  );

describe('MyMedications', () => {
  it('renders the page heading', () => {
    renderMyMedications();
    expect(
      screen.getByRole('heading', { name: 'My Medications' }),
    ).toBeInTheDocument();
  });

  it('renders the back button', () => {
    renderMyMedications();
    expect(screen.getByLabelText('Back')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderMyMedications();
    expect(
      screen.getByText('Track your daily medications and schedules'),
    ).toBeInTheDocument();
  });

  it('renders today\'s progress status', () => {
    renderMyMedications();
    const status = screen.getByRole('status', {
      name: "Today's medication status",
    });
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent("Today's Progress");
    expect(status).toHaveTextContent('2 of 3 medications taken');
    expect(status).toHaveTextContent('67%');
  });

  it('renders medication list with three items', () => {
    renderMyMedications();
    const list = screen.getByRole('list', { name: 'Medication list' });
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders Lisinopril with dosage, taken status, schedule and purpose', () => {
    renderMyMedications();
    const lisinoprilCard = screen.getByText('Lisinopril').closest('article');
    expect(lisinoprilCard).toBeInTheDocument();
    expect(lisinoprilCard).toHaveTextContent('10mg');
    expect(lisinoprilCard).toHaveTextContent('Taken');
    expect(lisinoprilCard).toHaveTextContent('Once daily at 9:00 AM');
    expect(lisinoprilCard).toHaveTextContent('Blood pressure management');
    expect(lisinoprilCard).toHaveTextContent('Take with breakfast');
    expect(within(lisinoprilCard!).getByLabelText('Medication taken')).toBeInTheDocument();
  });

  it('renders Metformin with details', () => {
    renderMyMedications();
    expect(screen.getByText('Metformin')).toBeInTheDocument();
    expect(screen.getByText('500mg')).toBeInTheDocument();
    expect(screen.getByText('Twice daily at 9:00 AM, 6:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Blood sugar control')).toBeInTheDocument();
    expect(screen.getByText('Take with meals')).toBeInTheDocument();
  });

  it('renders Atorvastatin as pending', () => {
    renderMyMedications();
    expect(screen.getByText('Atorvastatin')).toBeInTheDocument();
    expect(screen.getByText('20mg')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Once daily at 9:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Cholesterol management')).toBeInTheDocument();
    expect(screen.getByText('Take at bedtime')).toBeInTheDocument();
    expect(screen.getByLabelText('Medication pending')).toBeInTheDocument();
  });

  it('each medication shows Instructions label and text', () => {
    renderMyMedications();
    expect(screen.getAllByText('Instructions')).toHaveLength(3);
    expect(screen.getByText('Take with breakfast')).toBeInTheDocument();
    expect(screen.getByText('Take with meals')).toBeInTheDocument();
    expect(screen.getByText('Take at bedtime')).toBeInTheDocument();
  });

  it('renders important reminder note', () => {
    renderMyMedications();
    const note = screen.getByRole('note', {
      name: 'Important medication notice',
    });
    expect(note).toBeInTheDocument();
    expect(note).toHaveTextContent('Important Reminder');
    expect(note).toHaveTextContent(
      'Never adjust your medication dosage without consulting your healthcare provider. If you miss a dose, contact your care team for guidance.',
    );
  });
});
