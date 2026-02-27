import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HealthJournal } from '../../../app/pages/patient/HealthJournal';
import { MemoryRouter } from 'react-router';

const renderHealthJournal = () =>
  render(
    <MemoryRouter>
      <HealthJournal />
    </MemoryRouter>,
  );

describe('HealthJournal', () => {
  it('renders the page heading', () => {
    renderHealthJournal();
    expect(screen.getByRole('heading', { name: 'Health Journal' })).toBeInTheDocument();
  });

  it('renders the back button', () => {
    renderHealthJournal();
    expect(screen.getByLabelText('Back')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderHealthJournal();
    expect(
      screen.getByText('Track your daily health, mood, and well-being'),
    ).toBeInTheDocument();
  });

  it('renders the New Entry button with aria-label', () => {
    renderHealthJournal();
    const btn = screen.getByRole('button', { name: 'Add new journal entry' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('New Entry');
  });

  it('applies hover and focus styles on New Entry button', () => {
    renderHealthJournal();
    const btn = screen.getByRole('button', { name: 'Add new journal entry' });
    fireEvent.mouseEnter(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-primary-hover-bg)');
    fireEvent.mouseLeave(btn);
    expect(btn.style.backgroundColor).toBe('var(--btn-primary-bg)');
    fireEvent.focus(btn);
    expect(btn.style.outline).toContain('solid');
    fireEvent.blur(btn);
    expect(btn.style.outline).toBe('none');
  });

  it('renders health trends region with summary', () => {
    renderHealthJournal();
    const region = screen.getByRole('region', { name: 'Health trends summary' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent("This Week's Trends");
    expect(region).toHaveTextContent('Average Energy');
    expect(region).toHaveTextContent('6.2');
    expect(region).toHaveTextContent('/10');
    expect(region).toHaveTextContent('Avg Heart Rate');
    expect(region).toHaveTextContent('73');
    expect(region).toHaveTextContent('bpm');
    expect(region).toHaveTextContent('Average Pain');
    expect(region).toHaveTextContent('3.1');
  });

  it('renders journal entries region and heading', () => {
    renderHealthJournal();
    const region = screen.getByRole('region', { name: 'Journal entries' });
    expect(region).toBeInTheDocument();
    expect(screen.getByText('Recent Entries')).toBeInTheDocument();
  });

  it('renders first journal entry with date, time, mood, and notes', () => {
    renderHealthJournal();
    const firstEntryNotes = screen.getByText(
      /Slept well last night. Feeling energized this morning. Completed morning exercises./,
    );
    const firstArticle = firstEntryNotes.closest('article');
    expect(firstArticle).toBeInTheDocument();
    expect(
      firstArticle!.querySelector('p')?.textContent?.includes(
        new Date('2026-02-19').toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      ),
    ).toBe(true);
    expect(firstArticle).toHaveTextContent('8:30 AM');
    expect(firstArticle).toHaveTextContent('Good');
    expect(firstArticle).toHaveTextContent('Energy Level');
    expect(firstArticle).toHaveTextContent('7/10');
    expect(firstArticle).toHaveTextContent('Pain Level');
    expect(firstArticle).toHaveTextContent('2/10');
    expect(firstArticle).toHaveTextContent('Blood Pressure');
    expect(firstArticle).toHaveTextContent('120/80');
    expect(firstArticle).toHaveTextContent('Notes');
  });

  it('renders second journal entry with different data', () => {
    renderHealthJournal();
    expect(
      screen.getByText(
        new Date('2026-02-18').toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('9:15 AM')).toBeInTheDocument();
    expect(screen.getByText('Fair')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Some knee pain during physical therapy. Took medication as prescribed./,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('5/10')).toBeInTheDocument();
    expect(screen.getByText('4/10')).toBeInTheDocument();
    expect(screen.getByText('122/82')).toBeInTheDocument();
  });

  it('renders BookOpen icon in header', () => {
    renderHealthJournal();
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
