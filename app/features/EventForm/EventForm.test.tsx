import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventForm from './EventForm';

// Mock LocationAutocomplete to avoid Maps dependency
jest.mock('../PlaceAutocomplete/PlaceAutocomplete', () => ({
  __esModule: true,
  default: ({ onSelect }: any) => (
    <button onClick={() => onSelect({ name: 'Place', address: 'Addr', lat: 1, lng: 2 })}>
      Pick Place
    </button>
  ),
}));

describe('EventForm', () => {
  test('submits single-day event', async () => {});

  test('submits date-range event', async () => {});
});
