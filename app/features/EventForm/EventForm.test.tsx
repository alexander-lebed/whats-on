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

jest.mock('lucide-react/dynamic', () => ({
  DynamicIcon: () => {
    return null;
  },
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

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn());

// Mock useBreakpoint to avoid window.matchMedia error
jest.mock('@/app/hooks', () => ({
  useBreakpoint: () => ({ isMobile: false }),
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
    expect(screen.queryByText('events.validation.image-required')).toBeInTheDocument();
    expect(submit).toBeDisabled();

    // Upload image
    const file = new File(['x'], 'pic.jpg', { type: 'image/jpeg' });
    await user.upload(imageInput, file);
    await user.tab();
    expect(screen.queryByText('events.validation.image-required')).not.toBeInTheDocument();
    expect(submit).toBeDisabled();

    // Test name fields validation
    const names = screen.getAllByRole('textbox', {
      name: 'events.create.name-label',
    });
    for (const name of names) {
      await user.click(name);
      await user.tab(); // Blur
      expect(screen.getAllByText('events.validation.required'));
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
      expect(screen.getAllByText('events.validation.required'));
      expect(submit).toBeDisabled();

      await user.type(description, 'Event description');
      await user.tab();
      expect(submit).toBeDisabled();
    }
    expect(screen.queryByText('events.validation.required')).not.toBeInTheDocument();

    // Test category validation
    const musicCategory = screen.getByRole('checkbox', { name: 'events.category.music' });
    // Toggle the same category to see the error message
    await user.click(musicCategory);
    await user.click(musicCategory);
    await user.tab(); // Blur
    expect(screen.queryByText('events.validation.categories-required')).toBeInTheDocument();
    await user.click(musicCategory);
    await user.tab(); // Blur
    expect(screen.queryByText('events.validation.categories-required')).not.toBeInTheDocument();
    expect(submit).toBeDisabled();

    // Switch to the date range
    await user.click(screen.getByRole('radio', { name: 'events.create.date-range' }));
    expect(submit).toBeDisabled();

    // Test start date validation
    const startDateInput = screen.getByLabelText('events.create.start-date');
    await user.click(startDateInput);
    await user.tab(); // Blur
    expect(screen.queryByText('events.validation.required')).toBeInTheDocument();
    expect(submit).toBeDisabled();

    await user.type(startDateInput, '2026-12-25');
    await user.tab();
    expect(screen.queryByText('events.validation.required')).not.toBeInTheDocument();
    expect(submit).toBeDisabled();

    // Test end date validation
    const endDateInput = screen.getByLabelText('events.create.end-date');
    await user.click(endDateInput);
    await user.tab(); // Blur
    expect(screen.queryByText('events.validation.end-date-required')).toBeInTheDocument();
    expect(submit).toBeDisabled();

    await user.type(endDateInput, '2026-12-26');
    await user.tab();
    expect(screen.queryByText('events.validation.end-date-required')).not.toBeInTheDocument();
    expect(submit).toBeDisabled();

    // Test weekdays validation - weekdays should be auto-selected when dates change
    await waitFor(() => {
      const fridayWeekday = screen.getByRole('checkbox', { name: 'events.weekday.friday' });
      const saturdayWeekday = screen.getByRole('checkbox', { name: 'events.weekday.saturday' });
      // Both should be checked by default
      expect(fridayWeekday).toBeChecked();
      expect(saturdayWeekday).toBeChecked();
    });
    expect(screen.queryByText('events.validation.weekdays-required')).not.toBeInTheDocument();
    expect(submit).toBeDisabled();

    // Select mocked Location
    await user.click(
      screen.getByRole('button', {
        name: 'events.create.location-label',
      })
    );

    // Fill contact email to satisfy the schema's optional email constraint
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

    const startDateInput = screen.getByLabelText('events.create.start-date');
    await user.type(startDateInput, '2026-12-25');

    const endDateInput = screen.getByLabelText('events.create.end-date');
    await user.type(endDateInput, '2026-12-26');

    // Only Friday and Saturday should be available and automatically selected
    await waitFor(() => {
      const fridayCheckbox = screen.getByRole('checkbox', { name: 'events.weekday.friday' });
      const saturdayCheckbox = screen.getByRole('checkbox', { name: 'events.weekday.saturday' });
      expect(fridayCheckbox).toBeInTheDocument();
      expect(saturdayCheckbox).toBeInTheDocument();
      // Both should be checked by default when dates change
      expect(fridayCheckbox).toBeChecked();
      expect(saturdayCheckbox).toBeChecked();
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
