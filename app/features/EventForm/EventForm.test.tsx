import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlaceAutocompleteProps } from '@/app/features/PlaceAutocomplete/PlaceAutocomplete';
import { EventForm } from './EventForm';

// Mock ImageHero component to avoid render dependency
jest.mock('../ImageHero.tsx', () => ({
  __esModule: true,
  default: () => null,
  ImageHero: () => null,
}));

jest.mock('../PlaceAutocomplete/PlaceAutocomplete.tsx', () => ({
  __esModule: true,
  default: (props: PlaceAutocompleteProps) => {
    const { label, onSelect } = props;
    return React.createElement(
      'button',
      {
        'aria-label': label,
        onClick: () =>
          onSelect({
            slug: { _type: 'slug', current: 'place' },
            name: 'Place',
            address: 'Addr',
            location: { lat: 1, lng: 2 },
          }),
      },
      'Pick Location'
    );
  },
}));

// Mock router (next-intl navigation)
const pushMock = jest.fn();
jest.mock('../../../i18n/navigation', () => ({
  __esModule: true,
  useRouter: () => ({ push: pushMock }),
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob://preview');
});

beforeEach(() => {
  pushMock.mockReset();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '1', slug: 'my-event' }) })
  );
});

describe('EventForm', () => {
  const user = userEvent.setup();

  test('validates and submits date-range event form', async () => {
    render(<EventForm />);

    const submit = screen.getByRole('button', { name: 'events.create.submit' });
    expect(submit).toBeDisabled();
    expect(screen.queryByText('events.create.required-fields-message')).toBeInTheDocument();

    // Test image field validation
    const imageInput = screen.getByLabelText('events.create.image-label');
    await user.click(imageInput);
    await user.tab(); // Blur
    expect(submit).toBeDisabled();

    // Upload image
    const file = new File(['x'], 'pic.jpg', { type: 'image/jpeg' });
    await user.upload(imageInput, file);
    await user.tab();
    expect(submit).toBeDisabled();

    // Test name fields validation
    const names = screen.getAllByRole('textbox', {
      name: 'events.create.name-label',
    });
    for (const name of names) {
      await user.click(name);
      await user.tab(); // Blur
      expect(submit).toBeDisabled();

      await user.type(name, 'Event name');
      await user.tab();
      expect(submit).toBeDisabled();
    }

    // Test description fields validation
    const descriptions = screen.getAllByRole('textbox', {
      name: 'events.create.description-label',
    });
    for (const description of descriptions) {
      await user.click(description);
      await user.tab(); // Blur
      expect(submit).toBeDisabled();

      await user.type(description, 'Event description');
      await user.tab();
      expect(submit).toBeDisabled();
    }

    // Test category validation
    await user.click(screen.getByRole('checkbox', { name: 'events.category.music' }));
    expect(submit).toBeDisabled();

    // Switch to the date range
    await user.click(screen.getByRole('radio', { name: 'events.create.date-range' }));
    expect(submit).toBeDisabled();

    // Test start date validation
    const startDateInput = screen.getByLabelText('events.create.start-date');
    await user.click(startDateInput);
    await user.tab(); // Blur
    expect(submit).toBeDisabled();

    await user.type(startDateInput, '2025-12-26');
    await user.tab();
    expect(submit).toBeDisabled();

    // Test end date validation
    const endDateInput = screen.getByLabelText('events.create.end-date');
    await user.click(endDateInput);
    await user.tab(); // Blur
    expect(submit).toBeDisabled();

    await user.type(endDateInput, '2025-12-27');
    await user.tab();
    expect(submit).toBeDisabled();

    // Test weekdays validation
    await user.click(screen.getByRole('checkbox', { name: 'events.weekday.friday' }));
    await user.click(screen.getByRole('checkbox', { name: 'events.weekday.saturday' }));
    expect(submit).toBeDisabled();

    // Select mocked Location
    await user.click(
      screen.getByRole('button', {
        name: 'events.create.location-label',
      })
    );

    // Fill contact email to satisfy schema's optional email constraint
    await user.type(screen.getByLabelText('events.create.contact-email'), 'name@example.com');
    await user.tab();

    // Now the required fields should be filled and the Submit button should be enabled
    await waitFor(() =>
      expect(screen.queryByText('events.create.required-fields-message')).not.toBeInTheDocument()
    );
    expect(submit).toBeEnabled();

    fireEvent.submit(submit);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(pushMock).toHaveBeenCalledWith('/events/my-event');
  });

  test('validates weekdays for the selected date-range', async () => {
    render(<EventForm />);

    // Switch to date range mode
    await user.click(screen.getByRole('radio', { name: 'events.create.date-range' }));

    // Before dates are selected, weekday checkboxes should not be visible
    expect(
      screen.queryByRole('checkbox', { name: 'events.weekday.monday' })
    ).not.toBeInTheDocument();

    // Select start date (Friday, Dec 26, 2025)
    const startDateInput = screen.getByLabelText('events.create.start-date');
    await user.type(startDateInput, '2025-12-26');

    // Select end date (Saturday, Dec 27, 2025)
    const endDateInput = screen.getByLabelText('events.create.end-date');
    await user.type(endDateInput, '2025-12-27');

    // Only Friday and Saturday should be available
    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'events.weekday.friday' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'events.weekday.saturday' })).toBeInTheDocument();
    });

    // Other weekdays should not be visible
    expect(
      screen.queryByRole('checkbox', { name: 'events.weekday.monday' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'events.weekday.tuesday' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'events.weekday.wednesday' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'events.weekday.thursday' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'events.weekday.sunday' })
    ).not.toBeInTheDocument();
  });
});
